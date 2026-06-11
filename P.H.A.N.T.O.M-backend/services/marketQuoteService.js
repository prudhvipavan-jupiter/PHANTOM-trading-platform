// Unified market quotes: NSE/BSE for India, Yahoo for global/crypto
import { logger } from '../utils/logger.js';
import {
  getIndianExchangeQuote,
  getNseWatchlistQuotes,
  getNseAllMarketQuotes,
  getNseIndices,
  getIndianStocksPaginated,
  searchIndianStocks,
  getIndianMarketSummary,
  isIndianSymbol,
  NSE_WATCHLIST,
} from './indianExchangeService.js';
import {
  getQuote as getYahooQuote,
  getQuotes as getYahooQuotes,
  getHistorical as getYahooHistorical,
  getGainersLosers as getYahooGainersLosers,
  getIndices as getYahooIndices,
  WATCHLIST,
} from './yahooFinanceService.js';

const SOURCE = (process.env.INDIAN_PRICE_SOURCE || 'auto').toLowerCase();

export { WATCHLIST, NSE_WATCHLIST };

export async function getQuote(symbol) {
  const useNse =
    SOURCE === 'nse' ||
    SOURCE === 'nse_bse' ||
    (SOURCE === 'auto' && isIndianSymbol(symbol));

  if (useNse) {
    try {
      const indian = await getIndianExchangeQuote(symbol);
      if (indian?.price) {
        logger.debug(`Quote ${symbol} from ${indian.source}`);
        return indian;
      }
    } catch (error) {
      logger.warn(`Indian exchange quote failed for ${symbol}, falling back to Yahoo`);
    }
  }

  if (SOURCE === 'nse' || SOURCE === 'nse_bse') {
    return null;
  }

  return getYahooQuote(symbol);
}

export async function getQuotes(symbols) {
  const results = await Promise.all(symbols.map((s) => getQuote(s)));
  return results.filter(Boolean);
}

export async function getLiveIndianMarket() {
  if (SOURCE === 'yahoo') {
    return getYahooQuotes(WATCHLIST.indian);
  }

  try {
    const all = await getNseAllMarketQuotes();
    if (all.length > 0) return all;
    const nseQuotes = await getNseWatchlistQuotes();
    if (nseQuotes.length > 0) return nseQuotes;
  } catch (error) {
    logger.warn('NSE full market failed, using Yahoo:', error.message);
  }

  return getYahooQuotes(WATCHLIST.indian);
}

export {
  getIndianStocksPaginated,
  searchIndianStocks,
  getIndianMarketSummary,
};

export async function getIndices() {
  if (SOURCE === 'yahoo') {
    return getYahooIndices();
  }

  try {
    const nseIndices = await getNseIndices();
    if (nseIndices.length > 0) return nseIndices;
  } catch (error) {
    logger.warn('NSE indices failed, using Yahoo');
  }

  return getYahooIndices();
}

export async function getHistorical(symbol, range = '1mo') {
  return getYahooHistorical(symbol, range);
}

export async function getGainersLosers() {
  const quotes = await getLiveIndianMarket();
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  return {
    gainers: sorted.slice(0, 5),
    losers: sorted.slice(-5).reverse(),
  };
}
