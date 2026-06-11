import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getIndianMarketSummary } from '../../_lib/indianExchange.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const data = await getIndianMarketSummary();
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch market summary' });
  }
}
