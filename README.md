# Portfolio — Personal Website with AI Chat Assistant

Full-stack IT portfolio featuring an AI-powered questionnaire system built with **React + Vite** (frontend), **FastAPI** (backend), **SQLite**, and deployed on **Vercel + Railway**.

## Architecture

```
┌──────────────────────┐     ┌──────────────────────────┐
│     Vercel (CDN)     │     │     Railway (Cloud)      │
│                      │     │                          │
│  ┌────────────────┐  │     │  ┌────────────────────┐  │
│  │  React + Vite  │  │  →  │  │    FastAPI +       │  │
│  │  Framer Motion │  │     │  │   Uvicorn Server   │  │
│  │  Tailwind CSS  │  │     │  │                    │  │
│  └───────┬────────┘  │     │  └──┬──────┬──────┬───┘  │
│          │           │     │     │      │      │      │
│  ┌───────┴────────┐  │     │  ┌──┴──┐ ┌─┴───┐ ┌┴───┐  │
│  │  VITE_API_URL  │  │     │  │Groq │ │Tele.│ │DB  │  │
│  │  (env var)     │  │     │  │ API │ │ Bot │ │    │  │
│  └────────────────┘  │     │  └─────┘ └─────┘ └────┘  │
└──────────────────────┘     └──────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Uvicorn |
| Database | SQLite (dev), PostgreSQL (Railway plugin — optional) |
| AI | Groq API — LLaMA 3.3 70B |
| Notifications | Telegram Bot API |
| Deployment | Vercel (frontend), Railway (backend) |

## Features

- **Hero section** with animated typing effect
- **About** section with personal bio and highlights
- **Skills** grouped by category with animated progress bars
- **Projects** filterable grid with detail expansion
- **Contact form** with validation — sends Telegram notification on submit
- **AI Chat assistant** floating widget — powered by Groq LLaMA 3.3, persists session in localStorage

## Project Structure

```
portfolio/
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/         # Navbar, Hero, About, Skills, Projects, Contact, ChatWidget, Footer
│   │   ├── hooks/              # useApi, useChat
│   │   ├── api/                # API client
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vercel.json
│   ├── vite.config.ts
│   └── package.json
├── backend/                    # FastAPI server
│   ├── app/
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── routers/            # contact, chat, projects, skills, profile
│   │   ├── services/           # Groq client, Telegram bot
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── config.py           # Environment configuration
│   │   └── database.py         # SQLite/SQLAlchemy setup
│   ├── Dockerfile
│   ├── railway.toml
│   └── requirements.txt
└── .env.example
```

## Setup

### Prerequisites

- Python 3.12+
- Node.js 20+
- npm

### 1. Clone & Install

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example backend/.env
```

Edit `backend/.env` and fill in your keys:

| Variable | Where to Get It |
|---|---|
| `GROQ_API_KEY` | https://console.groq.com |
| `TELEGRAM_BOT_TOKEN` | https://t.me/botfather — create a bot |
| `TELEGRAM_CHAT_ID` | https://t.me/userinfobot — send `/start` to get your ID |

### 3. Seed Database

```bash
cd backend
source venv/bin/activate
python -m app.seed
```

### 4. Run Locally

```bash
# Terminal 1 — Backend (port 8000)
cd backend && source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/profile` | Portfolio profile |
| GET | `/skills` | Skills grouped by category |
| GET | `/projects` | Projects list (`?featured=true&category=Full-Stack`) |
| POST | `/contact` | Submit contact form |
| POST | `/ai/chat` | Send message to AI assistant |

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub
2. Connect the repo in [Vercel](https://vercel.com/new)
3. Root directory: `frontend`
4. Add environment variable:
   - `VITE_API_URL` — your Railway backend URL (e.g. `https://your-app.railway.app`)
5. Deploy — Vercel auto-detects the Vite framework from `vercel.json`

### Backend → Railway

1. Connect the same GitHub repo in [Railway](https://railway.app/new)
2. Root directory: `backend`
3. Add environment variables (all from `.env.example`):
   - `GROQ_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
   - `CORS_ORIGINS` — include your Vercel domain
   - `DATABASE_URL` — leave as default for SQLite, or attach Railway Postgres plugin
4. Railway auto-detects `railway.toml` and builds with **Nixpacks**
5. Set a custom domain (optional) in Railway dashboard

## Telegram Notifications

When a visitor submits the contact form, the backend sends a formatted message to your Telegram:

```
📬 New Contact Form Submission

From: John Doe
Email: john@example.com
Subject: Project Inquiry
Message:
Hi, I'd love to discuss a project...
```

## License

MIT
