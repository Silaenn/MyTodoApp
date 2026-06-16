from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import json
import re
import anyio
import time
from typing import Dict, Any, Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple TTL Cache Implementation
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

# Caches for different purposes
search_cache = TTLCache(ttl_seconds=3600)      # 1 hour
stream_cache = TTLCache(ttl_seconds=1200)      # 20 minutes (YouTube URLs expire)
recommendation_cache = TTLCache(ttl_seconds=3600) # 1 hour

# Shared yt-dlp options for better performance and reliability
YDL_COMMON_OPTS = {
    'quiet': True,
    'no_warnings': True,
    'source_address': '0.0.0.0',
    'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'nocheckcertificate': True,
}


def clean_title(title: str) -> str:
    title = re.sub(r'[\(\[][^()]*[\)\]]', '', title)
    title = re.sub(r'[^\w\s]', '', title).lower().strip()
    return title


def _run_yt_search(q: str):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'format': 'bestaudio/best',
        'noplaylist': True,
        'extract_flat': True,
        'skip_download': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        search_query = f"ytsearch20:{q} music"
        search_results = ydl.extract_info(search_query, download=False)
        entries = []
        if 'entries' in search_results:
            for entry in search_results['entries']:
                entries.append({
                    "id": entry.get("id"),
                    "title": entry.get("title"),
                    "thumbnail": entry.get("thumbnails")[0]["url"] if entry.get("thumbnails") else None,
                    "artist": entry.get("uploader"),
                    "duration": entry.get("duration"),
                    "url": f"https://www.youtube.com/watch?v={entry.get('id')}"
                })
        return entries


@app.get("/search")
async def search_songs(q: str = Query(...)):
    cached_result = search_cache.get(q)
    if cached_result:
        return cached_result

    try:
        entries = await anyio.to_thread.run_sync(_run_yt_search, q)
        search_cache.set(q, entries)
        return entries
    except Exception as e:
        print(f"Search error: {e}")
        return []


def _run_yt_stream(url: str):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'format': 'bestaudio[protocol!=m3u8][protocol!=m3u8_native]/bestaudio',
        'skip_download': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        selected_url = info.get("url")
        ext = info.get("ext", "")
        protocol = info.get("protocol", "")
        return {
            "stream_url": selected_url,
            "title": info.get("title"),
            "ext": ext,
            "protocol": protocol
        }


@app.get("/stream")
async def get_stream_url(url: str = Query(...)):
    cached_result = stream_cache.get(url)
    if cached_result:
        return cached_result

    try:
        result = await anyio.to_thread.run_sync(_run_yt_stream, url)
        if result["stream_url"]:
            stream_cache.set(url, result)
        return result
    except Exception as e:
        print(f"Stream error for {url}: {e}")
        return {"error": str(e), "stream_url": None}


def _run_yt_recommendations(video_id: str):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'extract_flat': False,
        'skip_download': True,
    }
    url = f"https://www.youtube.com/watch?v={video_id}"
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        title = info.get('title', '')
        uploader = info.get('uploader', '')
        cleaned_original_title = clean_title(title)

        related = []
        if 'entries' in info and info['entries']:
            related = info['entries']
        elif 'related_videos' in info:
            related = info['related_videos']

        if not related:
            search_query = f"ytsearch5:{title} {uploader} similar music"
            search_results = ydl.extract_info(search_query, download=False)
            if 'entries' in search_results:
                related = search_results['entries']

        recommendations = []
        seen_cleaned_titles = {cleaned_original_title}

        for entry in related:
            entry_id = entry.get("id")
            entry_title = entry.get("title") or ""
            cleaned_entry_title = clean_title(entry_title)

            if entry_id and entry_id != video_id and cleaned_entry_title not in seen_cleaned_titles:
                if len(cleaned_entry_title) > 2:
                    recommendations.append({
                        "id": entry_id,
                        "title": entry_title,
                        "thumbnail": entry.get("thumbnails")[0]["url"] if entry.get("thumbnails") else None,
                        "artist": entry.get("uploader") or entry.get("artist") or "Various Artists",
                        "url": f"https://www.youtube.com/watch?v={entry_id}"
                    })
                    seen_cleaned_titles.add(cleaned_entry_title)

            if len(recommendations) >= 5:
                break
        return recommendations


@app.get("/recommendations/{video_id}")
async def get_recommendations(video_id: str):
    cached_result = recommendation_cache.get(video_id)
    if cached_result:
        return cached_result

    try:
        recommendations = await anyio.to_thread.run_sync(_run_yt_recommendations, video_id)
        recommendation_cache.set(video_id, recommendations)
        return recommendations
    except Exception as e:
        print(f"Recommendations error: {e}")
        return []


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
