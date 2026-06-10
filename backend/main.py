from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import json
import re

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.get("/search")
async def search_songs(q: str = Query(...)):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'format': 'bestaudio/best',
        'noplaylist': True,
        'extract_flat': True,
        'skip_download': True,
    }

    try:
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
    except Exception as e:
        print(f"Search error: {e}")
        return []


@app.get("/stream")
async def get_stream_url(url: str = Query(...)):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'format': 'bestaudio/best',
        'skip_download': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {"stream_url": info.get("url"), "title": info.get("title")}
    except Exception as e:
        print(f"Stream error for {url}: {e}")
        # Return a JSON error instead of crashing to keep CORS headers
        return {"error": str(e), "stream_url": None}


@app.get("/recommendations/{video_id}")
async def get_recommendations(video_id: str):
    ydl_opts = {
        **YDL_COMMON_OPTS,
        'extract_flat': False,
        'skip_download': True,
    }

    url = f"https://www.youtube.com/watch?v={video_id}"

    try:
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
    except Exception as e:
        print(f"Recommendations error: {e}")
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
