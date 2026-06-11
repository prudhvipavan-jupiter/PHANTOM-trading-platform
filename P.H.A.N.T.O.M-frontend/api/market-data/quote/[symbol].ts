import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchIndianQuote, NSE_WATCHLIST } from '../../_lib/indianExchange';
import { fetchQuote } from '../../_lib/yahoo';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const symbol = req.query.symbol as string;
  if (!symbol) {
    res.status(400).json({ success: false, error: 'symbol required' });
    return;
  }

  const s = symbol.toUpperCase();
  const isIndian =
    s.endsWith('.NS') ||
    s.endsWith('.BO') ||
    (NSE_WATCHLIST.includes(s.replace('.NS', '').replace('.BO', '')));

  if (isIndian) {
    const indian = await fetchIndianQuote(symbol);
    if (indian) {
      res.status(200).json({ success: true, data: indian });
      return;
    }
  }

  const data = await fetchQuote(symbol);
  if (!data) {
    res.status(404).json({ success: false, error: 'Quote not found' });
    return;
  }
  res.status(200).json({ success: true, data });
}
