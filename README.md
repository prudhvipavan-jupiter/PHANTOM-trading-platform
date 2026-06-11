# P.H.A.N.T.O.M — AI Trading Platform

**Personalized High-Autonomy Neural Trading Operations Manager**

Production-ready **paper-trading platform** with **live NSE/BSE prices** (Yahoo fallback for global/crypto). Portfolio, wallet, and order execution require the Node backend (local or Render + MongoDB Atlas).

> **Disclaimer:** No trading system can guarantee 99% or 100% accuracy. This app is for testing and education. Real trading involves risk of loss.

## Live demo (Vercel)

- **Production:** https://phantom-trading-platform.vercel.app
- **Login:** https://phantom-trading-platform.vercel.app/login

**Demo login:** `admin@phantom.com` / `Honey@!2!6`

**GitHub:** https://github.com/prudhvipavan-jupiter/PHANTOM-trading-platform

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

### Backend (paper trading + live execution)

**Quick start (no Docker):**

```powershell
cd P.H.A.N.T.O.M-backend
npm install
$env:USE_MEMORY_DB="true"
$env:JWT_SECRET="your_secret"
$env:JWT_REFRESH_SECRET="your_refresh_secret"
npm start
```

API: http://localhost:5000 · Health: http://localhost:5000/health

Default paper account: `admin@phantom.com` / `Honey@!2!6` (₹10,00,000 virtual balance)

Set frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_MODE=paper
```

For persistent data, use MongoDB (`docker compose up` or Atlas) and set `MONGODB_URI` instead of `USE_MEMORY_DB`.

## Deploy frontend to Vercel

1. Push this repo to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set **Root Directory** to `P.H.A.N.T.O.M-frontend`
4. Environment variables (production):
   - `VITE_APP_MODE=paper`
   - `VITE_API_URL=https://your-render-api.onrender.com/api` (after deploying backend)
   - Market quotes work on Vercel via serverless `/api/market-data/*` without a backend

Or CLI:

```bash
cd P.H.A.N.T.O.M-frontend
npx vercel --prod
```

## What works today

- Live Indian prices via **NSE** (`market-data-pre-open`, `allIndices`) and **BSE** (`StockReachGraph`); Yahoo fallback for global
- API routes: `/api/market-data/nse/quote/:symbol`, `/api/market-data/bse/quote/:symbol`, `/api/market-data/nse/indices`
- Paper trading: BUY/SELL at live price, wallet, portfolio, trade history (with backend)
- Dashboard / wallet / portfolio wired to API (no random mock profits)
- Paper-trading disclaimers (no fake accuracy claims)

## What requires further work for real money trading

- Licensed broker integration (Zerodha, Angel One, etc.)
- Live market data feeds
- Regulatory compliance review
- Validated strategy / ML models (not simulated metrics)

## License

© J.U.P.I.T.E.R Industries. All rights reserved.
