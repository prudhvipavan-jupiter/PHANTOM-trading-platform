import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchBseQuote } from '../../../_lib/indianExchange';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const symbol = req.query.symbol as string;
  if (!symbol) {
    res.status(400).json({ success: false, error: 'symbol required' });
    return;
  }
  try {
    const data = await fetchBseQuote(symbol);
    if (!data) {
      res.status(404).json({ success: false, error: 'BSE quote not found' });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch BSE quote' });
  }
}
