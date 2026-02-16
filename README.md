# Ojay Laptop Store (Frontend + Backend)

This project now includes:

- React + Vite frontend
- Express backend API
- Single-service production hosting (API + static frontend from `dist`)

## Tech Stack

- Frontend: React, React Router, Vite
- Backend: Express, CORS
- Dev runner: concurrently

## API Endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/meta`

`/api/products` supports query params:

- `category=...` (valid values: `Laptop`, `Accessory`)
- `q=searchTerm`
- `sort=price-asc|price-desc|rating|name`

## Local Development

Install dependencies:

```bash
npm install
```

Run frontend + backend together:

```bash
npm run dev:full
```

Services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Production Build and Run

Build frontend:

```bash
npm run build
```

Start backend (serves API + built frontend):

```bash
npm start
```

## Environment Variables

Copy `.env.example` and set values as needed:

- `PORT`: backend port (default `5000`)
- `FRONTEND_ORIGIN`: allowed origin for CORS in development
- `VITE_API_BASE_URL`: optional absolute API base URL for frontend (leave empty for same-origin)

## Deploy (Single Service)

Deploy this folder as a Node service on Render/Railway/Fly.io.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Node version: 18+ recommended

Because Express serves `dist`, frontend routes and API routes work from one deployment URL.
