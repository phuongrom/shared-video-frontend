# YouTube Sharing App — Frontend

React 19 · TypeScript · Vite · Zustand · TanStack Query · ActionCable

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| npm | >= 10 |
| Docker & Docker Compose | latest (optional) |

---

## Environment Variables

The API base URL is configured via Vite env variables.  
Create a `.env.local` file in the `frontend/` directory:

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/cable
```

> In Docker mode these are handled by nginx proxy — no `.env.local` needed.

---

## Run with Docker (recommended)

> Backend phải đang chạy trên port 3000 trước.

```bash
docker compose up --build
# App available at http://localhost:80
```

> nginx tự proxy `/api/` và `/cable` sang backend port 3000.

---

### Các lệnh Docker hay dùng

```bash
# Xem logs
docker compose logs -f frontend

# Rebuild khi thay đổi code
docker compose up --build

# Dừng
docker compose down
```

---

## Run Locally (without Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
# App available at http://localhost:5173
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Zustand | Global auth state |
| TanStack Query | Server state / data fetching |
| ActionCable (`@rails/actioncable`) | Real-time WebSocket notifications |
| Sonner | Toast notifications |
