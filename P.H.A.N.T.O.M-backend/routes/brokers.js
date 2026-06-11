// P.H.A.N.T.O.M Trading Platform Brokers Routes
// Broker integration for real trading

import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get available brokers
router.get('/list', async (req, res) => {
  try {
    const brokers = [
      {
        id: 'zerodha',
        name: 'Zerodha',
        logo: 'zerodha-logo.png',
        features: ['Equity', 'F&O', 'Currency', 'Commodity'],
        brokerage: '₹20 or 0.03%',
        rating: 4.5,
        isConnected: false
      },
      {
        id: 'paytm_money',
        name: 'Paytm Money',
        logo: 'paytm-money-logo.png',
        features: ['Equity', 'MF', 'IPO'],
        brokerage: '₹15 or 0.02%',
        rating: 4.2,
        isConnected: false
      },
      {
        id: 'angel_one',
        name: 'Angel One',
        logo: 'angel-one-logo.png',
        features: ['Equity', 'F&O', 'Currency', 'Commodity'],
        brokerage: '₹25 or 0.04%',
        rating: 4.3,
        isConnected: false
      },
      {
        id: 'upstox',
        name: 'Upstox',
        logo: 'upstox-logo.png',
        features: ['Equity', 'F&O', 'Currency'],
        brokerage: '₹20 or 0.05%',
        rating: 4.1,
        isConnected: false
      }
    ];

    res.status(200).json({
      success: true,
      data: brokers
    });

  } catch (error) {
    logger.error('Error fetching brokers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch brokers'
    });
  }
});

// Connect to broker
router.post('/connect/:brokerId', async (req, res) => {
  try {
    const { brokerId } = req.params;
    const { apiKey, apiSecret } = req.body;

    // Mock connection response
    const mockConnection = {
      brokerId,
      status: 'CONNECTED',
      accountId: 'ACC123456',
      message: 'Successfully connected to broker'
    };

    res.status(200).json({
      success: true,
      data: mockConnection
    });

  } catch (error) {
    logger.error('Error connecting to broker:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to broker'
    });
  }
});

export default router; 