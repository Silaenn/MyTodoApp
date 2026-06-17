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
search_cache = TTLCache(ttl_seconds=3600)         # 1 hour
# 5 minutes (YouTube URLs expire quickly)
stream_cache = TTLCache(ttl_seconds=300)
recommendation_cache = TTLCache(ttl_seconds=3600)  # 1 hour

# Shared yt-dlp options for better performance and reliability
YDL_COMMON_OPTS = {
    'quiet': True,
    'no_warnings': True,
    'source_address': '0.0.0.0',
    'nocheckcertificate': True,
    'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}


def clean_title(title: str) -> str:
    """Bersihkan judul dari suffix umum music video."""
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


def get_main_title(title: str) -> list[str]:
    """Ambil bagian utama judul sebelum separator umum."""
    title = title.lower()
    title = re.sub(r'[\(\[][^()]*[\)\]]', '', title)

    parts = []
    for sep in ['-', '|', ':', '–']:
        if sep in title:
            parts = [p.strip() for p in title.split(sep) if p.strip()]
            break

    if not parts:
        parts = [title.strip()]

    cleaned_parts = [re.sub(r'[^\w\s]', '', p).strip() for p in parts]
    return [p for p in cleaned_parts if p]


def titles_are_duplicate(title1: str, title2: str, threshold: float = 0.7) -> bool:
    """
    Cek apakah dua judul adalah lagu yang sama (cover, versi lain, dll).
    Menggunakan word-overlap similarity — bukan exact match.
    Threshold 0.7 = 70% kata yang sama dianggap duplikat.

    Contoh:
    - "Bukti KasihMu" vs "Bukti KasihMu (Cover)" → True (duplikat)
    - "Bukti KasihMu" vs "Kasih Setia-Mu" → False (lagu berbeda, genre sama)
    - "Amazing Grace" vs "Amazing Grace Live Version" → True (duplikat)
    """
    clean1_words = set(clean_title(title1).split())
    clean2_words = set(clean_title(title2).split())

    # Hapus kata yang terlalu pendek (noise)
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


def get_keywords(title: str) -> set[str]:
    """
    Ambil kata kunci dari judul untuk keperluan debug/logging saja.
    TIDAK lagi digunakan untuk filtering rekomendasi.
    """
    stop_words = {
        'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'and', 'or', 'but',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'official', 'video', 'audio',
        'lyrics', 'lyric', 'cover', 'mv', 'live', 'remix', 'ft', 'feat', 'music',
        'hd', '4k', 'visualizer', 'exclusive', 'full', 'song'
    }
    title = title.lower()
    title = re.sub(r'[\(\[][^()]*[\)\]]', '', title)
    title = re.sub(r'[^\w\s]', ' ', title)

    words = title.split()
    return {w for w in words if w not in stop_words and len(w) > 2}


def _run_yt_search(q: str):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'format': 'bestaudio/best',
        'noplaylist': True,
        'extract_flat': True,
        'skip_download': True,
    }

    # Filter konten non-musik yang jelas
    filter_words = {
        'instrumental', 'karaoke', 'piano', 'guitar', 'backing track',
        'tutorial', 'how to', 'lesson', 'instrument', 'midi'
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        search_query = f"ytsearch30:{q} official music"
        search_results = ydl.extract_info(search_query, download=False)
        entries = []

        if 'entries' in search_results:
            for entry in search_results['entries']:
                entry_title = entry.get("title") or ""
                lowered_title = entry_title.lower()

                if any(word in lowered_title for word in filter_words):
                    continue

                entries.append({
                    "id": entry.get("id"),
                    "title": entry.get("title"),
                    "thumbnail": entry.get("thumbnails")[0]["url"] if entry.get("thumbnails") else None,
                    "artist": entry.get("uploader"),
                    "duration": entry.get("duration"),
                    "url": f"https://www.youtube.com/watch?v={entry.get('id')}"
                })

                if len(entries) >= 20:
                    break

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
        original_title = info.get('title', '')
        uploader = info.get('uploader', '')

        print(
            f"[Recommendations] Fetching recs for: '{original_title}' by '{uploader}'")

        # Filter konten non-musik
        junk_words = {'karaoke', 'instrumental', 'tutorial',
                      'how to', 'lesson', 'piano cover', 'guitar cover'}

        related = []
        if 'entries' in info and info['entries']:
            related = info['entries']
        elif 'related_videos' in info:
            related = info['related_videos']

        # Fallback: search similar jika tidak ada related
        if not related:
            search_query = f"ytsearch15:{original_title} {uploader} similar music"
            search_results = ydl.extract_info(search_query, download=False)
            if 'entries' in search_results:
                related = search_results['entries']

        recommendations = []
        seen_ids = {video_id}

        for entry in related:
            entry_id = entry.get("id")
            entry_title = entry.get("title") or ""

            if not entry_id or entry_id in seen_ids:
                continue

            # Filter junk content
            lowered_title = entry_title.lower()
            if any(word in lowered_title for word in junk_words):
                continue

            # ✅ FIX: Gunakan title similarity, BUKAN keyword overlap
            # Ini mencegah cover/versi lain dari lagu yang sama,
            # tapi tetap mengizinkan lagu satu genre (misal: sesama lagu rohani)
            if titles_are_duplicate(original_title, entry_title):
                continue

            recommendations.append({
                "id": entry_id,
                "title": entry_title,
                "thumbnail": entry.get("thumbnails")[0]["url"] if entry.get("thumbnails") else None,
                "artist": entry.get("uploader") or entry.get("artist") or "Various Artists",
                "url": f"https://www.youtube.com/watch?v={entry_id}"
            })
            seen_ids.add(entry_id)

            if len(recommendations) >= 5:
                break

        # Fallback 1: Broader search jika hasil terlalu sedikit
        if not recommendations:
            print("[Recommendations] No results, trying broader genre search...")
            search_query = f"ytsearch20:{original_title} similar songs"
            fallback_results = _run_yt_search(search_query)

            for entry in fallback_results:
                entry_id = entry.get("id")
                entry_title = entry.get("title") or ""

                if entry_id in seen_ids:
                    continue

                if not titles_are_duplicate(original_title, entry_title):
                    recommendations.append(entry)
                    seen_ids.add(entry_id)

                if len(recommendations) >= 5:
                    break

        # Fallback 2 (Emergency): ambil saja related track yang ID-nya berbeda
        if not recommendations:
            print("[Recommendations] Emergency fallback: taking any related track.")
            for entry in related:
                entry_id = entry.get("id")
                if entry_id not in seen_ids and len(recommendations) < 5:
                    recommendations.append({
                        "id": entry_id,
                        "title": entry.get("title"),
                        "thumbnail": entry.get("thumbnails")[0]["url"] if entry.get("thumbnails") else None,
                        "artist": entry.get("uploader") or entry.get("artist") or "Various Artists",
                        "url": f"https://www.youtube.com/watch?v={entry_id}"
                    })
                    seen_ids.add(entry_id)

        print(f"[Recommendations] Returning {len(recommendations)} tracks.")
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
