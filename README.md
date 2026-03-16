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

## Deploy on AWS

The best fit for the current codebase is a single EC2 instance because:

- the frontend is built into `client/dist`
- the Express server already serves the frontend and API together
- app data is currently stored in `server/data/store.json`, so this should run on one server unless you move data to a database

Recommended path:

1. Launch an Amazon Linux 2023 EC2 instance
2. Open inbound security group rules for `80`, `443`, and `22`
3. Copy this project to `/var/www/laptop-store`
4. Configure `server/.env`
5. Run [`ops/deploy.sh`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/ops/deploy.sh) on the instance

Detailed AWS instructions live in [`ops/aws-ec2-deploy.md`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/ops/aws-ec2-deploy.md).

## Auto Deploy On Git Push

This repo can auto-deploy to the EC2 server after every push to `main` using a GitHub self-hosted runner on the EC2 server.

What it does:

- runs the workflow directly on your EC2 instance
- copies the latest repo contents into `/var/www/laptop-store`
- preserves `server/.env`
- preserves live store data by moving it outside the git working tree
- reruns the existing deploy script

Files involved:

- [`.github/workflows/deploy.yml`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/.github/workflows/deploy.yml)
- [`ops/github-deploy.sh`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/ops/github-deploy.sh)
- [`ops/github-runner-setup.md`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/ops/github-runner-setup.md)

### One-Time GitHub Setup

Set up a self-hosted runner on the EC2 server using [`ops/github-runner-setup.md`](/c:/Users/user/Desktop/SOFTWARE/Lap/laptop-store/ops/github-runner-setup.md).

After that, add one repository variable:

- `APP_DOMAIN`: optional; use your real domain later, or set it to `51.20.5.125` for now

1. Commit these workflow changes
2. Push to `main`
3. GitHub Actions will deploy automatically

### Important Note About Live Data

This app stores users and orders in a JSON file. Auto-deploy now preserves that file by setting `STORE_FILE=/var/www/oj-devices-data/store.json` on the server during deployment.
