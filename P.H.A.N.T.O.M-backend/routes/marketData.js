import express from 'express';
import {
  getQuote,
  getQuotes,
  getHistorical,
  getGainersLosers,
  getIndices,
  getLiveIndianMarket,
  WATCHLIST,
} from '../services/marketQuoteService.js';
import {
  getNseEquityQuote,
  getBseEquityQuote,
  getNseIndices,
  getNseIndex,
  getIndianStocksPaginated,
  searchIndianStocks,
  getIndianMarketSummary,
  NSE_WATCHLIST,
} from '../services/indianExchangeService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.get('/watchlist', async (_req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: { ...WATCHLIST, nse: NSE_WATCHLIST },
    });
  } catch (error) {
    logger.error('watchlist error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch watchlist' });
  }
});

router.get('/quote/:symbol', async (req, res) => {
  try {
    const quote = await getQuote(req.params.symbol);
    if (!quote) {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }
    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    logger.error('quote error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quote' });
  }
});

router.get('/nse/quote/:symbol', async (req, res) => {
  try {
    const quote = await getNseEquityQuote(req.params.symbol);
    if (!quote) {
      return res.status(404).json({ success: false, error: 'NSE quote not found' });
    }
    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    logger.error('nse quote error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch NSE quote' });
  }
});

router.get('/bse/quote/:symbol', async (req, res) => {
  try {
    const quote = await getBseEquityQuote(req.params.symbol);
    if (!quote) {
      return res.status(404).json({ success: false, error: 'BSE quote not found' });
    }
    res.status(200).json({ success: true, data: quote });
  } catch (error) {
    logger.error('bse quote error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch BSE quote' });
  }
});

router.get('/nse/indices', async (_req, res) => {
  try {
    const data = await getNseIndices();
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('nse indices error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch NSE indices' });
  }
});

router.get('/nse/index/:name', async (req, res) => {
  try {
    const data = await getNseIndex(req.params.name);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Index not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch NSE index' });
  }
});

router.post('/quotes', async (req, res) => {
  try {
    const { symbols } = req.body;
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ success: false, error: 'symbols array required' });
    }
    const quotes = await getQuotes(symbols.slice(0, 30));
    res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    logger.error('batch quotes error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quotes' });
  }
});

router.get('/history/:symbol', async (req, res) => {
  try {
    const range = req.query.range || '1mo';
    const data = await getHistorical(req.params.symbol, range);
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('history error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

router.get('/gainers', async (_req, res) => {
  try {
    const { gainers } = await getGainersLosers();
    res.status(200).json({ success: true, data: gainers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch gainers' });
  }
});

router.get('/losers', async (_req, res) => {
  try {
    const { losers } = await getGainersLosers();
    res.status(200).json({ success: true, data: losers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch losers' });
  }
});

router.get('/indices', async (_req, res) => {
  try {
    const data = await getIndices();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch indices' });
  }
});

router.get('/indian/summary', async (_req, res) => {
  try {
    const data = await getIndianMarketSummary();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch market summary' });
  }
});

router.get('/indian/stocks', async (req, res) => {
  try {
    const data = await getIndianStocksPaginated({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search || req.query.q,
      exchange: req.query.exchange || 'ALL',
      onlyPriced: req.query.onlyPriced === 'true',
      sort: req.query.sort || 'volume',
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    logger.error('indian stocks error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Indian stocks' });
  }
});

router.get('/indian/search', async (req, res) => {
  try {
    const q = String(req.query.q || req.query.search || '').trim();
    if (!q) {
      return res.status(400).json({ success: false, error: 'q parameter required' });
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    const data = await searchIndianStocks(q, limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

router.get('/live/indian', async (req, res) => {
  try {
    if (req.query.page || req.query.limit || req.query.search) {
      const data = await getIndianStocksPaginated({
        page: req.query.page || 1,
        limit: req.query.limit || 100,
        search: req.query.search,
        exchange: req.query.exchange || 'ALL',
        onlyPriced: req.query.onlyPriced !== 'false',
        sort: req.query.sort || 'volume',
      });
      return res.status(200).json({ success: true, data });
    }

    const data = await getLiveIndianMarket();
    res.status(200).json({
      success: true,
      data,
      meta: { count: data.length, fullCatalog: '/api/market-data/indian/stocks' },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch Indian market data' });
  }
});

router.get('/live/global', async (_req, res) => {
  try {
    const data = await getQuotes([...WATCHLIST.global, ...WATCHLIST.crypto]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch global market data' });
  }
});

export default router;
