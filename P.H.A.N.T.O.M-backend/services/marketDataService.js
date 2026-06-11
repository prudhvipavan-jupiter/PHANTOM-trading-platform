// P.H.A.N.T.O.M Trading Platform Market Data Service
// Real-time market data management for profit generation

import { logger } from '../utils/logger.js';

let redisClient = null;

export const initializeMarketDataService = async (redis) => {
  try {
    redisClient = redis;
    logger.info('✅ Market Data Service initialized');
  } catch (error) {
    logger.error('❌ Failed to initialize Market Data Service:', error);
    throw error;
  }
};

export const getMarketData = async (symbol) => {
  try {
    // Mock market data - will be replaced with real API calls
    const mockData = {
      symbol: symbol.toUpperCase(),
      currentPrice: Math.random() * 1000 + 100,
      previousClose: Math.random() * 1000 + 100,
      open: Math.random() * 1000 + 100,
      high: Math.random() * 1000 + 100,
      low: Math.random() * 1000 + 100,
      volume: Math.floor(Math.random() * 1000000),
      change: Math.random() * 20 - 10,
      changePercent: Math.random() * 10 - 5,
      timestamp: new Date()
    };

    // Cache the data
    if (redisClient) {
      await redisClient.setEx(`market_data:${symbol}`, 30, JSON.stringify(mockData));
    }

    return mockData;
  } catch (error) {
    logger.error('Error fetching market data:', error);
    throw error;
  }
};

export const getCachedMarketData = async (symbol) => {
  try {
    if (!redisClient) return null;
    
    const cached = await redisClient.get(`market_data:${symbol}`);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.error('Error fetching cached market data:', error);
    return null;
  }
}; 