const NSE_BASE = 'https://www.nseindia.com';
const BSE_API = 'https://api.bseindia.com/BseIndiaAPI/api';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export const NSE_WATCHLIST = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
  'SBIN', 'BHARTIARTL', 'ITC', 'LT', 'AXISBANK',
];

const BSE_SCRIP_MAP: Record<string, string> = {
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

let preOpenCache: Map<string, ReturnType<typeof toQuote>> | null = null;
let preOpenCacheTime = 0;

function normalizeSymbol(symbol: string) {
  const s = symbol.toUpperCase().trim();
  if (s.endsWith('.NS')) return s.replace('.NS', '');
  if (s.endsWith('.BO')) return s.replace('.BO', '');
  return s;
}

function toQuote(
  base: string,
  symbolName: string,
  price: number,
  previousClose: number,
  open: number,
  high: number,
  low: number,
  volume: number,
  exchange: 'NSE' | 'BSE',
) {
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;
  const suffix = exchange === 'BSE' ? '.BO' : '.NS';
  return {
    symbol: `${base}${suffix}`,
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
    currency: 'INR',
    exchange,
    source: exchange,
    timestamp: new Date(),
  };
}

async function nseFetch(path: string, referer = `${NSE_BASE}/market-data/live-equity-market`) {
  const res = await fetch(`${NSE_BASE}${path}`, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      Referer: referer,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function loadNsePreOpenMap() {
  if (preOpenCache && Date.now() - preOpenCacheTime < 30000) return preOpenCache;

  const data = await nseFetch(
    '/api/market-data-pre-open?key=ALL',
    `${NSE_BASE}/market-data/pre-open-market-cm-and-emerge-market`,
  );
  const map = new Map<string, ReturnType<typeof toQuote>>();

  if (Array.isArray(data?.data)) {
    for (const row of data.data) {
      const meta = row?.metadata;
      if (!meta?.symbol) continue;
      const price = meta.lastPrice ?? meta.iep ?? 0;
      if (!price) continue;
      const previousClose = meta.previousClose ?? price;
      map.set(
        meta.symbol,
        toQuote(
          meta.symbol,
          meta.symbol,
          price,
          previousClose,
          meta.iep ?? price,
          meta.yearHigh ?? price,
          meta.yearLow ?? price,
          meta.finalQuantity ?? 0,
          'NSE',
        ),
      );
    }
  }

  preOpenCache = map;
  preOpenCacheTime = Date.now();
  return map;
}

export async function fetchNseQuote(symbol: string) {
  const base = normalizeSymbol(symbol);

  try {
    const direct = await nseFetch(
      `/api/quote-equity?symbol=${encodeURIComponent(base)}`,
      `${NSE_BASE}/get-quote/equity/${base}`,
    );
    if (direct?.priceInfo) {
      const p = direct.priceInfo;
      const price = p.lastPrice ?? p.close ?? 0;
      const prev = p.previousClose ?? price;
      return toQuote(
        base,
        direct.info?.companyName || base,
        price,
        prev,
        p.open ?? price,
        p.intraDayHighLow?.max ?? price,
        p.intraDayHighLow?.min ?? price,
        p.totalTradedVolume ?? 0,
        'NSE',
      );
    }
  } catch {
    /* quote-equity may be blocked */
  }

  const map = await loadNsePreOpenMap();
  return map.get(base) ?? null;
}

export async function fetchBseQuote(symbol: string) {
  const base = normalizeSymbol(symbol);
  const scrip = BSE_SCRIP_MAP[base];
  if (!scrip) return null;

  const res = await fetch(
    `${BSE_API}/StockReachGraph/w?scripcode=${scrip}&flag=0&fromdate=&todate=&seriesid=`,
    {
      headers: {
        'User-Agent': USER_AGENT,
        Referer: 'https://www.bseindia.com/',
        Origin: 'https://www.bseindia.com',
      },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.CurrVal) return null;

  const price = parseFloat(data.CurrVal);
  const previousClose = parseFloat(data.PrevClose || String(price));
  return toQuote(
    base,
    data.Scripname || base,
    price,
    previousClose,
    price,
    parseFloat(data.HighVal || String(price)),
    parseFloat(data.LowVal || String(price)),
    parseInt(data.HighVol || '0', 10),
    'BSE',
  );
}

export async function fetchIndianQuote(symbol: string) {
  const nse = await fetchNseQuote(symbol);
  if (nse) return nse;
  return fetchBseQuote(symbol);
}

export async function fetchNseWatchlist() {
  const all = await fetchNseAllMarketQuotes();
  if (all.length > 0) return all;

  const map = await loadNsePreOpenMap();
  const batch = NSE_WATCHLIST.map((s) => map.get(s)).filter(Boolean);
  if (batch.length >= 5) return batch as StockQuote[];

  const quotes = await Promise.all(NSE_WATCHLIST.map((s) => fetchNseQuote(s)));
  return quotes.filter(Boolean) as StockQuote[];
}

const NSE_EQUITY_CSV = 'https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv';

type StockQuote = ReturnType<typeof toQuote> & {
  hasLivePrice?: boolean;
  series?: string;
  bseScripCode?: string;
};

let symbolMasterCache: Map<string, { symbol: string; name: string; series: string }> | null = null;
let symbolMasterTime = 0;
let bseMasterCache: Array<Record<string, string>> | null = null;
let bseMasterTime = 0;
let fullMarketCache: StockQuote[] | null = null;
let fullMarketCacheTime = 0;

function parseCsvLine(line: string) {
  const result: string[] = [];
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

  const res = await fetch(NSE_EQUITY_CSV, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return symbolMasterCache || new Map();

  const text = await res.text();
  const map = new Map<string, { symbol: string; name: string; series: string }>();
  for (const line of text.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    const symbol = cols[0]?.trim();
    const name = cols[1]?.trim();
    const series = cols[2]?.trim() || 'EQ';
    if (symbol) map.set(symbol, { symbol, name, series });
  }

  symbolMasterCache = map;
  symbolMasterTime = Date.now();
  return map;
}

export async function loadBseSymbolMaster() {
  if (bseMasterCache && Date.now() - bseMasterTime < 24 * 60 * 60 * 1000) {
    return bseMasterCache;
  }

  const res = await fetch(`${BSE_API}/ListofScripData/w?segment=Equity&status=Active`, {
    headers: {
      'User-Agent': USER_AGENT,
      Referer: 'https://www.bseindia.com/',
      Origin: 'https://www.bseindia.com',
    },
  });
  if (!res.ok) return bseMasterCache || [];

  const data = await res.json();
  bseMasterCache = Array.isArray(data) ? data : [];
  bseMasterTime = Date.now();
  return bseMasterCache;
}

export async function buildFullIndianMarket(): Promise<StockQuote[]> {
  if (fullMarketCache && Date.now() - fullMarketCacheTime < 30000) {
    return fullMarketCache;
  }

  const nseMaster = await loadNseSymbolMaster();
  const prices = await loadNsePreOpenMap();
  const bseRows = await loadBseSymbolMaster();
  const list: StockQuote[] = [];

  for (const [symbol, info] of nseMaster) {
    const live = prices.get(symbol);
    if (live) {
      list.push({
        ...live,
        symbolName: info.name,
        series: info.series,
        hasLivePrice: true,
      });
    } else {
      list.push({
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
    if (!sym || nseMaster.has(sym)) continue;
    list.push({
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

  fullMarketCache = list;
  fullMarketCacheTime = Date.now();
  return list;
}

export async function getIndianMarketSummary() {
  const all = await buildFullIndianMarket();
  const nseMaster = await loadNseSymbolMaster();
  const bseRows = await loadBseSymbolMaster();
  return {
    totalSymbols: all.length,
    nseListed: nseMaster.size,
    bseListed: bseRows.length,
    withLivePrice: all.filter((s) => s.hasLivePrice).length,
    lastUpdated: new Date(),
  };
}

export async function getIndianStocksPaginated(options: {
  page?: number;
  limit?: number;
  search?: string;
  exchange?: string;
  onlyPriced?: boolean;
  sort?: string;
} = {}) {
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

  if (sort === 'volume') all.sort((a, b) => (b.volume || 0) - (a.volume || 0));
  else if (sort === 'change') all.sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
  else if (sort === 'name') all.sort((a, b) => String(a.symbolName).localeCompare(String(b.symbolName)));
  else all.sort((a, b) => a.symbol.localeCompare(b.symbol));

  const total = all.length;
  const safeLimit = Math.min(Math.max(limit, 1), 500);
  const safePage = Math.max(page, 1);
  const start = (safePage - 1) * safeLimit;

  return {
    items: all.slice(start, start + safeLimit),
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit) || 1,
    pricedCount: all.filter((s) => s.hasLivePrice).length,
  };
}

export async function searchIndianStocks(query: string, limit = 30) {
  const result = await getIndianStocksPaginated({
    page: 1,
    limit,
    search: query,
    sort: 'volume',
  });
  return result.items;
}

export async function fetchNseAllMarketQuotes() {
  const all = await buildFullIndianMarket();
  return all.filter((s) => s.hasLivePrice && s.symbol.endsWith('.NS'));
}

export async function fetchNseIndices() {
  const data = await nseFetch('/api/allIndices');
  if (!Array.isArray(data?.data)) return [];

  const wanted = ['NIFTY 50', 'NIFTY BANK', 'NIFTY IT'];
  return data.data
    .filter((row: { index?: string }) => wanted.includes(row.index || ''))
    .map((row: {
      index?: string;
      indexSymbol?: string;
      last?: number;
      previousClose?: number;
      variation?: number;
      percentChange?: number;
      open?: number;
      high?: number;
      low?: number;
    }) => {
      const price = row.last ?? 0;
      const previousClose = row.previousClose ?? price;
      return {
        symbol: row.indexSymbol || row.index || '',
        symbolName: row.index || '',
        currentPrice: price,
        price,
        previousClose,
        open: row.open ?? price,
        high: row.high ?? price,
        low: row.low ?? price,
        volume: 0,
        change: row.variation ?? price - previousClose,
        changePercent: row.percentChange ?? 0,
        currency: 'INR',
        exchange: 'NSE',
        source: 'NSE',
        timestamp: new Date(),
      };
    });
}
