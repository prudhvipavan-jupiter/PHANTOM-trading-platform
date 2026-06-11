// Yahoo Finance chart API (server-side proxy — avoids browser CORS)
import axios from 'axios';
import { logger } from '../utils/logger.js';

const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const USER_AGENT = 'Mozilla/5.0 (compatible; PHANTOM/1.0)';

export const WATCHLIST = {
  indian: [
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'LT.NS', 'AXISBANK.NS',
  ],
  global: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'],
  crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD'],
  indices: ['^NSEI', '^BSESN', '^INDIAVIX'],
};

function parseChartResponse(symbol, data) {
  const result = data?.chart?.result?.[0];
  if (!result) return null;

  const meta = result.meta || {};
  const quote = result.indicators?.quote?.[0] || {};
  const price = meta.regularMarketPrice ?? quote.close?.[quote.close.length - 1] ?? 0;
  const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  return {
    symbol: (meta.symbol || symbol).toUpperCase(),
    symbolName: meta.shortName || meta.longName || symbol,
    currentPrice: price,
    price,
    previousClose,
    open: quote.open?.[0] ?? meta.regularMarketOpen ?? price,
    high: quote.high?.[0] ?? meta.regularMarketDayHigh ?? price,
    low: quote.low?.[0] ?? meta.regularMarketDayLow ?? price,
    volume: quote.volume?.[0] ?? meta.regularMarketVolume ?? 0,
    change,
    changePercent,
    marketCap: meta.marketCap ?? 0,
    currency: meta.currency || 'INR',
    exchange: meta.exchangeName || 'NSE',
    timestamp: new Date(meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now()),
  };
}

export async function getQuote(symbol) {
  try {
    const response = await axios.get(`${BASE_URL}${encodeURIComponent(symbol)}`, {
      params: { interval: '1d', range: '1d' },
      headers: { 'User-Agent': USER_AGENT },
      timeout: 12000,
    });
    return parseChartResponse(symbol, response.data);
  } catch (error) {
    logger.error(`Yahoo quote failed for ${symbol}:`, error.message);
    return null;
  }
}

export async function getQuotes(symbols) {
  const results = await Promise.all(symbols.map((s) => getQuote(s)));
  return results.filter(Boolean);
}

export async function getHistorical(symbol, range = '1mo') {
  try {
    const response = await axios.get(`${BASE_URL}${encodeURIComponent(symbol)}`, {
      params: { interval: '1d', range },
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000,
    });
    const result = response.data?.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    return timestamps.map((t, i) => ({
      date: new Date(t * 1000).toISOString().split('T')[0],
      price: closes[i] ?? 0,
    })).filter((d) => d.price > 0);
  } catch (error) {
    logger.error(`Yahoo history failed for ${symbol}:`, error.message);
    return [];
  }
}

export async function getGainersLosers() {
  const quotes = await getQuotes(WATCHLIST.indian);
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  return {
    gainers: sorted.slice(0, 5),
    losers: sorted.slice(-5).reverse(),
  };
}

export async function getIndices() {
  return getQuotes(WATCHLIST.indices);
}
