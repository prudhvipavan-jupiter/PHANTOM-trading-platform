// P.H.A.N.T.O.M Trading Platform Trading Routes
// Order execution and trade management for profit generation

import express from 'express';
import Trade from '../models/Trade.js';
import { authenticate } from '../middleware/authenticate.js';
import { tradingRateLimiter } from '../middleware/rateLimiter.js';
import {
  executePaperOrder,
  getOrCreatePortfolio,
  resolveMarketPrice,
} from '../services/paperTradingService.js';
import { logger, logTrade, logError } from '../utils/logger.js';

const router = express.Router();

// Place paper trade (executed at live Yahoo price)
router.post('/order', authenticate, tradingRateLimiter, async (req, res) => {
  try {
    const {
      symbol,
      symbolName,
      exchange,
      market,
      tradeType,
      orderType = 'MARKET',
      quantity,
      price,
      stopLoss,
      takeProfit,
    } = req.body;

    if (!symbol || !tradeType || !quantity) {
      return res.status(400).json({ success: false, error: 'symbol, tradeType, and quantity are required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
    }

    const quote = await resolveMarketPrice(symbol);
    const executionPrice = orderType === 'LIMIT' && price > 0 ? price : quote.price;
    const totalAmount = quantity * executionPrice;

    if (tradeType === 'BUY' && req.user.wallet.balance < totalAmount) {
      return res.status(400).json({ success: false, error: 'Insufficient paper trading balance' });
    }

    if (tradeType === 'SELL') {
      const portfolio = await getOrCreatePortfolio(req.user._id);
      const holding = portfolio.holdings.find((h) => h.symbol === symbol.toUpperCase());
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ success: false, error: 'Insufficient holdings to sell' });
      }
    }

    if (tradeType === 'BUY') {
      req.user.wallet.balance -= totalAmount;
      await req.user.save();
    }

    const trade = new Trade({
      userId: req.user._id,
      symbol: symbol.toUpperCase(),
      symbolName: symbolName || quote.symbolName || symbol,
      exchange: exchange || 'NSE',
      market: market || 'indian_stocks',
      tradeType,
      orderType,
      quantity,
      price: executionPrice,
      totalAmount,
      stopLoss,
      takeProfit,
      strategy: { name: 'PAPER', type: 'MANUAL' },
      status: 'PENDING',
      broker: 'paper_trading',
    });

    await trade.save();

    const { trade: executed } = await executePaperOrder(req.user, trade);

    logTrade({
      userId: req.user._id,
      symbol,
      tradeType,
      quantity,
      price: executionPrice,
      totalAmount,
      orderType,
    });

    logger.info(`Paper order executed for ${req.user.email}: ${symbol} ${tradeType} ${quantity}`);

    res.status(201).json({
      success: true,
      message: 'Paper order executed at live price',
      data: {
        trade: executed.toObject(),
        livePrice: quote.price,
        remainingBalance: req.user.wallet.balance,
      },
    });
  } catch (error) {
    logError(error, 'TRADING_PLACE_ORDER');
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to place order',
    });
  }
});

// Get user's orders
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { status, symbol, limit = 50, page = 1 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (symbol) {
      query.symbol = symbol.toUpperCase();
    }

    const skip = (page - 1) * limit;
    
    const trades = await Trade.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email');

    const total = await Trade.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        trades,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logError(error, 'TRADING_GET_ORDERS');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// Get specific order
router.get('/order/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const trade = await Trade.findOne({
      _id: orderId,
      userId: req.user._id
    }).populate('userId', 'firstName lastName email');

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { trade }
    });

  } catch (error) {
    logError(error, 'TRADING_GET_ORDER');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

// Modify order
router.put('/order/:orderId', authenticate, tradingRateLimiter, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { price, quantity, stopLoss, takeProfit } = req.body;

    const trade = await Trade.findOne({
      _id: orderId,
      userId: req.user._id,
      status: 'PENDING'
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or cannot be modified'
      });
    }

    // Update order details
    if (price !== undefined) trade.price = price;
    if (quantity !== undefined) trade.quantity = quantity;
    if (stopLoss !== undefined) trade.stopLoss = stopLoss;
    if (takeProfit !== undefined) trade.takeProfit = takeProfit;

    // Recalculate total amount
    trade.totalAmount = trade.quantity * trade.price;

    await trade.save();

    logger.info(`Order modified by ${req.user.email}: ${trade.symbol} ${trade.tradeType}`);

    res.status(200).json({
      success: true,
      message: 'Order modified successfully',
      data: { trade }
    });

  } catch (error) {
    logError(error, 'TRADING_MODIFY_ORDER');
    res.status(500).json({
      success: false,
      error: 'Failed to modify order'
    });
  }
});

// Cancel order
router.delete('/order/:orderId', authenticate, tradingRateLimiter, async (req, res) => {
  try {
    const { orderId } = req.params;

    const trade = await Trade.findOne({
      _id: orderId,
      userId: req.user._id,
      status: 'PENDING'
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Order not found or cannot be cancelled'
      });
    }

    // Update order status
    trade.status = 'CANCELLED';
    await trade.save();

    // Refund the amount to user's wallet
    req.user.wallet.balance += trade.totalAmount;
    await req.user.save();

    logger.info(`Order cancelled by ${req.user.email}: ${trade.symbol} ${trade.tradeType}`);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        trade,
        remainingBalance: req.user.wallet.balance
      }
    });

  } catch (error) {
    logError(error, 'TRADING_CANCEL_ORDER');
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order'
    });
  }
});

// Get trade history
router.get('/history', authenticate, async (req, res) => {
  try {
    const { symbol, startDate, endDate, limit = 50, page = 1 } = req.query;
    
    const query = { 
      userId: req.user._id,
      status: 'COMPLETED'
    };
    
    if (symbol) {
      query.symbol = symbol.toUpperCase();
    }
    
    if (startDate || endDate) {
      query.entryTime = {};
      if (startDate) query.entryTime.$gte = new Date(startDate);
      if (endDate) query.entryTime.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const trades = await Trade.find(query)
      .sort({ entryTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trade.countDocuments(query);

    // Calculate summary statistics
    const stats = await Trade.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          totalProfit: { $sum: { $cond: [{ $gt: ['$profitLoss', 0] }, '$profitLoss', 0] } },
          totalLoss: { $sum: { $cond: [{ $lt: ['$profitLoss', 0] }, '$profitLoss', 0] } },
          netProfit: { $sum: '$profitLoss' },
          winningTrades: { $sum: { $cond: [{ $gt: ['$profitLoss', 0] }, 1, 0] } },
          losingTrades: { $sum: { $cond: [{ $lt: ['$profitLoss', 0] }, 1, 0] } }
        }
      }
    ]);

    const summary = stats[0] || {
      totalTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      winningTrades: 0,
      losingTrades: 0
    };

    summary.winRate = summary.totalTrades > 0 ? (summary.winningTrades / summary.totalTrades) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        trades,
        summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logError(error, 'TRADING_GET_HISTORY');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trade history'
    });
  }
});

// Close position (sell/buy back)
router.post('/close/:orderId', authenticate, tradingRateLimiter, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { exitPrice } = req.body;

    if (!exitPrice || exitPrice <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid exit price is required'
      });
    }

    const trade = await Trade.findOne({
      _id: orderId,
      userId: req.user._id,
      status: 'COMPLETED'
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Position not found'
      });
    }

    // Close the trade
    await trade.closeTrade(exitPrice);

    // Calculate profit/loss
    const profitLoss = trade.profitLoss;
    const netProfitLoss = trade.netProfitLoss;

    // Update user's wallet
    req.user.wallet.balance += (trade.totalAmount + profitLoss);
    
    // Update user's profit metrics
    await req.user.updateProfitMetrics({
      profit: profitLoss,
      isWin: profitLoss > 0
    });

    await req.user.save();

    // Log the trade closure
    logTrade({
      userId: req.user._id,
      symbol: trade.symbol,
      action: 'CLOSE',
      profitLoss,
      exitPrice
    });

    logger.info(`Position closed by ${req.user.email}: ${trade.symbol} P&L: ${profitLoss}`);

    res.status(200).json({
      success: true,
      message: 'Position closed successfully',
      data: {
        trade,
        profitLoss,
        netProfitLoss,
        remainingBalance: req.user.wallet.balance
      }
    });

  } catch (error) {
    logError(error, 'TRADING_CLOSE_POSITION');
    res.status(500).json({
      success: false,
      error: 'Failed to close position'
    });
  }
});

// Get trading statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { period = '1M' } = req.query;

    let startDate = new Date();
    switch (period) {
      case '1W':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    const stats = await Trade.aggregate([
      {
        $match: {
          userId: req.user._id,
          status: 'COMPLETED',
          entryTime: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          totalProfit: { $sum: { $cond: [{ $gt: ['$profitLoss', 0] }, '$profitLoss', 0] } },
          totalLoss: { $sum: { $cond: [{ $lt: ['$profitLoss', 0] }, '$profitLoss', 0] } },
          netProfit: { $sum: '$profitLoss' },
          winningTrades: { $sum: { $cond: [{ $gt: ['$profitLoss', 0] }, 1, 0] } },
          losingTrades: { $sum: { $cond: [{ $lt: ['$profitLoss', 0] }, 1, 0] } },
          bestTrade: { $max: '$profitLoss' },
          worstTrade: { $min: '$profitLoss' },
          averageProfit: { $avg: { $cond: [{ $gt: ['$profitLoss', 0] }, '$profitLoss', null] } },
          averageLoss: { $avg: { $cond: [{ $lt: ['$profitLoss', 0] }, '$profitLoss', null] } }
        }
      }
    ]);

    const result = stats[0] || {
      totalTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      winningTrades: 0,
      losingTrades: 0,
      bestTrade: 0,
      worstTrade: 0,
      averageProfit: 0,
      averageLoss: 0
    };

    result.winRate = result.totalTrades > 0 ? (result.winningTrades / result.totalTrades) * 100 : 0;
    result.profitFactor = result.totalLoss !== 0 ? Math.abs(result.totalProfit / result.totalLoss) : 0;

    res.status(200).json({
      success: true,
      data: {
        period,
        stats: result
      }
    });

  } catch (error) {
    logError(error, 'TRADING_GET_STATS');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trading statistics'
    });
  }
});

export default router; 