import { API_BASE_URL } from '../config/env';
import type { LoginCredentials, LoginResponse, User } from '../utils/api';
import {
  isLocalPaperMode,
  getLocalWallet,
  getLocalHoldings,
  getLocalPortfolioOverview,
  placeLocalOrder,
  getLocalTradeHistory,
  getLocalOrders,
  getLocalTradingStats,
} from './localPaperTrading';

const base = API_BASE_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('phantom_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${base}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || body.message || `Request failed (${response.status})`);
  }

  return body as T;
}

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

export const phantomApi = {
  async healthCheck(): Promise<boolean> {
    try {
      const marketProbe = await fetch(`${base}/market-data/live/indian`);
      if (marketProbe.ok) return true;
      const root = base.replace(/\/api$/, '');
      const res = await fetch(`${root}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const result = await request<ApiEnvelope<{ token: string; user: Record<string, unknown> }>>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email: credentials.username, password: credentials.password }),
      },
    );
    const user = result.data.user;
    const mapped: User = {
      _id: String(user._id),
      name: [user.firstName, user.lastName].filter(Boolean).join(' ') || String(user.email),
      email: String(user.email),
      role: String(user.role),
      createdAt: String(user.createdAt || new Date().toISOString()),
      lastLogin: String(user.lastLogin || new Date().toISOString()),
    };
    localStorage.setItem('phantom_token', result.data.token);
    localStorage.setItem('phantom_user', JSON.stringify(mapped));
    localStorage.setItem('phantom_auth_mode', 'backend');
    return { token: result.data.token, user: mapped, message: result.message || 'Login successful' };
  },

  async logout(): Promise<void> {
    if (!isLocalPaperMode()) {
      try {
        await request('/auth/logout', { method: 'POST' }, true);
      } catch {
        /* offline or demo */
      }
    }
    localStorage.removeItem('phantom_token');
    localStorage.removeItem('phantom_user');
    localStorage.removeItem('phantom_auth_mode');
  },

  async getLiveIndianMarket() {
    const res = await request<ApiEnvelope<unknown[]>>('/market-data/live/indian');
    return res.data;
  },

  async getIndianMarketSummary() {
    const res = await request<ApiEnvelope<{
      totalSymbols: number;
      nseListed: number;
      bseListed: number;
      withLivePrice: number;
    }>>('/market-data/indian/summary');
    return res.data;
  },

  async getIndianStocks(params: {
    page?: number;
    limit?: number;
    search?: string;
    exchange?: 'ALL' | 'NSE' | 'BSE';
    onlyPriced?: boolean;
    sort?: 'volume' | 'change' | 'symbol' | 'name';
  } = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    if (params.search) q.set('search', params.search);
    if (params.exchange) q.set('exchange', params.exchange);
    if (params.onlyPriced) q.set('onlyPriced', 'true');
    if (params.sort) q.set('sort', params.sort);
    const res = await request<ApiEnvelope<{
      items: LiveQuote[];
      total: number;
      page: number;
      limit: number;
      pages: number;
      pricedCount: number;
    }>>(`/market-data/indian/stocks?${q.toString()}`);
    return res.data;
  },

  async searchIndianStocks(query: string, limit = 30) {
    const res = await request<ApiEnvelope<LiveQuote[]>>(
      `/market-data/indian/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    return res.data;
  },

  async getNseQuote(symbol: string) {
    const res = await request<ApiEnvelope<unknown>>(`/market-data/nse/quote/${encodeURIComponent(symbol)}`);
    return res.data;
  },

  async getBseQuote(symbol: string) {
    const res = await request<ApiEnvelope<unknown>>(`/market-data/bse/quote/${encodeURIComponent(symbol)}`);
    return res.data;
  },

  async getNseIndices() {
    const res = await request<ApiEnvelope<unknown[]>>('/market-data/nse/indices');
    return res.data;
  },

  async getLiveGlobalMarket() {
    const res = await request<ApiEnvelope<unknown[]>>('/market-data/live/global');
    return res.data;
  },

  async getQuote(symbol: string) {
    const res = await request<ApiEnvelope<unknown>>(`/market-data/quote/${encodeURIComponent(symbol)}`);
    return res.data;
  },

  async getQuotes(symbols: string[]) {
    const res = await request<ApiEnvelope<unknown[]>>('/market-data/quotes', {
      method: 'POST',
      body: JSON.stringify({ symbols }),
    });
    return res.data;
  },

  async getIndices() {
    const res = await request<ApiEnvelope<unknown[]>>('/market-data/indices');
    return res.data;
  },

  async getPortfolioOverview() {
    if (isLocalPaperMode()) return getLocalPortfolioOverview();
    const res = await request<ApiEnvelope<unknown>>('/portfolio/overview', {}, true);
    return res.data;
  },

  async getHoldings() {
    if (isLocalPaperMode()) return getLocalHoldings();
    const res = await request<ApiEnvelope<unknown[]>>('/portfolio/holdings', {}, true);
    return res.data;
  },

  async getWallet() {
    if (isLocalPaperMode()) return getLocalWallet();
    const res = await request<ApiEnvelope<unknown>>('/portfolio/wallet', {}, true);
    return res.data;
  },

  async placePaperOrder(order: {
    symbol: string;
    tradeType: 'BUY' | 'SELL';
    quantity: number;
    orderType?: 'MARKET' | 'LIMIT';
    price?: number;
    market?: string;
  }) {
    if (isLocalPaperMode()) return placeLocalOrder(order);
    const res = await request<ApiEnvelope<unknown>>('/trading/order', {
      method: 'POST',
      body: JSON.stringify(order),
    }, true);
    return res.data;
  },

  async getTradeHistory(limit = 50) {
    if (isLocalPaperMode()) return getLocalTradeHistory(limit);
    const res = await request<ApiEnvelope<{ trades: unknown[]; summary: unknown }>>(
      `/trading/history?limit=${limit}`,
      {},
      true,
    );
    return res.data;
  },

  async getOrders(limit = 50) {
    if (isLocalPaperMode()) return getLocalOrders(limit);
    const res = await request<ApiEnvelope<{ trades: unknown[] }>>(
      `/trading/orders?limit=${limit}`,
      {},
      true,
    );
    return res.data;
  },

  async getTradingStats(period = '1M') {
    if (isLocalPaperMode()) return getLocalTradingStats(period);
    const res = await request<ApiEnvelope<unknown>>(`/trading/stats?period=${period}`, {}, true);
    return res.data;
  },

  async getHistorical(symbol: string, range = '1mo') {
    const res = await request<ApiEnvelope<Array<{ date: string; price: number }>>>(
      `/market-data/history/${encodeURIComponent(symbol)}?range=${range}`,
    );
    return res.data;
  },

  async getPaytmStatus() {
    const res = await request<ApiEnvelope<{ connected: boolean; message?: string }>>(
      '/brokers/paytm/status',
      {},
      true,
    );
    return res.data;
  },

  async configurePaytm(apiKey: string, apiSecret: string) {
    const res = await request<ApiEnvelope<unknown>>('/brokers/paytm/configure', {
      method: 'POST',
      body: JSON.stringify({ apiKey, apiSecret }),
    }, true);
    return res.data;
  },

  async getPaytmLoginUrl() {
    const res = await request<ApiEnvelope<{ loginUrl: string }>>('/brokers/paytm/login-url', {}, true);
    return res.data;
  },

  async placeLiveOrder(order: {
    symbol: string;
    tradeType: 'BUY' | 'SELL';
    quantity: number;
    orderType?: 'MKT' | 'LIMIT';
    price?: number;
    confirmLive: boolean;
  }) {
    const res = await request<ApiEnvelope<unknown>>('/brokers/paytm/order', {
      method: 'POST',
      body: JSON.stringify(order),
    }, true);
    return res.data;
  },

  async getPaytmFunds() {
    const res = await request<ApiEnvelope<unknown>>('/brokers/paytm/funds', {}, true);
    return res.data;
  },

  async getPaytmHoldings() {
    const res = await request<ApiEnvelope<unknown>>('/brokers/paytm/holdings', {}, true);
    return res.data;
  },

  async getPaytmOrders() {
    const res = await request<ApiEnvelope<unknown>>('/brokers/paytm/orders', {}, true);
    return res.data;
  },

  async disconnectPaytm() {
    const res = await request<ApiEnvelope<unknown>>('/brokers/paytm/disconnect', { method: 'POST' }, true);
    return res.data;
  },
};

export type LiveQuote = {
  symbol: string;
  symbolName?: string;
  price?: number;
  currentPrice?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  currency?: string;
  marketCap?: number;
  source?: 'NSE' | 'BSE' | 'Yahoo';
  exchange?: string;
};
