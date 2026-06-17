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
stream_cache = TTLCache(ttl_seconds=300)       # 5 minutes (YouTube URLs expire quickly)
recommendation_cache = TTLCache(ttl_seconds=3600) # 1 hour

# Shared yt-dlp options for better performance and reliability
YDL_COMMON_OPTS = {
    'quiet': True,
    'no_warnings': True,
    'source_address': '0.0.0.0',
    'nocheckcertificate': True,
    # Use a generic user agent to avoid IP/UA mismatch blocks
    'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}


def clean_title(title: str) -> str:
    # Remove common music video suffixes
    suffixes = [
        r'\(?official\s+video\)?', r'\(?official\s+audio\)?', r'\(?lyric\s+video\)?',
        r'\(?lyrics\)?', r'\(?official\)?', r'\(?hd\)?', r'\(?4k\)?', r'\(?live\)?',
        r'\(?cover\)?', r'\(?mv\)?', r'\(?audio\)?'
    ]
    title = title.lower()
    for s in suffixes:
        title = re.sub(s, '', title)
    
    title = re.sub(r'[\(\[][^()]*[\)\]]', '', title)
    title = re.sub(r'[^\w\s]', ' ', title)
    return " ".join(title.split()).strip()

def get_main_title(title: str) -> list[str]:
    # Extract the main part of the title before common separators
    title = title.lower()
    # Remove anything in brackets/parentheses first
    title = re.sub(r'[\(\[][^()]*[\)\]]', '', title)
    
    parts = []
    for sep in ['-', '|', ':', '–']:
        if sep in title:
            parts = [p.strip() for p in title.split(sep) if p.strip()]
            break
    
    if not parts:
        parts = [title.strip()]
    
    # Clean each part
    cleaned_parts = [re.sub(r'[^\w\s]', '', p).strip() for p in parts]
    return [p for p in cleaned_parts if p]


def _run_yt_search(q: str):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'format': 'bestaudio/best',
        'noplaylist': True,
        'extract_flat': True,
        'skip_download': True,
    }
    
    # Common words to filter out for search results to ensure they are actual songs
    filter_words = {
        'instrumental', 'karaoke', 'piano', 'guitar', 'backing track', 
        'tutorial', 'how to', 'lesson', 'cover', 'instrument', 'midi'
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        # Refine search query to favor official/vocal versions
        search_query = f"ytsearch30:{q} official music"
        search_results = ydl.extract_info(search_query, download=False)
        entries = []
        
        if 'entries' in search_results:
            for entry in search_results['entries']:
                entry_title = entry.get("title") or ""
                lowered_title = entry_title.lower()
                
                # Check if title contains any filter words
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
                
                # Limit to 20 high-quality results
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
        
        main_original_parts = get_main_title(original_title)

        related = []
        if 'entries' in info and info['entries']:
            related = info['entries']
        elif 'related_videos' in info:
            related = info['related_videos']

        if not related:
            search_query = f"ytsearch10:{original_title} {uploader} similar music"
            search_results = ydl.extract_info(search_query, download=False)
            if 'entries' in search_results:
                related = search_results['entries']

        recommendations = []
        seen_ids = {video_id}
        # Use tuple of sorted parts for reliable deduplication
        seen_titles = {tuple(sorted(main_original_parts))}
        
        # Additional common words to filter out for discovery
        filter_words = {'karaoke', 'instrumental', 'tutorial', 'how to', 'lesson', 'piano cover', 'guitar cover', 'lyrics'}

        for entry in related:
            entry_id = entry.get("id")
            entry_title = entry.get("title") or ""
            
            if not entry_id or entry_id in seen_ids:
                continue
                
            entry_parts = get_main_title(entry_title)
            entry_parts_tuple = tuple(sorted(entry_parts))
            
            # 1. Exact title parts match (any order)
            if entry_parts_tuple in seen_titles:
                continue
            
            # 2. Heuristic similarity check for same song/covers
            clean_original = clean_title(original_title)
            clean_entry = clean_title(entry_title)
            
            # If one cleaned title is largely contained in another, it's likely the same song
            if len(clean_original) > 8 and len(clean_entry) > 8:
                if clean_original in clean_entry or clean_entry in clean_original:
                    continue

            # Filter out junk/non-music content
            lowered_title = entry_title.lower()
            if any(word in lowered_title for word in filter_words):
                continue

            recommendations.append({
                "id": entry_id,
                "title": entry_title,
                "thumbnail": entry.get("thumbnails")[0]["url"] if entry.get("thumbnails") else None,
                "artist": entry.get("uploader") or entry.get("artist") or "Various Artists",
                "url": f"https://www.youtube.com/watch?v={entry_id}"
            })
            seen_ids.add(entry_id)
            seen_titles.add(entry_parts_tuple)

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
