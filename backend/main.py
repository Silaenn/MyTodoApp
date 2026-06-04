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
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        # Append "music" to the query to get better results
        # Adding topic:music or just music helps filter out non-music content
        search_query = f"ytsearch10:{q} music"
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
