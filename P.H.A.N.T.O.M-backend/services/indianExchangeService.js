// NSE / BSE live price feeds (exchange website APIs — server-side proxy)
import axios from 'axios';
import { logger } from '../utils/logger.js';

const NSE_BASE = 'https://www.nseindia.com';
const BSE_API = 'https://api.bseindia.com/BseIndiaAPI/api';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const NSE_HEADERS = {
  'User-Agent': USER_AGENT,
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: `${NSE_BASE}/market-data/live-equity-market`,
};

let nseCookieJar = '';
let nseCookieExpiry = 0;
let nsePreOpenCache = null;
let nsePreOpenCacheTime = 0;
let symbolMasterCache = null;
let symbolMasterTime = 0;
let bseMasterCache = null;
let bseMasterTime = 0;
let fullMarketCache = null;
let fullMarketCacheTime = 0;

const NSE_EQUITY_CSV = 'https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv';

export const NSE_WATCHLIST = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
  'SBIN', 'BHARTIARTL', 'ITC', 'LT', 'AXISBANK',
];

export const NSE_INDICES = [
  { key: 'NIFTY 50', label: 'Nifty 50' },
  { key: 'NIFTY BANK', label: 'Bank Nifty' },
  { key: 'NIFTY IT', label: 'Nifty IT' },
];

const BSE_SCRIP_MAP = {
  RELIANCE: '500325',
  TCS: '532540',
  HDFCBANK: '500180',
  INFY: '500209',
  ICICIBANK: '532174',
  SBIN: '500112',
  BHARTIARTL: '532454',
  ITC: '500875',
  LT: '500510',
  AXISBANK: '532215',
};

function normalizeIndianSymbol(symbol) {
  const s = symbol.toUpperCase().trim();
  if (s.endsWith('.NS')) return { base: s.replace('.NS', ''), exchange: 'NSE' };
  if (s.endsWith('.BO')) return { base: s.replace('.BO', ''), exchange: 'BSE' };
  return { base: s, exchange: 'NSE' };
}

function toUnifiedQuote({
  symbol,
  symbolName,
  price,
  previousClose,
  open,
  high,
  low,
  volume,
  exchange,
  currency = 'INR',
  marketCap = 0,
  sector = '',
}) {
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;
  const suffix = exchange === 'BSE' ? '.BO' : '.NS';
  return {
    symbol: `${symbol}${suffix}`,
    symbolName,
    currentPrice: price,
    price,
    previousClose,
    open,
    high,
    low,
    volume,
    change,
    changePercent,
    marketCap,
    currency,
    exchange,
    sector,
    source: exchange,
    timestamp: new Date(),
  };
}

function storeNseCookies(headers) {
  const cookies = headers?.['set-cookie'];
  if (cookies?.length) {
    nseCookieJar = cookies.map((c) => c.split(';')[0]).join('; ');
    nseCookieExpiry = Date.now() + 5 * 60 * 1000;
  }
}

async function refreshNseSession() {
  if (Date.now() < nseCookieExpiry && nseCookieJar) return nseCookieJar;

  try {
    const res = await axios.get(`${NSE_BASE}/api/allIndices`, {
      headers: NSE_HEADERS,
      timeout: 15000,
      validateStatus: (s) => s < 500,
    });
    storeNseCookies(res.headers);
    return nseCookieJar;
  } catch (error) {
    logger.warn('NSE session refresh failed:', error.message);
    return nseCookieJar;
  }
}

async function nseGet(path, referer = NSE_HEADERS.Referer) {
  const cookie = await refreshNseSession();
  const headers = {
    ...NSE_HEADERS,
    Referer: referer,
    ...(cookie ? { Cookie: cookie } : {}),
  };

  const res = await axios.get(`${NSE_BASE}${path}`, {
    headers,
    timeout: 20000,
    validateStatus: (s) => s < 500,
  });

  storeNseCookies(res.headers);

  if (res.status === 401 || res.status === 403) {
    nseCookieExpiry = 0;
    const retryCookie = await refreshNseSession();
    const retry = await axios.get(`${NSE_BASE}${path}`, {
      headers: { ...headers, Cookie: retryCookie },
      timeout: 20000,
      validateStatus: (s) => s < 500,
    });
    storeNseCookies(retry.headers);
    return retry;
  }

  return res;
}

function parsePreOpenEntry(entry) {
  const meta = entry?.metadata;
  if (!meta?.symbol) return null;

  const price = meta.lastPrice ?? meta.iep ?? 0;
  if (!price) return null;
  const previousClose = meta.previousClose ?? price;

  const quote = toUnifiedQuote({
    symbol: meta.symbol,
    symbolName: meta.symbol,
    price,
    previousClose,
    open: meta.iep ?? price,
    high: meta.yearHigh ?? price,
    low: meta.yearLow ?? price,
    volume: meta.finalQuantity ?? meta.totalTurnover ?? 0,
    exchange: 'NSE',
  });
  quote.series = meta.series || 'EQ';
  quote.hasLivePrice = true;
  return quote;
}

function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  result.push(cur.trim());
  return result;
}

export async function loadNseSymbolMaster() {
  if (symbolMasterCache && Date.now() - symbolMasterTime < 24 * 60 * 60 * 1000) {
    return symbolMasterCache;
  }

  try {
    const res = await axios.get(NSE_EQUITY_CSV, {
      headers: { 'User-Agent': USER_AGENT },
      responseType: 'text',
      timeout: 20000,
    });

    const map = new Map();
    const lines = String(res.data).split('\n').slice(1);
    for (const line of lines) {
      if (!line.trim()) continue;
      const cols = parseCsvLine(line);
      const symbol = cols[0]?.trim();
      const name = cols[1]?.trim();
      const series = cols[2]?.trim() || 'EQ';
      if (symbol) map.set(symbol, { symbol, name, series, exchange: 'NSE' });
    }

    symbolMasterCache = map;
    symbolMasterTime = Date.now();
    logger.info(`Loaded ${map.size} NSE symbols from EQUITY_L.csv`);
    return map;
  } catch (error) {
    logger.error('NSE symbol master failed:', error.message);
    return symbolMasterCache || new Map();
  }
}

export async function loadBseSymbolMaster() {
  if (bseMasterCache && Date.now() - bseMasterTime < 24 * 60 * 60 * 1000) {
    return bseMasterCache;
  }

  try {
    const res = await axios.get(
      `${BSE_API}/ListofScripData/w?segment=Equity&status=Active`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Referer: 'https://www.bseindia.com/',
          Origin: 'https://www.bseindia.com',
        },
        timeout: 30000,
      },
    );

    bseMasterCache = Array.isArray(res.data) ? res.data : [];
    bseMasterTime = Date.now();
    logger.info(`Loaded ${bseMasterCache.length} BSE equity symbols`);
    return bseMasterCache;
  } catch (error) {
    logger.error('BSE symbol master failed:', error.message);
    return bseMasterCache || [];
  }
}

async function buildFullIndianMarket() {
  if (fullMarketCache && Date.now() - fullMarketCacheTime < 30000) {
    return fullMarketCache;
  }

  const nseMaster = await loadNseSymbolMaster();
  const prices = await loadNsePreOpenMap();
  const bseRows = await loadBseSymbolMaster();
  const bySymbol = new Map();

  for (const [symbol, info] of nseMaster) {
    const live = prices.get(symbol);
    if (live) {
      bySymbol.set(symbol, {
        ...live,
        symbolName: info.name,
        series: info.series,
        hasLivePrice: true,
      });
    } else {
      bySymbol.set(symbol, {
        symbol: `${symbol}.NS`,
        symbolName: info.name,
        series: info.series,
        currentPrice: 0,
        price: 0,
        previousClose: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        high: 0,
        low: 0,
        open: 0,
        currency: 'INR',
        exchange: 'NSE',
        source: 'NSE',
        hasLivePrice: false,
        timestamp: new Date(),
      });
    }
  }

  for (const row of bseRows) {
    const sym = String(row.scrip_id || '').toUpperCase().trim();
    if (!sym || bySymbol.has(sym)) continue;
    bySymbol.set(`BSE:${sym}`, {
      symbol: `${sym}.BO`,
      symbolName: row.Scrip_Name || row.Issuer_Name || sym,
      series: 'EQ',
      currentPrice: 0,
      price: 0,
      previousClose: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      high: 0,
      low: 0,
      open: 0,
      currency: 'INR',
      exchange: 'BSE',
      source: 'BSE',
      bseScripCode: String(row.SCRIP_CD || ''),
      hasLivePrice: false,
      timestamp: new Date(),
    });
  }

  fullMarketCache = Array.from(bySymbol.values());
  fullMarketCacheTime = Date.now();
  return fullMarketCache;
}

export async function getIndianMarketSummary() {
  const all = await buildFullIndianMarket();
  const priced = all.filter((s) => s.hasLivePrice);
  return {
    totalSymbols: all.length,
    nseListed: (await loadNseSymbolMaster()).size,
    bseListed: (await loadBseSymbolMaster()).length,
    withLivePrice: priced.length,
    lastUpdated: new Date(),
  };
}

export async function getIndianStocksPaginated(options = {}) {
  const {
    page = 1,
    limit = 100,
    search = '',
    exchange = 'ALL',
    onlyPriced = false,
    sort = 'volume',
  } = options;

  let all = await buildFullIndianMarket();

  if (onlyPriced) all = all.filter((s) => s.hasLivePrice);
  if (exchange === 'NSE') all = all.filter((s) => s.symbol.endsWith('.NS'));
  if (exchange === 'BSE') all = all.filter((s) => s.symbol.endsWith('.BO'));

  const q = search.trim().toUpperCase();
  if (q) {
    all = all.filter(
      (s) =>
        s.symbol.toUpperCase().includes(q) ||
        String(s.symbolName || '').toUpperCase().includes(q),
    );
  }

  if (sort === 'volume') {
    all.sort((a, b) => (b.volume || 0) - (a.volume || 0));
  } else if (sort === 'change') {
    all.sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
  } else if (sort === 'name') {
    all.sort((a, b) => String(a.symbolName).localeCompare(String(b.symbolName)));
  } else {
    all.sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  const total = all.length;
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const start = (safePage - 1) * safeLimit;
  const items = all.slice(start, start + safeLimit);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit) || 1,
    pricedCount: all.filter((s) => s.hasLivePrice).length,
  };
}

export async function searchIndianStocks(query, limit = 30) {
  const result = await getIndianStocksPaginated({
    page: 1,
    limit,
    search: query,
    sort: 'volume',
  });
  return result.items;
}

export async function getNseAllMarketQuotes() {
  const all = await buildFullIndianMarket();
  return all.filter((s) => s.hasLivePrice && s.symbol.endsWith('.NS'));
}

async function loadNsePreOpenMap() {
  if (nsePreOpenCache && Date.now() - nsePreOpenCacheTime < 30000) {
    return nsePreOpenCache;
  }

  const res = await nseGet(
    '/api/market-data-pre-open?key=ALL',
    `${NSE_BASE}/market-data/pre-open-market-cm-and-emerge-market`,
  );

  if (res.status !== 200 || !Array.isArray(res.data?.data)) {
    return nsePreOpenCache || new Map();
  }

  const map = new Map();
  for (const row of res.data.data) {
    const quote = parsePreOpenEntry(row);
    if (quote) map.set(quote.symbol.replace('.NS', ''), quote);
  }

  nsePreOpenCache = map;
  nsePreOpenCacheTime = Date.now();
  return map;
}

async function getNseFromPreOpen(baseSymbol) {
  const map = await loadNsePreOpenMap();
  return map.get(baseSymbol) || null;
}

async function tryNseQuoteEquity(base) {
  const res = await nseGet(
    `/api/quote-equity?symbol=${encodeURIComponent(base)}`,
    `${NSE_BASE}/get-quote/equity/${base}`,
  );

  if (res.status !== 200 || !res.data?.priceInfo) return null;

  const info = res.data.info || {};
  const priceInfo = res.data.priceInfo;
  const price = priceInfo.lastPrice ?? priceInfo.close ?? 0;
  const previousClose = priceInfo.previousClose ?? price;
  const intra = priceInfo.intraDayHighLow || {};

  return toUnifiedQuote({
    symbol: base,
    symbolName: info.companyName || base,
    price,
    previousClose,
    open: priceInfo.open ?? price,
    high: intra.max ?? price,
    low: intra.min ?? price,
    volume:
      priceInfo.totalTradedVolume ??
      res.data.metadata?.totalTradedVolume ??
      0,
    exchange: 'NSE',
    sector: info.industry || '',
  });
}

export async function getNseEquityQuote(symbol) {
  const { base } = normalizeIndianSymbol(symbol);

  try {
    const direct = await tryNseQuoteEquity(base);
    if (direct) return direct;

    const fromFeed = await getNseFromPreOpen(base);
    if (fromFeed) return fromFeed;

    return null;
  } catch (error) {
    logger.error(`NSE quote failed for ${base}:`, error.message);
    return null;
  }
}

export async function getNseIndex(indexName = 'NIFTY 50') {
  try {
    const res = await nseGet('/api/allIndices');
    if (res.status !== 200) return null;

    const row = res.data?.data?.find(
      (i) => i.index === indexName || i.indexSymbol === indexName,
    );
    if (!row) return null;

    const price = row.last ?? 0;
    const previousClose = row.previousClose ?? price;
    const change = row.variation ?? price - previousClose;
    const changePercent = row.percentChange ?? (previousClose ? (change / previousClose) * 100 : 0);

    return {
      symbol: row.indexSymbol || indexName,
      symbolName: row.index || indexName,
      currentPrice: price,
      price,
      previousClose,
      open: row.open ?? price,
      high: row.high ?? price,
      low: row.low ?? price,
      volume: 0,
      change,
      changePercent,
      currency: 'INR',
      exchange: 'NSE',
      source: 'NSE',
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error(`NSE index failed for ${indexName}:`, error.message);
    return null;
  }
}

async function resolveBseScripCode(baseSymbol) {
  if (BSE_SCRIP_MAP[baseSymbol]) return BSE_SCRIP_MAP[baseSymbol];

  try {
    const res = await axios.get(
      `${BSE_API}/ProduceNameData/w?strinput=${encodeURIComponent(baseSymbol)}`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Referer: 'https://www.bseindia.com/',
          Origin: 'https://www.bseindia.com',
        },
        timeout: 12000,
      },
    );
    const match = res.data?.Table?.find((r) => String(r.scrip_cd || r.ScripCode).length > 0);
    return match ? String(match.scrip_cd || match.ScripCode) : null;
  } catch (error) {
    logger.warn(`BSE scrip lookup failed for ${baseSymbol}:`, error.message);
    return null;
  }
}

export async function getBseEquityQuote(symbol) {
  const { base } = normalizeIndianSymbol(symbol);

  try {
    const scripCode = await resolveBseScripCode(base);
    if (!scripCode) return null;

    const res = await axios.get(
      `${BSE_API}/StockReachGraph/w?scripcode=${scripCode}&flag=0&fromdate=&todate=&seriesid=`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Referer: 'https://www.bseindia.com/',
          Origin: 'https://www.bseindia.com',
        },
        timeout: 12000,
      },
    );

    const data = res.data;
    if (!data?.CurrVal) return null;

    const price = parseFloat(data.CurrVal);
    const previousClose = parseFloat(data.PrevClose || price);
    const high = parseFloat(data.HighVal || price);
    const low = parseFloat(data.LowVal || price);

    return toUnifiedQuote({
      symbol: base,
      symbolName: data.Scripname || base,
      price,
      previousClose,
      open: price,
      high,
      low,
      volume: parseInt(data.HighVol || data.LowVol || '0', 10),
      exchange: 'BSE',
    });
  } catch (error) {
    logger.error(`BSE quote failed for ${base}:`, error.message);
    return null;
  }
}

export async function getIndianExchangeQuote(symbol) {
  const { base, exchange } = normalizeIndianSymbol(symbol);

  if (exchange === 'BSE') {
    const bse = await getBseEquityQuote(base);
    if (bse) return bse;
    return getNseEquityQuote(base);
  }

  const nse = await getNseEquityQuote(base);
  if (nse) return nse;
  return getBseEquityQuote(base);
}

export async function getNseWatchlistQuotes() {
  const all = await getNseAllMarketQuotes();
  if (all.length > 0) return all;

  const quotes = await Promise.all(NSE_WATCHLIST.map((s) => getNseEquityQuote(s)));
  return quotes.filter(Boolean);
}

export async function getNseIndices() {
  const indices = await Promise.all(NSE_INDICES.map((i) => getNseIndex(i.key)));
  return indices.filter(Boolean);
}

export function isIndianSymbol(symbol) {
  const s = symbol.toUpperCase().trim();
  if (s.endsWith('.NS') || s.endsWith('.BO')) return true;
  if (s.includes('-') || s.includes('.')) return false;
  return NSE_WATCHLIST.includes(s);
}
