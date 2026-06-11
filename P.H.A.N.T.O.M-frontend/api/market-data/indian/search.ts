import type { VercelRequest, VercelResponse } from '@vercel/node';
import { searchIndianStocks } from '../../_lib/indianExchange.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = String(req.query.q || req.query.search || '').trim();
  if (!q) {
    res.status(400).json({ success: false, error: 'q parameter required' });
    return;
  }
  try {
    const limit = Math.min(parseInt(String(req.query.limit || '30'), 10), 100);
    const data = await searchIndianStocks(q, limit);
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
}
