import { API_BASE_URL } from '../config/env';

const STORAGE_KEY = 'phantom_local_account';
const INITIAL_BALANCE = 1000000;

export interface LocalHolding {
  symbol: string;
  symbolName?: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  investedAmount: number;
  profitLoss: number;
  profitLossPercentage: number;
  sector?: string;
  exchange?: string;
  market?: string;
}

export interface LocalTrade {
  _id: string;
  symbol: string;
  symbolName?: string;
  tradeType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  status: string;
  entryTime: string;
  profitLoss?: number;
  isWin?: boolean;
}

interface LocalAccount {
  balance: number;
  holdings: LocalHolding[];
  trades: LocalTrade[];
}

function loadAccount(): LocalAccount {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LocalAccount;
      return {
        balance: parsed.balance ?? INITIAL_BALANCE,
        holdings: parsed.holdings ?? [],
        trades: parsed.trades ?? [],
      };
    }
  } catch {
    /* reset corrupt data */
  }
  return { balance: INITIAL_BALANCE, holdings: [], trades: [] };
}

function saveAccount(account: LocalAccount) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
}

function normalizeSymbol(symbol: string) {
  return symbol.toUpperCase().trim();
}

async function fetchLivePrice(symbol: string): Promise<{ price: number; symbolName?: string; symbol: string }> {
  const base = API_BASE_URL || '/api';
  const sym = normalizeSymbol(symbol);
  const candidates = [sym];
  if (!sym.includes('.') && !sym.includes('-')) {
    candidates.push(`${sym}.NS`, sym);
  }

  for (const candidate of candidates) {
    try {
      const res = await fetch(`${base}/market-data/quote/${encodeURIComponent(candidate)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.success) continue;
      const data = body.data as Record<string, unknown>;
      const price = Number(data.price ?? data.currentPrice);
      if (price > 0) {
        return {
          price,
          symbolName: String(data.symbolName || data.name || candidate),
          symbol: normalizeSymbol(String(data.symbol || candidate)),
        };
      }
    } catch {
      /* try next candidate */
    }
  }
  throw new Error(`Live price unavailable for ${symbol}`);
}

function recalcHolding(h: LocalHolding, price: number) {
  h.currentPrice = price;
  h.marketValue = h.quantity * price;
  h.investedAmount = h.quantity * h.averagePrice;
  h.profitLoss = h.marketValue - h.investedAmount;
  h.profitLossPercentage = h.investedAmount > 0 ? (h.profitLoss / h.investedAmount) * 100 : 0;
}

async function refreshPrices(account: LocalAccount) {
  for (const holding of account.holdings) {
    try {
      const quote = await fetchLivePrice(holding.symbol);
      recalcHolding(holding, quote.price);
      if (quote.symbolName) holding.symbolName = quote.symbolName;
    } catch {
      recalcHolding(holding, holding.currentPrice || holding.averagePrice);
    }
  }
}

function portfolioSummary(account: LocalAccount) {
  const totalMarketValue = account.holdings.reduce((s, h) => s + h.marketValue, 0);
  const totalInvested = account.holdings.reduce((s, h) => s + h.investedAmount, 0);
  const totalProfitLoss = account.holdings.reduce((s, h) => s + h.profitLoss, 0);
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  return {
    totalMarketValue,
    totalInvested,
    totalProfitLoss,
    totalProfitLossPercentage,
    numberOfHoldings: account.holdings.length,
  };
}

export function isLocalPaperMode(): boolean {
  return localStorage.getItem('phantom_auth_mode') === 'local';
}

export function resetLocalAccount() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function getLocalWallet() {
  const account = loadAccount();
  await refreshPrices(account);
  saveAccount(account);
  const summary = portfolioSummary(account);
  return {
    balance: account.balance,
    currency: 'INR',
    portfolioValue: summary.totalMarketValue,
    totalEquity: account.balance + summary.totalMarketValue,
    invested: summary.totalInvested,
    profitLoss: summary.totalProfitLoss,
    profitLossPercent: summary.totalProfitLossPercentage,
  };
}

export async function getLocalHoldings() {
  const account = loadAccount();
  await refreshPrices(account);
  saveAccount(account);
  return account.holdings;
}

export async function getLocalPortfolioOverview() {
  const wallet = await getLocalWallet();
  const account = loadAccount();
  const summary = portfolioSummary(account);
  const topHoldings = [...account.holdings]
    .sort((a, b) => b.marketValue - a.marketValue)
    .slice(0, 5)
    .map((h) => ({
      symbol: h.symbol,
      value: h.marketValue,
      percentage: summary.totalMarketValue ? (h.marketValue / summary.totalMarketValue) * 100 : 0,
    }));

  return {
    totalValue: wallet.totalEquity,
    cashBalance: wallet.balance,
    portfolioValue: wallet.portfolioValue,
    totalInvested: summary.totalInvested,
    totalProfitLoss: summary.totalProfitLoss,
    totalProfitLossPercentage: summary.totalProfitLossPercentage,
    numberOfHoldings: summary.numberOfHoldings,
    topHoldings,
    performance: { dailyReturn: 0, weeklyReturn: 0, monthlyReturn: 0, yearlyReturn: 0 },
  };
}

export async function getLocalOrders(limit = 50) {
  const account = loadAccount();
  return { trades: account.trades.slice(0, limit) };
}

export async function getLocalTradeHistory(limit = 50) {
  const account = loadAccount();
  const trades = account.trades.slice(0, limit);
  const wins = trades.filter((t) => t.tradeType === 'SELL' && (t.profitLoss ?? 0) > 0).length;
  const losses = trades.filter((t) => t.tradeType === 'SELL' && (t.profitLoss ?? 0) < 0).length;
  return {
    trades,
    summary: {
      totalTrades: trades.length,
      winningTrades: wins,
      losingTrades: losses,
      netProfit: trades.reduce((s, t) => s + (t.profitLoss ?? 0), 0),
    },
  };
}

export async function getLocalTradingStats(_period = '1M') {
  const account = loadAccount();
  const sells = account.trades.filter((t) => t.tradeType === 'SELL');
  const wins = sells.filter((t) => (t.profitLoss ?? 0) > 0).length;
  const losses = sells.filter((t) => (t.profitLoss ?? 0) < 0).length;
  const netProfit = sells.reduce((s, t) => s + (t.profitLoss ?? 0), 0);
  return {
    stats: {
      totalTrades: account.trades.length,
      netProfit,
      winningTrades: wins,
      losingTrades: losses,
      winRate: sells.length ? (wins / sells.length) * 100 : 0,
      totalVolume: account.trades.reduce((s, t) => s + t.totalAmount, 0),
    },
  };
}

export async function placeLocalOrder(order: {
  symbol: string;
  tradeType: 'BUY' | 'SELL';
  quantity: number;
  orderType?: 'MARKET' | 'LIMIT';
  price?: number;
  market?: string;
}) {
  const account = loadAccount();
  const symbolInput = normalizeSymbol(order.symbol);
  const quote = await fetchLivePrice(symbolInput);
  const symbol = quote.symbol || symbolInput;
  const executionPrice =
    order.orderType === 'LIMIT' && order.price && order.price > 0 ? order.price : quote.price;
  const totalAmount = order.quantity * executionPrice;

  if (order.quantity <= 0) throw new Error('Quantity must be greater than 0');

  if (order.tradeType === 'BUY') {
    if (account.balance < totalAmount) throw new Error('Insufficient paper trading balance');
    account.balance -= totalAmount;
    const existing = account.holdings.find((h) => h.symbol === symbol);
    if (existing) {
      const newQty = existing.quantity + order.quantity;
      existing.averagePrice =
        (existing.averagePrice * existing.quantity + executionPrice * order.quantity) / newQty;
      existing.quantity = newQty;
      recalcHolding(existing, executionPrice);
      existing.symbolName = quote.symbolName || existing.symbolName;
    } else {
      const holding: LocalHolding = {
        symbol,
        symbolName: quote.symbolName,
        quantity: order.quantity,
        averagePrice: executionPrice,
        currentPrice: executionPrice,
        marketValue: totalAmount,
        investedAmount: totalAmount,
        profitLoss: 0,
        profitLossPercentage: 0,
        sector: 'Unknown',
        exchange: symbol.endsWith('.BO') ? 'BSE' : 'NSE',
        market: order.market || 'indian_stocks',
      };
      account.holdings.push(holding);
    }
  } else {
    const holding = account.holdings.find((h) => h.symbol === symbol || h.symbol === symbolInput);
    if (!holding || holding.quantity < order.quantity) {
      throw new Error('Insufficient holdings to sell');
    }
    const proceeds = order.quantity * executionPrice;
    account.balance += proceeds;
    const profitLoss = (executionPrice - holding.averagePrice) * order.quantity;
    holding.quantity -= order.quantity;
    if (holding.quantity <= 0) {
      account.holdings = account.holdings.filter((h) => h.symbol !== holding.symbol);
    } else {
      recalcHolding(holding, executionPrice);
    }

    const trade: LocalTrade = {
      _id: `local_${Date.now()}`,
      symbol: holding.symbol || symbol,
      symbolName: quote.symbolName,
      tradeType: 'SELL',
      quantity: order.quantity,
      price: executionPrice,
      totalAmount,
      status: 'COMPLETED',
      entryTime: new Date().toISOString(),
      profitLoss,
      isWin: profitLoss > 0,
    };
    account.trades.unshift(trade);
    saveAccount(account);
    return {
      trade,
      livePrice: executionPrice,
      remainingBalance: account.balance,
    };
  }

  const trade: LocalTrade = {
    _id: `local_${Date.now()}`,
    symbol,
    symbolName: quote.symbolName,
    tradeType: 'BUY',
    quantity: order.quantity,
    price: executionPrice,
    totalAmount,
    status: 'COMPLETED',
    entryTime: new Date().toISOString(),
  };
  account.trades.unshift(trade);
  saveAccount(account);

  return {
    trade,
    livePrice: executionPrice,
    remainingBalance: account.balance,
  };
}
