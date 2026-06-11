import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchNseIndices } from '../../_lib/indianExchange';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const data = await fetchNseIndices();
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch NSE indices' });
  }
}
