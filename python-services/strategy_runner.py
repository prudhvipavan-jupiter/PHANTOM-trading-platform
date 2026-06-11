"""
Example Python strategy runner for P.H.A.N.T.O.M live trading.

Requires the merged app running at http://localhost:5000 with Paytm Money linked.

Usage:
  set PHANTOM_API_URL=http://localhost:5000/api
  set PHANTOM_TOKEN=<jwt from browser localStorage phantom_token>
  set LIVE_TRADING=false
  python strategy_runner.py
"""

import os
import sys
import requests

API = os.environ.get("PHANTOM_API_URL", "http://localhost:5000/api").rstrip("/")
TOKEN = os.environ.get("PHANTOM_TOKEN", "")
LIVE = os.environ.get("LIVE_TRADING", "false").lower() == "true"
SYMBOL = os.environ.get("STRATEGY_SYMBOL", "RELIANCE")
QUANTITY = int(os.environ.get("STRATEGY_QTY", "1"))


def api_get(path: str):
    if not TOKEN:
        raise SystemExit("Set PHANTOM_TOKEN (login in browser, copy phantom_token from localStorage)")
    r = requests.get(f"{API}{path}", headers={"Authorization": f"Bearer {TOKEN}"}, timeout=30)
    r.raise_for_status()
    body = r.json()
    if not body.get("success", True):
        raise RuntimeError(body.get("error") or body)
    return body.get("data", body)


def api_post(path: str, payload: dict):
    r = requests.post(
        f"{API}{path}",
        json=payload,
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
        timeout=30,
    )
    body = r.json()
    if r.status_code >= 400 or not body.get("success", True):
        raise RuntimeError(body.get("error") or body)
    return body.get("data", body)


def main():
    print("P.H.A.N.T.O.M Python strategy runner")
    print(f"API: {API} | LIVE_TRADING={LIVE}")

    funds = api_get("/brokers/paytm/funds")
    print("Funds snapshot:", funds)

    quote_path = f"/market-data/quote/{SYMBOL}"
    quote = api_get(quote_path)
    price = quote.get("price") or quote.get("currentPrice")
    print(f"{SYMBOL} live price: {price}")

    # Simple rule: log only unless LIVE_TRADING=true
    if not LIVE:
        print(
            f"[DRY RUN] Would evaluate strategy on {SYMBOL}. "
            "Set LIVE_TRADING=true to send real orders (you can still lose money)."
        )
        return

    print(f"Placing LIVE BUY {QUANTITY} {SYMBOL} via Paytm Money...")
    result = api_post("/brokers/paytm/order", {
        "symbol": SYMBOL,
        "tradeType": "BUY",
        "quantity": QUANTITY,
        "orderType": "MKT",
        "confirmLive": True,
    })
    print("Order response:", result)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("Error:", exc)
        sys.exit(1)
