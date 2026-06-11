# P.H.A.N.T.O.M — AI Trading Platform

**Personalized High-Autonomy Neural Trading Operations Manager**

Production-ready **demo / paper-trading UI** for testing. The live Vercel deployment uses **simulated market data** unless you connect a backend API.

> **Disclaimer:** No trading system can guarantee 99% or 100% accuracy. This app is for testing and education. Real trading involves risk of loss.

## Live demo (Vercel)

After deployment, the public URL will be listed here and in the GitHub repo description.

**Demo login:** `admin@phantom.com` / `Honey@!2!6`

## Project structure

| Folder | Description |
|--------|-------------|
| `P.H.A.N.T.O.M-frontend` | React + Vite UI (deploy to Vercel) |
| `P.H.A.N.T.O.M-backend` | Node.js API (MongoDB + Redis; deploy separately) |

## Run locally

### Frontend

```bash
cd P.H.A.N.T.O.M-frontend
npm install
npm run dev
```

Open http://localhost:5173

### Backend (optional)

Requires MongoDB and Redis.

```bash
cd P.H.A.N.T.O.M-backend
cp env.example .env
npm install
npm run setup
npm run dev
```

Set frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=false
VITE_APP_MODE=paper
```

## Deploy frontend to Vercel

1. Push this repo to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set **Root Directory** to `P.H.A.N.T.O.M-frontend`
4. Environment variables (production):
   - `VITE_USE_MOCK=true`
   - `VITE_APP_MODE=demo`

Or CLI:

```bash
cd P.H.A.N.T.O.M-frontend
npx vercel --prod
```

## What works today

- Full trading UI (dashboard, portfolio, market watch, AI pages, etc.)
- Demo auth with mock API (Vercel)
- Optional backend connection for auth / portfolio overview
- Paper-trading mode banners and legal disclaimers

## What requires further work for real money trading

- Licensed broker integration (Zerodha, Angel One, etc.)
- Live market data feeds
- Regulatory compliance review
- Validated strategy / ML models (not simulated metrics)

## License

© J.U.P.I.T.E.R Industries. All rights reserved.
