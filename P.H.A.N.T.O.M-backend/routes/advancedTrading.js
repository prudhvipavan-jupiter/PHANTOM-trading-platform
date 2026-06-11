// P.H.A.N.T.O.M Advanced Trading Routes
// World-class trading API endpoints for profit generation

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import advancedTradingService from '../services/advancedTradingService.js';
import advancedAIService from '../services/advancedAIService.js';
import realTimeMarketService from '../services/realTimeMarketService.js';

const router = express.Router();

// Initialize services
let servicesInitialized = false;

const initializeServices = async () => {
  if (!servicesInitialized) {
    try {
      await advancedTradingService.initialize();
      await realTimeMarketService.initialize();
      servicesInitialized = true;
      logger.info('✅ All advanced trading services initialized');
    } catch (error) {
      logger.error('❌ Failed to initialize advanced trading services:', error);
      throw error;
    }
  }
};

// Initialize services on startup
initializeServices().catch(console.error);

// 🎯 Advanced AI Trading Routes

/**
 * @route POST /api/advanced-trading/ai-prediction
 * @desc Get advanced AI prediction for a symbol
 * @access Private
 */
router.post('/ai-prediction', authenticateToken, async (req, res) => {
  try {
    const { symbol, timeframe = '1D', features = {} } = req.body;
    const userId = req.user.id;

    if (!symbol) {
      return res.status(400).json({ 
        success: false, 
        message: 'Symbol is required' 
      });
    }

    // Get AI prediction
    const prediction = await advancedAIService.generateAdvancedPrediction(
      symbol, 
      timeframe, 
      features
    );

    logger.info(`🎯 AI prediction requested by user ${userId} for ${symbol}`);

    res.json({
      success: true,
      data: prediction,
      message: 'AI prediction generated successfully'
    });
  } catch (error) {
    logger.error('❌ Error generating AI prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI prediction',
      error: error.message
    });
  }
});

/**
 * @route GET /api/advanced-trading/ai-performance
 * @desc Get AI model performance metrics
 * @access Private
 */
router.get('/ai-performance', authenticateToken, async (req, res) => {
  try {
    const { modelType } = req.query;
    const performance = advancedAIService.getModelPerformance(modelType);

    res.json({
      success: true,
      data: performance,
      message: 'AI performance metrics retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting AI performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI performance metrics',
      error: error.message
    });
  }
});

// 📈 Advanced Trading Routes

/**
 * @route POST /api/advanced-trading/place-order
 * @desc Place advanced trading order with AI integration
 * @access Private
 */
router.post('/place-order', authenticateToken, async (req, res) => {
  try {
    const {
      symbol,
      orderType,
      quantity,
      price,
      stopLoss,
      takeProfit,
      strategy = 'MANUAL',
      useAI = false,
      copyTraderId = null
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!symbol || !orderType || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: 'Symbol, orderType, quantity, and price are required'
      });
    }

    // Get AI prediction if requested
    let aiConfidence = 0;
    if (useAI) {
      try {
        const aiPrediction = await advancedAIService.generateAdvancedPrediction(symbol);
        aiConfidence = aiPrediction.confidence;
        
        // Auto-adjust order based on AI prediction
        if (aiPrediction.prediction.direction === 'BULLISH' && orderType === 'SELL') {
          return res.status(400).json({
            success: false,
            message: 'AI predicts bullish movement, consider BUY order instead'
          });
        }
        
        if (aiPrediction.prediction.direction === 'BEARISH' && orderType === 'BUY') {
          return res.status(400).json({
            success: false,
            message: 'AI predicts bearish movement, consider SELL order instead'
          });
        }
      } catch (aiError) {
        logger.warn(`⚠️ AI prediction failed for ${symbol}:`, aiError);
      }
    }

    // Prepare order data
    const orderData = {
      userId,
      symbol,
      orderType,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      strategy,
      aiConfidence,
      copyTraderId
    };

    // Place order
    const result = await advancedTradingService.placeAdvancedOrder(orderData);

    logger.info(`🎯 Advanced order placed by user ${userId}: ${result.orderId}`);

    res.json({
      success: true,
      data: result,
      message: 'Order placed successfully'
    });
  } catch (error) {
    logger.error('❌ Error placing advanced order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order',
      error: error.message
    });
  }
});

/**
 * @route GET /api/advanced-trading/positions
 * @desc Get user's open positions
 * @access Private
 */
router.get('/positions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const positions = await advancedTradingService.getOpenPositions(userId);

    res.json({
      success: true,
      data: positions,
      message: 'Positions retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting positions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get positions',
      error: error.message
    });
  }
});

/**
 * @route POST /api/advanced-trading/close-position
 * @desc Close a specific position
 * @access Private
 */
router.post('/close-position', authenticateToken, async (req, res) => {
  try {
    const { positionId, reason = 'MANUAL' } = req.body;
    const userId = req.user.id;

    if (!positionId) {
      return res.status(400).json({
        success: false,
        message: 'Position ID is required'
      });
    }

    const result = await advancedTradingService.closePosition(positionId, reason);

    logger.info(`📉 Position closed by user ${userId}: ${positionId}`);

    res.json({
      success: true,
      data: result,
      message: 'Position closed successfully'
    });
  } catch (error) {
    logger.error('❌ Error closing position:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to close position',
      error: error.message
    });
  }
});

// 📊 Advanced Analytics Routes

/**
 * @route GET /api/advanced-trading/analytics
 * @desc Get comprehensive trading analytics
 * @access Private
 */
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = '1M' } = req.query;

    const analytics = await advancedTradingService.getAdvancedAnalytics(userId, timeframe);

    res.json({
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

/**
 * @route GET /api/advanced-trading/trading-history
 * @desc Get user's trading history
 * @access Private
 */
router.get('/trading-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 100 } = req.query;

    const history = advancedTradingService.getTradingHistory(userId, parseInt(limit));

    res.json({
      success: true,
      data: history,
      message: 'Trading history retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting trading history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trading history',
      error: error.message
    });
  }
});

// 👥 Copy Trading Routes

/**
 * @route POST /api/advanced-trading/setup-copy-trading
 * @desc Setup copy trading for a user
 * @access Private
 */
router.post('/setup-copy-trading', authenticateToken, async (req, res) => {
  try {
    const { traderId, allocation } = req.body;
    const userId = req.user.id;

    if (!traderId || !allocation) {
      return res.status(400).json({
        success: false,
        message: 'Trader ID and allocation are required'
      });
    }

    if (allocation > 0.5) {
      return res.status(400).json({
        success: false,
        message: 'Allocation cannot exceed 50%'
      });
    }

    const result = await advancedTradingService.setupCopyTrading(userId, traderId, allocation);

    logger.info(`👥 Copy trading setup by user ${userId} for trader ${traderId}`);

    res.json({
      success: true,
      data: result,
      message: 'Copy trading setup successfully'
    });
  } catch (error) {
    logger.error('❌ Error setting up copy trading:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to setup copy trading',
      error: error.message
    });
  }
});

/**
 * @route GET /api/advanced-trading/copy-trading-status
 * @desc Get copy trading status for user
 * @access Private
 */
router.get('/copy-trading-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get copy trading configurations for user
    const copyTradingConfigs = [];
    for (const [key, config] of advancedTradingService.copiedTraders) {
      if (config.userId === userId) {
        copyTradingConfigs.push(config);
      }
    }

    res.json({
      success: true,
      data: copyTradingConfigs,
      message: 'Copy trading status retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting copy trading status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get copy trading status',
      error: error.message
    });
  }
});

// 📈 Real-time Market Data Routes

/**
 * @route GET /api/advanced-trading/market-data/:symbol
 * @desc Get real-time market data for a symbol
 * @access Private
 */
router.get('/market-data/:symbol', authenticateToken, async (req, res) => {
  try {
    const { symbol } = req.params;
    const marketData = await realTimeMarketService.getMarketData(symbol);

    res.json({
      success: true,
      data: marketData,
      message: 'Market data retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting market data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get market data',
      error: error.message
    });
  }
});

/**
 * @route POST /api/advanced-trading/market-data/batch
 * @desc Get market data for multiple symbols
 * @access Private
 */
router.post('/market-data/batch', authenticateToken, async (req, res) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        message: 'Symbols array is required'
      });
    }

    const marketData = await realTimeMarketService.getMultipleMarketData(symbols);

    res.json({
      success: true,
      data: marketData,
      message: 'Batch market data retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting batch market data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get batch market data',
      error: error.message
    });
  }
});

/**
 * @route GET /api/advanced-trading/market-overview
 * @desc Get market overview with indices and sector performance
 * @access Private
 */
router.get('/market-overview', authenticateToken, async (req, res) => {
  try {
    const overview = await realTimeMarketService.getMarketOverview();

    res.json({
      success: true,
      data: overview,
      message: 'Market overview retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting market overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get market overview',
      error: error.message
    });
  }
});

/**
 * @route GET /api/advanced-trading/search-stocks
 * @desc Search stocks by name or symbol
 * @access Private
 */
router.get('/search-stocks', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const results = await realTimeMarketService.searchStocks(query);

    res.json({
      success: true,
      data: results,
      message: 'Stock search completed successfully'
    });
  } catch (error) {
    logger.error('❌ Error searching stocks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search stocks',
      error: error.message
    });
  }
});

// 🔧 Risk Management Routes

/**
 * @route GET /api/advanced-trading/risk-limits
 * @desc Get current risk management limits
 * @access Private
 */
router.get('/risk-limits', authenticateToken, async (req, res) => {
  try {
    const riskLimits = advancedTradingService.riskLimits.get('default');

    res.json({
      success: true,
      data: riskLimits,
      message: 'Risk limits retrieved successfully'
    });
  } catch (error) {
    logger.error('❌ Error getting risk limits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get risk limits',
      error: error.message
    });
  }
});

/**
 * @route POST /api/advanced-trading/risk-limits
 * @desc Update risk management limits
 * @access Private
 */
router.post('/risk-limits', authenticateToken, async (req, res) => {
  try {
    const {
      maxPositionSize,
      maxDailyLoss,
      maxDrawdown,
      stopLossPercent,
      takeProfitPercent,
      maxOpenPositions,
      minConfidence,
      leverageLimit
    } = req.body;

    const userId = req.user.id;

    // Validate risk limits
    if (maxPositionSize > 0.5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum position size cannot exceed 50%'
      });
    }

    if (maxDailyLoss > 0.1) {
      return res.status(400).json({
        success: false,
        message: 'Maximum daily loss cannot exceed 10%'
      });
    }

    // Update risk limits
    const updatedLimits = {
      maxPositionSize: maxPositionSize || 0.1,
      maxDailyLoss: maxDailyLoss || 0.05,
      maxDrawdown: maxDrawdown || 0.15,
      stopLossPercent: stopLossPercent || 0.02,
      takeProfitPercent: takeProfitPercent || 0.04,
      maxOpenPositions: maxOpenPositions || 10,
      minConfidence: minConfidence || 70,
      leverageLimit: leverageLimit || 2.0
    };

    advancedTradingService.riskLimits.set('default', updatedLimits);

    logger.info(`🔧 Risk limits updated by user ${userId}`);

    res.json({
      success: true,
      data: updatedLimits,
      message: 'Risk limits updated successfully'
    });
  } catch (error) {
    logger.error('❌ Error updating risk limits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update risk limits',
      error: error.message
    });
  }
});

// 📡 Real-time Subscription Routes

/**
 * @route POST /api/advanced-trading/subscribe-market-data
 * @desc Subscribe to real-time market data
 * @access Private
 */
router.post('/subscribe-market-data', authenticateToken, async (req, res) => {
  try {
    const { symbols } = req.body;
    const userId = req.user.id;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        message: 'Symbols array is required'
      });
    }

    realTimeMarketService.subscribeToMarketData(userId, symbols);

    res.json({
      success: true,
      message: `Subscribed to ${symbols.length} symbols successfully`
    });
  } catch (error) {
    logger.error('❌ Error subscribing to market data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to market data',
      error: error.message
    });
  }
});

/**
 * @route POST /api/advanced-trading/unsubscribe-market-data
 * @desc Unsubscribe from real-time market data
 * @access Private
 */
router.post('/unsubscribe-market-data', authenticateToken, async (req, res) => {
  try {
    const { symbols } = req.body;
    const userId = req.user.id;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        message: 'Symbols array is required'
      });
    }

    realTimeMarketService.unsubscribeFromMarketData(userId, symbols);

    res.json({
      success: true,
      message: `Unsubscribed from ${symbols.length} symbols successfully`
    });
  } catch (error) {
    logger.error('❌ Error unsubscribing from market data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from market data',
      error: error.message
    });
  }
});

// 🎯 Strategy Routes

/**
 * @route POST /api/advanced-trading/strategy-backtest
 * @desc Backtest a trading strategy
 * @access Private
 */
router.post('/strategy-backtest', authenticateToken, async (req, res) => {
  try {
    const {
      symbol,
      strategy,
      startDate,
      endDate,
      initialCapital,
      parameters = {}
    } = req.body;

    const userId = req.user.id;

    if (!symbol || !strategy || !startDate || !endDate || !initialCapital) {
      return res.status(400).json({
        success: false,
        message: 'Symbol, strategy, startDate, endDate, and initialCapital are required'
      });
    }

    // Mock backtest results
    const backtestResults = {
      symbol,
      strategy,
      startDate,
      endDate,
      initialCapital,
      finalCapital: initialCapital * (1 + Math.random() * 0.5), // 0-50% return
      totalReturn: Math.random() * 50,
      annualizedReturn: Math.random() * 25,
      maxDrawdown: Math.random() * 15,
      sharpeRatio: Math.random() * 2 + 0.5,
      totalTrades: Math.floor(Math.random() * 100) + 10,
      winRate: Math.random() * 40 + 40, // 40-80%
      profitFactor: Math.random() * 2 + 1,
      trades: []
    };

    logger.info(`📊 Strategy backtest completed for user ${userId}: ${strategy} on ${symbol}`);

    res.json({
      success: true,
      data: backtestResults,
      message: 'Strategy backtest completed successfully'
    });
  } catch (error) {
    logger.error('❌ Error running strategy backtest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run strategy backtest',
      error: error.message
    });
  }
});

export default router; 