import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'OK',
    message: 'P.H.A.N.T.O.M market API (Vercel)',
    mode: 'paper-trading-frontend',
  });
}
