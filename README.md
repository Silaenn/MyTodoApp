<p align="center">
  <img src="public/images/logo.png" alt="TaskTune Logo" width="100" />
</p>

<h1 align="center">TaskTune</h1>
<p align="center">
  <b>Task management, backed by a beat.</b><br />
  A full-stack productivity app with an embedded YouTube music player.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Turso-libSQL-2EB67D?style=flat-square&logo=sqlite" alt="Turso" />
  <img src="https://img.shields.io/badge/Auth.js-v5-7357FF?style=flat-square" alt="Auth.js" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License" />
</p>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)
- [Author](#author)

---

## About

**TaskTune** is a full-stack web application that merges task management with a streaming music player. It was built for people who work better with background music — instead of switching between a to-do app and a music service, TaskTune keeps everything in one place.

The frontend is a **Next.js 15** (App Router) single-page application with a distinctive **brutalist UI** design. The backend is a **FastAPI** server that wraps `yt-dlp` to search YouTube, extract streaming audio URLs, and generate music recommendations with intelligent deduplication.

Tasks are persisted in **Turso** (libSQL/SQLite at the edge), and authentication is handled via **Auth.js v5** with Google OAuth.

---

## Features

- **Task Management** — Create, update, delete, and mark tasks as done. Filter by category, search by title, and sort by date or deadline.
- **Deadline Tracking** — Tasks with passed deadlines are visually flagged. Overdue highlighting keeps you accountable.
- **YouTube Music Search** — Search YouTube for any track via the FastAPI backend. Results are cached for one hour.
- **Streaming Audio Player** — Play audio directly in the browser. Supports shuffle, repeat (one/all), volume control, and progress scrubbing.
- **Radio Mode** — When the queue is about to run out, the app automatically fetches music recommendations based on the current track. Duplicate titles (covers, live versions) are filtered out using word-overlap similarity.
- **Smart Preloading** — The next two tracks are pre-fetched in the background for gapless playback.
- **Favorite Tracks** — Like tracks to build a personal library. Persisted across sessions via Zustand + localStorage.
- **Responsive Music Drawer** — On mobile, the player expands into a full-height drawer with album art and all controls.
- **Google OAuth** — Login with a single click. No password setup required.
- **Brutalist Design System** — Bold borders, heavy shadows, high-contrast typography, and oversized UI elements.
- **Animated Transitions** — Page loads, list updates, and drawer toggles use Framer Motion spring animations.

---

## Tech Stack

### Frontend

| Technology                  | Purpose                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| **Next.js 15** (App Router) | React framework with server components, API routes, and middleware |
| **React 19**                | UI library                                                         |
| **TypeScript 5**            | Static typing                                                      |
| **Tailwind CSS 3.4**        | Utility-first styling with a custom brutalist design system        |
| **Zustand**                 | Client-side state management for the music player                  |
| **Framer Motion**           | Page and UI animations                                             |
| **Radix UI**                | Accessible primitives (Dialog, DropdownMenu, Select, Label)        |
| **Lucide React**            | Icon library                                                       |
| **Auth.js v5**              | Google OAuth authentication with JWT sessions                      |

### Backend

| Technology              | Purpose                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| **FastAPI**             | Python web framework                                                          |
| **yt-dlp**              | YouTube metadata extraction and audio stream resolution                       |
| **Uvicorn**             | ASGI server                                                                   |
| **In-memory TTL Cache** | Caches search results (1 hr), stream URLs (5 min), and recommendations (1 hr) |

### Database

| Technology         | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| **Turso** (libSQL) | Edge-hosted SQLite database for task persistence              |
| **@libsql/client** | TypeScript client with automatic retry on connection timeouts |

---

## Screenshots

```
<!-- Dashboard -->
![Dashboard](screenshots/dashboard.png)

<!-- Task Board -->
![Task Board](screenshots/tasks.png)

<!-- Music Search -->
![Music Search](screenshots/music-search.png)

<!-- Music Player (Desktop) -->
![Desktop Player](screenshots/player-desktop.png)

<!-- Music Player (Mobile Drawer) -->
![Mobile Drawer](screenshots/player-mobile.png)

<!-- Login -->
![Login](screenshots/login.png)
```

> Screenshots will be added once the project reaches a stable release.

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **Python** 3.10 or later
- **npm** 10+ or **pnpm**
- A **Turso** database (free tier works)
- A **Google Cloud Console** project with OAuth 2.0 credentials

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/my-todo-app.git
cd my-todo-app

# 2. Install frontend dependencies
npm install

# 3. Set up the Python backend
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 4. Copy the environment file and fill in your values
cp .env.local.example .env.local
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Turso Database
TURSO_CONNECTION_URL=libs://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# Auth.js
AUTH_URL=http://localhost:3000
AUTH_SECRET=your-random-auth-secret

# Google OAuth (https://console.cloud.google.com)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# FastAPI Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Generating an `AUTH_SECRET`**:

```bash
openssl rand -base64 32
```

### Database Setup

Run the initialization script to create the `tasks` table:

```bash
node scripts/init-db.js
```

---

## Usage

Start both servers in separate terminals.

### 1. Backend (FastAPI)

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 2. Frontend (Next.js)

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Walkthrough

1. **Sign in** with your Google account on the login page.
2. **Dashboard** shows your active task count, liked tracks, and quick-access cards.
3. **Tasks page** (`/tasks`) — manage your to-do list. Click the circle icon to mark a task as done.
4. **Music page** (`/musics`) — search for any song. Click the play button to start streaming. Liked tracks appear at the top.
5. **Music footer** — controls are always accessible at the bottom. On mobile, tap the album art to open the full drawer.

---

## Project Structure

```
my-todo-app/
├── backend/
│   └── main.py                    # FastAPI server (search, stream, recommendations)
├── public/
│   └── images/
│       ├── logo.png               # Application logo
│       └── no_image.png           # Fallback thumbnail
├── scripts/
│   ├── init-db.js                 # Database table creation
│   └── migrate-db.js              # Database migration helper
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth] # NextAuth API route handler
│   │   │   └── tasks/             # Task CRUD API routes
│   │   ├── login/page.tsx         # Login page
│   │   ├── musics/page.tsx        # Music search & discovery page
│   │   ├── tasks/page.tsx         # Task management page
│   │   ├── globals.css            # Global styles & design tokens
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Dashboard (homepage)
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── Dashboard.tsx          # 🗑️ (deprecated — merged into Home)
│   │   ├── DeleteConfirm.tsx      # Delete confirmation modal
│   │   ├── Dialog.tsx             # Task create/edit dialog
│   │   ├── Footer.tsx             # Music player footer & drawer
│   │   ├── Home.tsx               # Dashboard component
│   │   ├── LayoutClient.tsx       # Client-side layout wrapper
│   │   └── MusicSpacer.tsx        # Bottom spacing for fixed footer
│   ├── lib/
│   │   ├── music-store.ts         # Zustand store (player state, queue, likes)
│   │   ├── turso.ts               # Turso client with retry logic
│   │   └── utils.ts               # cn() utility
│   ├── auth.ts                    # Auth.js configuration
│   └── middleware.ts              # Route protection & redirects
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind design system tokens
├── components.json                # shadcn/ui configuration
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Deployment

### Frontend (Vercel)

The Next.js app is ready for deployment on **Vercel**:

```bash
npx vercel deploy
```

Set the environment variables in the Vercel dashboard (Turso connection, Auth.js secrets, Google OAuth, backend URL).

### Backend (Any Cloud)

The FastAPI backend can be deployed to services like **Railway**, **Render**, or **Fly.io**:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

Make sure `NEXT_PUBLIC_BACKEND_URL` in the frontend points to the deployed backend URL, and update the `allow_origins` list in `backend/main.py` to include your frontend domain.

### Database

Turso is already edge-hosted — no additional deployment steps are needed for the database.

---

## Author

**Deoosilaen** — [@deoosilaen](https://github.com/deoosilaen)

Project Link: [https://github.com/deoosilaen/my-todo-app](https://github.com/deoosilaen/my-todo-app)
