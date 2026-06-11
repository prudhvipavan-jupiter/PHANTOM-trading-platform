import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  fetchNseAllMarketQuotes,
  getIndianStocksPaginated,
} from '../../_lib/indianExchange.js';
import { fetchQuotes, WATCHLIST } from '../../_lib/yahoo.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.query.page || req.query.limit || req.query.search) {
      const data = await getIndianStocksPaginated({
        page: parseInt(String(req.query.page || '1'), 10),
        limit: parseInt(String(req.query.limit || '100'), 10),
        search: String(req.query.search || ''),
        exchange: String(req.query.exchange || 'ALL'),
        onlyPriced: req.query.onlyPriced !== 'false',
        sort: String(req.query.sort || 'volume'),
      });
      res.status(200).json({ success: true, data });
      return;
    }

    const nseData = await fetchNseAllMarketQuotes();
    if (nseData.length > 0) {
      res.status(200).json({
        success: true,
        data: nseData,
        source: 'NSE',
        meta: { count: nseData.length, fullCatalog: '/api/market-data/indian/stocks' },
      });
      return;
    }
    const yahooData = await fetchQuotes(WATCHLIST.indian);
    res.status(200).json({ success: true, data: yahooData, source: 'Yahoo' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch live Indian market data' });
  }
}
