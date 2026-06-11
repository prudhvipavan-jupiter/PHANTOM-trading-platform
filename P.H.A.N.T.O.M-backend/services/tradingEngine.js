// P.H.A.N.T.O.M Trading Engine Service
// Handles order execution, trade management, and portfolio operations

import { logger } from '../utils/logger.js';
import Trade from '../models/Trade.js';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';

class TradingEngine {
  constructor() {
    this.isRunning = false;
    this.activeOrders = new Map();
    this.portfolioCache = new Map();
  }

  // Initialize the trading engine
  async initialize() {
    try {
      logger.info('🚀 Initializing Trading Engine...');
      
      // Load active orders from database
      await this.loadActiveOrders();
      
      // Initialize portfolio cache
      await this.initializePortfolioCache();
      
      this.isRunning = true;
      logger.info('✅ Trading Engine initialized successfully');
      
      return true;
    } catch (error) {
      logger.error('❌ Failed to initialize Trading Engine:', error);
      throw error;
    }
  }

  // Load active orders from database
  async loadActiveOrders() {
    try {
      const activeOrders = await Trade.find({ status: { $in: ['pending', 'partial'] } });
      
      activeOrders.forEach(order => {
        this.activeOrders.set(order._id.toString(), order);
      });
      
      logger.info(`📊 Loaded ${activeOrders.length} active orders`);
    } catch (error) {
      logger.error('❌ Failed to load active orders:', error);
    }
  }

  // Initialize portfolio cache
  async initializePortfolioCache() {
    try {
      const portfolios = await Portfolio.find().populate('userId');
      
      portfolios.forEach(portfolio => {
        this.portfolioCache.set(portfolio.userId._id.toString(), portfolio);
      });
      
      logger.info(`💼 Loaded ${portfolios.length} portfolios into cache`);
    } catch (error) {
      logger.error('❌ Failed to initialize portfolio cache:', error);
    }
  }

  // Place a new order
  async placeOrder(orderData) {
    try {
      const {
        userId,
        symbol,
        type,
        side,
        quantity,
        price,
        orderType = 'market',
        stopLoss,
        takeProfit
      } = orderData;

      // Validate order data
      if (!userId || !symbol || !type || !side || !quantity) {
        throw new Error('Missing required order parameters');
      }

      // Check user balance
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const orderValue = quantity * price;
      if (side === 'buy' && user.balance < orderValue) {
        throw new Error('Insufficient balance');
      }

      // Create order
      const order = new Trade({
        userId,
        symbol,
        type,
        side,
        quantity,
        price,
        orderType,
        stopLoss,
        takeProfit,
        status: 'pending',
        timestamp: new Date()
      });

      await order.save();

      // Add to active orders
      this.activeOrders.set(order._id.toString(), order);

      logger.info(`📈 Order placed: ${symbol} ${side} ${quantity} @ ${price}`);

      return {
        success: true,
        orderId: order._id,
        message: 'Order placed successfully'
      };

    } catch (error) {
      logger.error('❌ Failed to place order:', error);
      throw error;
    }
  }

  // Execute order
  async executeOrder(orderId) {
    try {
      const order = this.activeOrders.get(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Simulate order execution
      const executionPrice = order.price;
      const executionTime = new Date();

      // Update order status
      order.status = 'filled';
      order.executedPrice = executionPrice;
      order.executionTime = executionTime;
      order.filledQuantity = order.quantity;

      await order.save();

      // Remove from active orders
      this.activeOrders.delete(orderId);

      // Update portfolio
      await this.updatePortfolio(order);

      logger.info(`✅ Order executed: ${order.symbol} ${order.side} ${order.quantity} @ ${executionPrice}`);

      return {
        success: true,
        orderId: order._id,
        executionPrice,
        executionTime
      };

    } catch (error) {
      logger.error('❌ Failed to execute order:', error);
      throw error;
    }
  }

  // Update portfolio after trade
  async updatePortfolio(trade) {
    try {
      let portfolio = this.portfolioCache.get(trade.userId.toString());
      
      if (!portfolio) {
        portfolio = new Portfolio({
          userId: trade.userId,
          totalValue: 0,
          cash: 0,
          positions: []
        });
      }

      // Update cash balance
      if (trade.side === 'buy') {
        portfolio.cash -= trade.quantity * trade.executedPrice;
      } else {
        portfolio.cash += trade.quantity * trade.executedPrice;
      }

      // Update positions
      const existingPosition = portfolio.positions.find(p => p.symbol === trade.symbol);
      
      if (existingPosition) {
        if (trade.side === 'buy') {
          existingPosition.quantity += trade.quantity;
          existingPosition.avgPrice = ((existingPosition.avgPrice * (existingPosition.quantity - trade.quantity)) + 
                                     (trade.executedPrice * trade.quantity)) / existingPosition.quantity;
        } else {
          existingPosition.quantity -= trade.quantity;
          if (existingPosition.quantity <= 0) {
            portfolio.positions = portfolio.positions.filter(p => p.symbol !== trade.symbol);
          }
        }
      } else if (trade.side === 'buy') {
        portfolio.positions.push({
          symbol: trade.symbol,
          quantity: trade.quantity,
          avgPrice: trade.executedPrice
        });
      }

      // Calculate total portfolio value
      portfolio.totalValue = portfolio.cash;
      portfolio.positions.forEach(position => {
        // In a real implementation, you'd get current market price
        portfolio.totalValue += position.quantity * position.avgPrice;
      });

      await portfolio.save();
      this.portfolioCache.set(trade.userId.toString(), portfolio);

      logger.info(`💼 Portfolio updated for user ${trade.userId}`);

    } catch (error) {
      logger.error('❌ Failed to update portfolio:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const order = this.activeOrders.get(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      order.status = 'cancelled';
      order.cancelledAt = new Date();
      await order.save();

      this.activeOrders.delete(orderId);

      logger.info(`❌ Order cancelled: ${order.symbol} ${order.side} ${order.quantity}`);

      return {
        success: true,
        orderId: order._id,
        message: 'Order cancelled successfully'
      };

    } catch (error) {
      logger.error('❌ Failed to cancel order:', error);
      throw error;
    }
  }

  // Get active orders
  async getActiveOrders(userId = null) {
    try {
      if (userId) {
        return Array.from(this.activeOrders.values()).filter(order => order.userId.toString() === userId);
      }
      return Array.from(this.activeOrders.values());
    } catch (error) {
      logger.error('❌ Failed to get active orders:', error);
      throw error;
    }
  }

  // Get portfolio
  async getPortfolio(userId) {
    try {
      let portfolio = this.portfolioCache.get(userId);
      
      if (!portfolio) {
        portfolio = await Portfolio.findOne({ userId }).populate('userId');
        if (portfolio) {
          this.portfolioCache.set(userId, portfolio);
        }
      }

      return portfolio;
    } catch (error) {
      logger.error('❌ Failed to get portfolio:', error);
      throw error;
    }
  }

  // Stop the trading engine
  async stop() {
    try {
      this.isRunning = false;
      this.activeOrders.clear();
      this.portfolioCache.clear();
      logger.info('🛑 Trading Engine stopped');
    } catch (error) {
      logger.error('❌ Failed to stop Trading Engine:', error);
    }
  }
}

// Create singleton instance
const tradingEngine = new TradingEngine();

// Export initialization function
export const initializeTradingEngine = async () => {
  return await tradingEngine.initialize();
};

// Export the trading engine instance
export default tradingEngine; 