import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getOrCreatePortfolio,
  refreshPortfolioPrices,
  getWalletSummary,
} from '../services/paperTradingService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.get('/overview', authenticate, async (req, res) => {
  try {
    const wallet = await getWalletSummary(req.user);
    const portfolio = await getOrCreatePortfolio(req.user._id);
    await refreshPortfolioPrices(portfolio);

    res.status(200).json({
      success: true,
      data: {
        totalValue: wallet.totalEquity,
        cashBalance: wallet.balance,
        portfolioValue: wallet.portfolioValue,
        totalInvested: portfolio.summary.totalInvested,
        totalProfitLoss: portfolio.summary.totalProfitLoss,
        totalProfitLossPercentage: portfolio.summary.totalProfitLossPercentage,
        numberOfHoldings: portfolio.summary.numberOfHoldings,
        topHoldings: portfolio.holdings
          .sort((a, b) => b.marketValue - a.marketValue)
          .slice(0, 5)
          .map((h) => ({
            symbol: h.symbol,
            value: h.marketValue,
            percentage: portfolio.summary.totalMarketValue
              ? (h.marketValue / portfolio.summary.totalMarketValue) * 100
              : 0,
          })),
        performance: {
          dailyReturn: portfolio.performance?.dailyReturn ?? 0,
          weeklyReturn: portfolio.performance?.weeklyReturn ?? 0,
          monthlyReturn: portfolio.performance?.monthlyReturn ?? 0,
          yearlyReturn: portfolio.performance?.totalReturn ?? 0,
        },
      },
    });
  } catch (error) {
    logger.error('portfolio overview error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch portfolio overview' });
  }
});

router.get('/holdings', authenticate, async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio(req.user._id);
    await refreshPortfolioPrices(portfolio);
    res.status(200).json({ success: true, data: portfolio.holdings });
  } catch (error) {
    logger.error('holdings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch holdings' });
  }
});

router.get('/wallet', authenticate, async (req, res) => {
  try {
    const wallet = await getWalletSummary(req.user);
    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    logger.error('wallet error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wallet' });
  }
});

export default router;
