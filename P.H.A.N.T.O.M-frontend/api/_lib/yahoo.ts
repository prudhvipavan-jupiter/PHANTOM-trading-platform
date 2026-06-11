const BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';

export const WATCHLIST = {
  indian: [
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'LT.NS', 'AXISBANK.NS',
  ],
  global: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'BTC-USD', 'ETH-USD'],
  indices: ['^NSEI', '^BSESN'],
};

export async function fetchQuote(symbol: string) {
  const url = `${BASE}${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PHANTOM/1.0)' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const result = data?.chart?.result?.[0];
  if (!result) return null;
  const meta = result.meta || {};
  const price = meta.regularMarketPrice ?? 0;
  const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prev;
  return {
    symbol: (meta.symbol || symbol).toUpperCase(),
    symbolName: meta.shortName || symbol,
    currentPrice: price,
    price,
    change,
    changePercent: prev ? (change / prev) * 100 : 0,
    volume: meta.regularMarketVolume ?? 0,
    high: meta.regularMarketDayHigh ?? price,
    low: meta.regularMarketDayLow ?? price,
    timestamp: new Date(),
  };
}

export async function fetchQuotes(symbols: string[]) {
  const quotes = await Promise.all(symbols.map((s) => fetchQuote(s)));
  return quotes.filter(Boolean);
}
