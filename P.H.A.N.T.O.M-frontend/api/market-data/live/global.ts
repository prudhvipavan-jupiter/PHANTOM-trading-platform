import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchQuotes, WATCHLIST } from '../../_lib/yahoo.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const data = await fetchQuotes([...WATCHLIST.global]);
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch live global market data' });
  }
}
