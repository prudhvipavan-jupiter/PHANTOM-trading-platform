import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getWalletSummary } from '../services/paperTradingService.js';

const router = express.Router();

router.get('/balance', authenticate, async (req, res) => {
  try {
    const data = await getWalletSummary(req.user);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch wallet balance' });
  }
});

export default router;
