import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getIndianStocksPaginated } from '../../_lib/indianExchange';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await getIndianStocksPaginated({
      page: parseInt(String(req.query.page || '1'), 10),
      limit: parseInt(String(req.query.limit || '100'), 10),
      search: String(req.query.search || req.query.q || ''),
      exchange: String(req.query.exchange || 'ALL'),
      onlyPriced: req.query.onlyPriced === 'true',
      sort: String(req.query.sort || 'volume'),
    });
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch Indian stocks' });
  }
}
