// P.H.A.N.T.O.M Trading Platform Market Data Routes
// Real-time market data for profit generation

import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get stock quote
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Mock data for now - will be replaced with real API calls
    const mockQuote = {
      symbol: symbol.toUpperCase(),
      symbolName: `${symbol.toUpperCase()} Limited`,
      currentPrice: Math.random() * 1000 + 100,
      previousClose: Math.random() * 1000 + 100,
      open: Math.random() * 1000 + 100,
      high: Math.random() * 1000 + 100,
      low: Math.random() * 1000 + 100,
      volume: Math.floor(Math.random() * 1000000),
      change: Math.random() * 20 - 10,
      changePercent: Math.random() * 10 - 5,
      marketCap: Math.random() * 10000000000,
      pe: Math.random() * 50 + 10,
      pb: Math.random() * 5 + 1,
      dividendYield: Math.random() * 5,
      timestamp: new Date()
    };

    res.status(200).json({
      success: true,
      data: mockQuote
    });

  } catch (error) {
    logger.error('Error fetching quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quote'
    });
  }
});

// Get top gainers
router.get('/gainers', async (req, res) => {
  try {
    const mockGainers = [
      { symbol: 'RELIANCE', changePercent: 5.2, currentPrice: 2450 },
      { symbol: 'TCS', changePercent: 4.8, currentPrice: 3850 },
      { symbol: 'HDFC', changePercent: 4.1, currentPrice: 1650 },
      { symbol: 'INFY', changePercent: 3.9, currentPrice: 1450 },
      { symbol: 'ICICIBANK', changePercent: 3.5, currentPrice: 950 }
    ];

    res.status(200).json({
      success: true,
      data: mockGainers
    });

  } catch (error) {
    logger.error('Error fetching gainers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gainers'
    });
  }
});

// Get top losers
router.get('/losers', async (req, res) => {
  try {
    const mockLosers = [
      { symbol: 'WIPRO', changePercent: -4.2, currentPrice: 450 },
      { symbol: 'TECHM', changePercent: -3.8, currentPrice: 1250 },
      { symbol: 'HCLTECH', changePercent: -3.1, currentPrice: 1150 },
      { symbol: 'LT', changePercent: -2.9, currentPrice: 2850 },
      { symbol: 'AXISBANK', changePercent: -2.5, currentPrice: 950 }
    ];

    res.status(200).json({
      success: true,
      data: mockLosers
    });

  } catch (error) {
    logger.error('Error fetching losers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch losers'
    });
  }
});

// Get market indices
router.get('/indices', async (req, res) => {
  try {
    const mockIndices = [
      { name: 'NIFTY 50', value: 19500, change: 125, changePercent: 0.65 },
      { name: 'SENSEX', value: 64500, change: 425, changePercent: 0.66 },
      { name: 'BANK NIFTY', value: 44500, change: 225, changePercent: 0.51 },
      { name: 'NIFTY IT', value: 32500, change: -125, changePercent: -0.38 },
      { name: 'NIFTY PHARMA', value: 12500, change: 75, changePercent: 0.60 }
    ];

    res.status(200).json({
      success: true,
      data: mockIndices
    });

  } catch (error) {
    logger.error('Error fetching indices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch indices'
    });
  }
});

export default router; 