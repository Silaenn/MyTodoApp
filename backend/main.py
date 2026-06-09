from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/search")
async def search_songs(q: str = Query(...)):
    ydl_opts = {
        'format': 'bestaudio/best',
        'noplaylist': True,
        'extract_flat': True,
        'quiet': True,
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        # Increased to 20 results
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


@app.get("/stream")
async def get_stream_url(url: str = Query(...)):
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {"stream_url": info.get("url"), "title": info.get("title")}


@app.get("/recommendations/{video_id}")
async def get_recommendations(video_id: str):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'skip_download': True,
    }

    url = f"https://www.youtube.com/watch?v={video_id}"

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            # Kita mengambil info video saat ini, yt-dlp akan menyertakan 'related_videos' di metadata
            info = ydl.extract_info(url, download=False)

            # YouTube biasanya memberikan related videos dalam entri atau metadata khusus
            related = info.get('entries') or info.get('related_videos') or []

            recommendations = []
            for entry in related:
                if entry.get("id"):
                    recommendations.append({
                        "id": entry.get("id"),
                        "title": entry.get("title"),
                        "thumbnail": entry.get("thumbnails")[0]["url"] if entry.get("thumbnails") else None,
                        "artist": entry.get("uploader") or entry.get("artist") or "Unknown Artist",
                        "url": f"https://www.youtube.com/watch?v={entry.get('id')}"
                    })
                if len(recommendations) >= 10:
                    break

            return recommendations
        except Exception as e:
            print(f"Error fetching recommendations: {e}")
            return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
