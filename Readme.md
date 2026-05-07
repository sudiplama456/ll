# Phonebook

A simple full-stack phonebook app — Express backend + React/Vite frontend.

## Local development

**Backend** (runs on port 3001):
```bash
npm install
npm run dev
```

**Frontend** (runs on port 5173, proxies /api to backend):
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
cd frontend
npm run build   # outputs to frontend/dist/
cd ..
npm start       # serves frontend/dist + API on port 3001
```

## Deploy to Render

1. Push this repo to GitHub
2. Go to render.com → New → Web Service
3. Connect your repo and set:
   - **Build command:** `npm install && cd frontend && npm install && npm run build`
   - **Start command:** `node server.js`
4. Deploy — Render provides the public URL




Render Deployed URL = "https://cicd-0yqd.onrender.com"


this is for pull request please merge it 