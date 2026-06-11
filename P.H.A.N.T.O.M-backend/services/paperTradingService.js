import Portfolio from '../models/Portfolio.js';
import { getQuote } from './marketQuoteService.js';
import { logger } from '../utils/logger.js';

function normalizeSymbol(symbol) {
  return symbol.toUpperCase().trim();
}

function inferMarket(symbol) {
  if (symbol.includes('-USD') || symbol.includes('BTC') || symbol.includes('ETH')) return 'crypto';
  if (symbol.endsWith('.NS') || symbol.endsWith('.BO')) return 'indian_stocks';
  return 'us_stocks';
}

function inferExchange(symbol, market) {
  if (market === 'crypto') return 'CRYPTO';
  if (market === 'us_stocks') return 'US_STOCKS';
  if (symbol.endsWith('.BO')) return 'BSE';
  return 'NSE';
}

export async function getOrCreatePortfolio(userId) {
  let portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) {
    portfolio = new Portfolio({
      userId,
      name: 'Paper Trading Portfolio',
      holdings: [],
      assetAllocation: { cash: 100 },
    });
    await portfolio.save();
  }
  return portfolio;
}

export async function resolveMarketPrice(symbol) {
  const quote = await getQuote(symbol);
  if (!quote?.price) {
    throw new Error(`Live price unavailable for ${symbol}`);
  }
  return quote;
}

export async function executePaperOrder(user, trade) {
  const symbol = normalizeSymbol(trade.symbol);
  const quote = await resolveMarketPrice(symbol);
  const executionPrice = trade.orderType === 'LIMIT' ? trade.price : quote.price;

  trade.price = executionPrice;
  trade.totalAmount = trade.quantity * executionPrice;
  trade.filledQuantity = trade.quantity;
  trade.averagePrice = executionPrice;
  trade.status = 'COMPLETED';
  trade.entryTime = new Date();
  trade.symbolName = quote.symbolName || trade.symbolName || symbol;
  await trade.save();

  const portfolio = await getOrCreatePortfolio(user._id);
  const market = trade.market || inferMarket(symbol);
  const exchange = trade.exchange || inferExchange(symbol, market);

  if (trade.tradeType === 'BUY') {
    await portfolio.addHolding({
      symbol,
      symbolName: trade.symbolName,
      exchange,
      market,
      quantity: trade.quantity,
      averagePrice: executionPrice,
      currentPrice: executionPrice,
      marketValue: trade.quantity * executionPrice,
      investedAmount: trade.quantity * executionPrice,
      profitLoss: 0,
      profitLossPercentage: 0,
      sector: 'Unknown',
    });
  } else if (trade.tradeType === 'SELL') {
    const holding = portfolio.holdings.find((h) => h.symbol === symbol);
    if (!holding || holding.quantity < trade.quantity) {
      throw new Error('Insufficient holdings to sell');
    }
    const proceeds = trade.quantity * executionPrice;
    user.wallet.balance += proceeds;
    await portfolio.removeHolding(symbol, trade.quantity);
    trade.profitLoss = (executionPrice - holding.averagePrice) * trade.quantity;
    trade.isWin = trade.profitLoss > 0;
    await trade.save();
  }

  await refreshPortfolioPrices(portfolio);
  return { trade, quote };
}

export async function refreshPortfolioPrices(portfolio) {
  const priceMap = {};
  for (const holding of portfolio.holdings) {
    const quote = await getQuote(holding.symbol);
    if (quote) priceMap[holding.symbol] = { price: quote.price };
  }
  await portfolio.updatePrices(priceMap);
  return portfolio;
}

export async function getWalletSummary(user) {
  const portfolio = await getOrCreatePortfolio(user._id);
  await refreshPortfolioPrices(portfolio);
  return {
    balance: user.wallet?.balance ?? 0,
    currency: user.wallet?.currency || 'INR',
    portfolioValue: portfolio.summary.totalMarketValue,
    totalEquity: (user.wallet?.balance ?? 0) + portfolio.summary.totalMarketValue,
    invested: portfolio.summary.totalInvested,
    profitLoss: portfolio.summary.totalProfitLoss,
    profitLossPercent: portfolio.summary.totalProfitLossPercentage,
  };
}
