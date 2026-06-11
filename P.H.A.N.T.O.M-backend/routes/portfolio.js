// P.H.A.N.T.O.M Trading Platform Portfolio Routes
// Portfolio management for profit tracking

import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get portfolio overview
router.get('/overview', async (req, res) => {
  try {
    const mockPortfolio = {
      totalValue: 1250000,
      totalInvested: 1000000,
      totalProfitLoss: 250000,
      totalProfitLossPercentage: 25,
      numberOfHoldings: 8,
      topHoldings: [
        { symbol: 'RELIANCE', value: 300000, percentage: 24 },
        { symbol: 'TCS', value: 250000, percentage: 20 },
        { symbol: 'HDFC', value: 200000, percentage: 16 },
        { symbol: 'INFY', value: 150000, percentage: 12 },
        { symbol: 'ICICIBANK', value: 100000, percentage: 8 }
      ],
      performance: {
        dailyReturn: 2.5,
        weeklyReturn: 8.2,
        monthlyReturn: 15.5,
        yearlyReturn: 45.8
      }
    };

    res.status(200).json({
      success: true,
      data: mockPortfolio
    });

  } catch (error) {
    logger.error('Error fetching portfolio overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio overview'
    });
  }
});

// Get portfolio holdings
router.get('/holdings', async (req, res) => {
  try {
    const mockHoldings = [
      {
        symbol: 'RELIANCE',
        symbolName: 'Reliance Industries Limited',
        quantity: 100,
        averagePrice: 2400,
        currentPrice: 2450,
        marketValue: 245000,
        investedAmount: 240000,
        profitLoss: 5000,
        profitLossPercentage: 2.08
      },
      {
        symbol: 'TCS',
        symbolName: 'Tata Consultancy Services Limited',
        quantity: 50,
        averagePrice: 3800,
        currentPrice: 3850,
        marketValue: 192500,
        investedAmount: 190000,
        profitLoss: 2500,
        profitLossPercentage: 1.32
      }
    ];

    res.status(200).json({
      success: true,
      data: mockHoldings
    });

  } catch (error) {
    logger.error('Error fetching holdings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch holdings'
    });
  }
});

export default router; 