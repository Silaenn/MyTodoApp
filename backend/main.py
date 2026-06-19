from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import re
import time
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.environ.get("YOUTUBE_API_KEY")
if not API_KEY:
    print("WARNING: YOUTUBE_API_KEY environment variable not set")

SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
VIDEO_URL = "https://www.googleapis.com/youtube/v3/videos"

NON_MUSIC_KEYWORDS = [
    'instrumental', 'karaoke', 'piano', 'guitar', 'backing track',
    'tutorial', 'how to', 'lesson', 'instrument', 'midi',
    'sound test', 'bass test', 'speaker test', 'subwoofer test',
    'sound check', 'bass boost', 'bass boosted', 'extreme bass',
    'test sound', 'cek sound', 'full bass', 'mega bass',
    'dj cek', 'dj sound', 'dj bass', 'bass vibration',
    'audiophile', 'sound system', 'quality check',
    'music quiz', 'quiz challenge', 'test your',
    '#shorts', 'shorts', 'short video',
]


class TTLCache:
    def __init__(self, ttl_seconds: int):
        self.ttl = ttl_seconds
        self.cache: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["timestamp"] < self.ttl:
                return entry["data"]
            else:
                del self.cache[key]
        return None

    def set(self, key: str, data: Any):
        self.cache[key] = {
            "data": data,
            "timestamp": time.time()
        }


search_cache = TTLCache(ttl_seconds=3600)
recommendation_cache = TTLCache(ttl_seconds=3600)


def clean_title(title: str) -> str:
    suffixes = [
        r'\(?official\s+video\)?', r'\(?official\s+audio\)?', r'\(?lyric\s+video\)?',
        r'\(?lyrics\)?', r'\(?official\)?', r'\(?hd\)?', r'\(?4k\)?', r'\(?live\)?',
        r'\(?cover\)?', r'\(?mv\)?', r'\(?audio\)?'
    ]
    title = title.lower()
    for s in suffixes:
        title = re.sub(s, '', title, flags=re.IGNORECASE)
    title = re.sub(r'[\(\[][^()]*[\)\]]', '', title)
    title = re.sub(r'[^\w\s]', ' ', title)
    return " ".join(title.split()).strip()


def titles_are_duplicate(title1: str, title2: str, threshold: float = 0.7) -> bool:
    clean1_words = set(clean_title(title1).split())
    clean2_words = set(clean_title(title2).split())
    clean1_words = {w for w in clean1_words if len(w) > 2}
    clean2_words = {w for w in clean2_words if len(w) > 2}
    if not clean1_words or not clean2_words:
        return False
    overlap = clean1_words.intersection(clean2_words)
    similarity = len(overlap) / min(len(clean1_words), len(clean2_words))
    is_dup = similarity >= threshold
    if is_dup:
        print(f"  [DUP] '{title1}' ~ '{title2}' (similarity={similarity:.2f})")
    return is_dup


async def _fetch_video_info(video_id: str) -> tuple[str, str]:
    async with httpx.AsyncClient() as client:
        params = {
            "part": "snippet",
            "id": video_id,
            "key": API_KEY,
        }
        resp = await client.get(VIDEO_URL, params=params)
        resp.raise_for_status()
        data = resp.json()
        items = data.get("items", [])
        if items:
            snippet = items[0].get("snippet", {})
            return snippet.get("title", ""), snippet.get("channelTitle", "")
        return "", ""


def _extract_thumbnail(snippet: dict) -> str:
    thumbs = snippet.get("thumbnails", {})
    return (
        thumbs.get("high", {}).get("url")
        or thumbs.get("medium", {}).get("url")
        or thumbs.get("default", {}).get("url")
        or ""
    )


def _build_track(item: dict) -> Optional[dict]:
    snippet = item.get("snippet", {})
    entry_id = item.get("id", {})
    if isinstance(entry_id, dict):
        video_id = entry_id.get("videoId")
    else:
        video_id = entry_id
    if not video_id:
        return None
    title = snippet.get("title", "")
    return {
        "id": video_id,
        "title": title,
        "thumbnail": _extract_thumbnail(snippet),
        "artist": snippet.get("channelTitle", ""),
        "url": f"https://www.youtube.com/watch?v={video_id}"
    }


@app.get("/search")
async def search_songs(q: str = Query(...)):
    cached = search_cache.get(q)
    if cached:
        return cached

    try:
        params = {
            "part": "snippet",
            "type": "video",
            "videoCategoryId": "10",
            "maxResults": 50,
            "q": q,
            "videoEmbeddable": "true",
            "key": API_KEY,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(SEARCH_URL, params=params)
            resp.raise_for_status()
            data = resp.json()

        non_music_keywords = NON_MUSIC_KEYWORDS

        entries = []
        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            title = snippet.get("title", "")
            lowered = title.lower()

            if any(kw in lowered for kw in non_music_keywords):
                continue

            track = _build_track(item)
            if track:
                entries.append(track)

        result = entries[:20]
        search_cache.set(q, result)
        return result
    except Exception as e:
        print(f"Search error: {e}")
        return []


@app.get("/recommendations/{video_id}")
async def get_recommendations(video_id: str):
    cached = recommendation_cache.get(video_id)
    if cached:
        return cached

    try:
        original_title, uploader = await _fetch_video_info(video_id)
        print(f"[Recommendations] Fetching recs for: '{original_title}' by '{uploader}'")

        search_query = f"{uploader} music" if uploader else f"{original_title} music"
        if uploader:
            search_query = f"{uploader} - topic"

        params = {
            "part": "snippet",
            "type": "video",
            "videoCategoryId": "10",
            "maxResults": 15,
            "q": search_query,
            "key": API_KEY,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(SEARCH_URL, params=params)
            resp.raise_for_status()
            data = resp.json()

        junk_words = NON_MUSIC_KEYWORDS
        recommendations = []
        seen_ids = {video_id}

        for item in data.get("items", []):
            snippet = item.get("snippet", {})
            entry_title = snippet.get("title", "")
            entry_id = item.get("id", {})
            if isinstance(entry_id, dict):
                entry_id = entry_id.get("videoId")
            if not entry_id or entry_id in seen_ids:
                continue

            lowered_title = entry_title.lower()
            if any(word in lowered_title for word in junk_words):
                continue

            if titles_are_duplicate(original_title, entry_title):
                continue

            recommendations.append({
                "id": entry_id,
                "title": entry_title,
                "thumbnail": _extract_thumbnail(snippet),
                "artist": snippet.get("channelTitle", "") or "Various Artists",
                "url": f"https://www.youtube.com/watch?v={entry_id}"
            })
            seen_ids.add(entry_id)

            if len(recommendations) >= 5:
                break

        if not recommendations:
            print("[Recommendations] No results, trying broader genre search...")
            broader_query = f"{uploader} similar songs" if uploader else f"{original_title} similar songs"
            broader_params = {
                "part": "snippet",
                "type": "video",
                "videoCategoryId": "10",
            "maxResults": 50,
                "q": broader_query,
                "key": API_KEY,
            }
            async with httpx.AsyncClient() as bc:
                broader_resp = await bc.get(SEARCH_URL, params=broader_params)
                broader_resp.raise_for_status()
                broader_data = broader_resp.json()

            for item in broader_data.get("items", []):
                snippet = item.get("snippet", {})
                entry_title = snippet.get("title", "")
                entry_id = item.get("id", {})
                if isinstance(entry_id, dict):
                    entry_id = entry_id.get("videoId")
                if not entry_id or entry_id in seen_ids:
                    continue

                if not titles_are_duplicate(original_title, entry_title):
                    recommendations.append({
                        "id": entry_id,
                        "title": entry_title,
                        "thumbnail": _extract_thumbnail(snippet),
                        "artist": snippet.get("channelTitle", "") or "Various Artists",
                        "url": f"https://www.youtube.com/watch?v={entry_id}"
                    })
                    seen_ids.add(entry_id)

                if len(recommendations) >= 5:
                    break

        print(f"[Recommendations] Returning {len(recommendations)} tracks.")
        recommendation_cache.set(video_id, recommendations)
        return recommendations
    except Exception as e:
        print(f"Recommendations error: {e}")
        return []


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
