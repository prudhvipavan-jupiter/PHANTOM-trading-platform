// P.H.A.N.T.O.M Advanced Trading Service
// World-class trading engine for profit generation

import { logger } from '../utils/logger.js';
import advancedAIService from './advancedAIService.js';

class AdvancedTradingService {
  constructor() {
    this.activeOrders = new Map();
    this.positions = new Map();
    this.copiedTraders = new Map();
    this.riskLimits = new Map();
    this.tradingHistory = [];
    this.isInitialized = false;
  }

  async initialize() {
    try {
      logger.info('🚀 Initializing Advanced Trading Service...');
      
      // Initialize AI service
      await advancedAIService.initialize();
      
      // Load risk management rules
      this.initializeRiskManagement();
      
      // Initialize copy trading system
      this.initializeCopyTrading();
      
      this.isInitialized = true;
      logger.info('✅ Advanced Trading Service initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize Advanced Trading Service:', error);
      throw error;
    }
  }

  initializeRiskManagement() {
    // Default risk management rules
    const defaultRiskRules = {
      maxPositionSize: 0.1, // 10% of portfolio
      maxDailyLoss: 0.05, // 5% daily loss limit
      maxDrawdown: 0.15, // 15% max drawdown
      stopLossPercent: 0.02, // 2% stop loss
      takeProfitPercent: 0.04, // 4% take profit
      maxOpenPositions: 10,
      minConfidence: 70, // Minimum AI confidence for trades
      leverageLimit: 2.0 // Maximum leverage
    };

    this.riskLimits.set('default', defaultRiskRules);
    logger.info('✅ Risk management rules initialized');
  }

  initializeCopyTrading() {
    // Initialize copy trading system
    this.copiedTraders = new Map();
    logger.info('✅ Copy trading system initialized');
  }

  async placeAdvancedOrder(orderData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const {
        userId,
        symbol,
        orderType,
        quantity,
        price,
        stopLoss,
        takeProfit,
        strategy,
        aiConfidence,
        copyTraderId
      } = orderData;

      // Validate order
      const validation = await this.validateOrder(orderData);
      if (!validation.isValid) {
        throw new Error(`Order validation failed: ${validation.reason}`);
      }

      // Apply risk management
      const riskCheck = await this.applyRiskManagement(userId, orderData);
      if (!riskCheck.allowed) {
        throw new Error(`Risk management blocked order: ${riskCheck.reason}`);
      }

      // Generate order ID
      const orderId = this.generateOrderId();

      // Create order object
      const order = {
        orderId,
        userId,
        symbol: symbol.toUpperCase(),
        orderType: orderType.toUpperCase(),
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        strategy: strategy || 'MANUAL',
        aiConfidence: aiConfidence || 0,
        copyTraderId: copyTraderId || null,
        status: 'PENDING',
        timestamp: new Date(),
        executionPrice: null,
        executionTime: null,
        fees: 0,
        pnl: 0
      };

      // Store order
      this.activeOrders.set(orderId, order);

      // Execute order based on type
      const executionResult = await this.executeOrder(order);

      // Update order status
      order.status = executionResult.status;
      order.executionPrice = executionResult.executionPrice;
      order.executionTime = executionResult.executionTime;
      order.fees = executionResult.fees;

      // Create position if order executed
      if (executionResult.status === 'EXECUTED') {
        await this.createPosition(order, executionResult);
      }

      // Log trading activity
      this.logTradingActivity(order, executionResult);

      logger.info(`🎯 Advanced order placed: ${orderId} for ${symbol} (${orderType})`);
      
      return {
        success: true,
        orderId,
        order,
        executionResult
      };
    } catch (error) {
      logger.error('❌ Error placing advanced order:', error);
      throw error;
    }
  }

  async validateOrder(orderData) {
    const { symbol, quantity, price, orderType } = orderData;

    // Basic validation
    if (!symbol || !quantity || !price) {
      return { isValid: false, reason: 'Missing required fields' };
    }

    if (quantity <= 0 || price <= 0) {
      return { isValid: false, reason: 'Invalid quantity or price' };
    }

    if (!['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'].includes(orderType.toUpperCase())) {
      return { isValid: false, reason: 'Invalid order type' };
    }

    // Symbol validation (mock)
    const validSymbols = ['RELIANCE', 'TCS', 'HDFC', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'AXISBANK'];
    if (!validSymbols.includes(symbol.toUpperCase())) {
      return { isValid: false, reason: 'Invalid symbol' };
    }

    return { isValid: true };
  }

  async applyRiskManagement(userId, orderData) {
    const riskRules = this.riskLimits.get('default');
    const { quantity, price, aiConfidence } = orderData;

    // Check AI confidence
    if (aiConfidence && aiConfidence < riskRules.minConfidence) {
      return { allowed: false, reason: 'AI confidence too low' };
    }

    // Check position size
    const orderValue = quantity * price;
    const userPortfolio = await this.getUserPortfolio(userId);
    const portfolioValue = userPortfolio.totalValue || 1000000; // Default 10L

    if (orderValue > portfolioValue * riskRules.maxPositionSize) {
      return { allowed: false, reason: 'Position size exceeds limit' };
    }

    // Check daily loss limit
    const dailyPnL = await this.getDailyPnL(userId);
    if (dailyPnL < -(portfolioValue * riskRules.maxDailyLoss)) {
      return { allowed: false, reason: 'Daily loss limit reached' };
    }

    // Check open positions
    const openPositions = await this.getOpenPositions(userId);
    if (openPositions.length >= riskRules.maxOpenPositions) {
      return { allowed: false, reason: 'Maximum open positions reached' };
    }

    return { allowed: true };
  }

  async executeOrder(order) {
    try {
      const { orderType, price, quantity } = order;

      // Mock execution logic
      let executionPrice = price;
      let executionTime = new Date();
      let fees = 0;

      switch (orderType.toUpperCase()) {
        case 'MARKET':
          // Market orders execute immediately at current market price
          executionPrice = this.getCurrentMarketPrice(order.symbol);
          fees = executionPrice * quantity * 0.0005; // 0.05% brokerage
          break;

        case 'LIMIT':
          // Limit orders execute if market price reaches limit price
          const currentPrice = this.getCurrentMarketPrice(order.symbol);
          if (executionPrice <= currentPrice) {
            fees = executionPrice * quantity * 0.0005;
          } else {
            return { status: 'PENDING', executionPrice: null, executionTime: null, fees: 0 };
          }
          break;

        case 'STOP':
          // Stop orders become market orders when triggered
          const triggerPrice = this.getCurrentMarketPrice(order.symbol);
          if (triggerPrice >= price) {
            executionPrice = triggerPrice;
            fees = executionPrice * quantity * 0.0005;
          } else {
            return { status: 'PENDING', executionPrice: null, executionTime: null, fees: 0 };
          }
          break;

        default:
          throw new Error(`Unsupported order type: ${orderType}`);
      }

      return {
        status: 'EXECUTED',
        executionPrice,
        executionTime,
        fees
      };
    } catch (error) {
      logger.error('❌ Error executing order:', error);
      return {
        status: 'FAILED',
        executionPrice: null,
        executionTime: null,
        fees: 0,
        error: error.message
      };
    }
  }

  async createPosition(order, executionResult) {
    const positionId = this.generatePositionId();
    
    const position = {
      positionId,
      userId: order.userId,
      symbol: order.symbol,
      quantity: order.quantity,
      entryPrice: executionResult.executionPrice,
      currentPrice: executionResult.executionPrice,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      entryTime: executionResult.executionTime,
      status: 'OPEN',
      pnl: 0,
      pnlPercent: 0,
      fees: executionResult.fees,
      strategy: order.strategy,
      aiConfidence: order.aiConfidence,
      copyTraderId: order.copyTraderId
    };

    this.positions.set(positionId, position);
    
    logger.info(`📈 Position created: ${positionId} for ${order.symbol}`);
    
    return position;
  }

  async updatePositions() {
    try {
      for (const [positionId, position] of this.positions) {
        if (position.status === 'OPEN') {
          // Update current price
          position.currentPrice = this.getCurrentMarketPrice(position.symbol);
          
          // Calculate P&L
          const priceChange = position.currentPrice - position.entryPrice;
          position.pnl = priceChange * position.quantity;
          position.pnlPercent = (priceChange / position.entryPrice) * 100;

          // Check stop loss and take profit
          if (position.stopLoss && position.currentPrice <= position.stopLoss) {
            await this.closePosition(positionId, 'STOP_LOSS');
          } else if (position.takeProfit && position.currentPrice >= position.takeProfit) {
            await this.closePosition(positionId, 'TAKE_PROFIT');
          }
        }
      }
    } catch (error) {
      logger.error('❌ Error updating positions:', error);
    }
  }

  async closePosition(positionId, reason = 'MANUAL') {
    try {
      const position = this.positions.get(positionId);
      if (!position || position.status !== 'OPEN') {
        throw new Error('Position not found or already closed');
      }

      // Calculate final P&L
      const exitPrice = this.getCurrentMarketPrice(position.symbol);
      const priceChange = exitPrice - position.entryPrice;
      const finalPnL = priceChange * position.quantity;
      const exitFees = exitPrice * position.quantity * 0.0005;

      // Update position
      position.status = 'CLOSED';
      position.exitPrice = exitPrice;
      position.exitTime = new Date();
      position.pnl = finalPnL;
      position.pnlPercent = (priceChange / position.entryPrice) * 100;
      position.totalFees = position.fees + exitFees;
      position.closeReason = reason;

      // Log trading activity
      this.logTradingActivity({
        orderId: `CLOSE_${positionId}`,
        userId: position.userId,
        symbol: position.symbol,
        orderType: 'CLOSE',
        quantity: position.quantity,
        price: exitPrice,
        strategy: position.strategy,
        aiConfidence: position.aiConfidence
      }, {
        status: 'EXECUTED',
        executionPrice: exitPrice,
        executionTime: new Date(),
        fees: exitFees
      });

      logger.info(`📉 Position closed: ${positionId} for ${position.symbol} (${reason})`);
      
      return position;
    } catch (error) {
      logger.error('❌ Error closing position:', error);
      throw error;
    }
  }

  async setupCopyTrading(userId, traderId, allocation) {
    try {
      const copyTradingConfig = {
        userId,
        traderId,
        allocation: Math.min(allocation, 0.5), // Max 50% allocation
        startDate: new Date(),
        status: 'ACTIVE',
        totalCopied: 0,
        totalPnL: 0
      };

      this.copiedTraders.set(`${userId}_${traderId}`, copyTradingConfig);
      
      logger.info(`👥 Copy trading setup: User ${userId} copying Trader ${traderId}`);
      
      return copyTradingConfig;
    } catch (error) {
      logger.error('❌ Error setting up copy trading:', error);
      throw error;
    }
  }

  async executeCopyTrades() {
    try {
      for (const [key, config] of this.copiedTraders) {
        if (config.status === 'ACTIVE') {
          // Get trader's recent trades
          const traderTrades = await this.getTraderTrades(config.traderId);
          
          // Execute copy trades
          for (const trade of traderTrades) {
            if (trade.timestamp > config.lastCopiedTrade) {
              await this.executeCopyTrade(config, trade);
              config.lastCopiedTrade = trade.timestamp;
            }
          }
        }
      }
    } catch (error) {
      logger.error('❌ Error executing copy trades:', error);
    }
  }

  async executeCopyTrade(config, originalTrade) {
    try {
      const copyOrderData = {
        userId: config.userId,
        symbol: originalTrade.symbol,
        orderType: originalTrade.orderType,
        quantity: originalTrade.quantity * config.allocation,
        price: originalTrade.price,
        stopLoss: originalTrade.stopLoss,
        takeProfit: originalTrade.takeProfit,
        strategy: 'COPY_TRADING',
        copyTraderId: config.traderId
      };

      const result = await this.placeAdvancedOrder(copyOrderData);
      
      if (result.success) {
        config.totalCopied++;
        logger.info(`📋 Copy trade executed: ${config.userId} copied ${config.traderId}`);
      }
    } catch (error) {
      logger.error('❌ Error executing copy trade:', error);
    }
  }

  async getAdvancedAnalytics(userId, timeframe = '1M') {
    try {
      const positions = Array.from(this.positions.values()).filter(p => p.userId === userId);
      const orders = Array.from(this.activeOrders.values()).filter(o => o.userId === userId);
      
      // Calculate performance metrics
      const totalTrades = positions.length;
      const winningTrades = positions.filter(p => p.pnl > 0).length;
      const losingTrades = positions.filter(p => p.pnl < 0).length;
      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
      
      const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
      const totalFees = positions.reduce((sum, p) => sum + (p.totalFees || 0), 0);
      const netPnL = totalPnL - totalFees;
      
      const maxDrawdown = this.calculateMaxDrawdown(positions);
      const sharpeRatio = this.calculateSharpeRatio(positions);
      const profitFactor = this.calculateProfitFactor(positions);
      
      // AI performance metrics
      const aiTrades = positions.filter(p => p.aiConfidence > 0);
      const aiWinRate = aiTrades.length > 0 ? 
        (aiTrades.filter(p => p.pnl > 0).length / aiTrades.length) * 100 : 0;
      
      return {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        totalPnL,
        netPnL,
        totalFees,
        maxDrawdown,
        sharpeRatio,
        profitFactor,
        aiTrades: aiTrades.length,
        aiWinRate,
        averageConfidence: aiTrades.length > 0 ? 
          aiTrades.reduce((sum, p) => sum + p.aiConfidence, 0) / aiTrades.length : 0
      };
    } catch (error) {
      logger.error('❌ Error getting advanced analytics:', error);
      throw error;
    }
  }

  calculateMaxDrawdown(positions) {
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;

    for (const position of positions) {
      runningPnL += position.pnl;
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  calculateSharpeRatio(positions) {
    if (positions.length < 2) return 0;
    
    const returns = positions.map(p => p.pnlPercent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  calculateProfitFactor(positions) {
    const grossProfit = positions.filter(p => p.pnl > 0).reduce((sum, p) => sum + p.pnl, 0);
    const grossLoss = Math.abs(positions.filter(p => p.pnl < 0).reduce((sum, p) => sum + p.pnl, 0));
    
    return grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
  }

  // Helper methods
  generateOrderId() {
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generatePositionId() {
    return `POS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCurrentMarketPrice(symbol) {
    // Mock market price - replace with real market data
    const basePrice = 500;
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    return basePrice * (1 + change);
  }

  async getUserPortfolio(userId) {
    // Mock portfolio - replace with real data
    return {
      totalValue: 1000000,
      cash: 500000,
      invested: 500000,
      pnl: 50000
    };
  }

  async getDailyPnL(userId) {
    // Mock daily P&L - replace with real data
    return Math.random() * 10000 - 5000;
  }

  async getOpenPositions(userId) {
    return Array.from(this.positions.values()).filter(p => p.userId === userId && p.status === 'OPEN');
  }

  async getTraderTrades(traderId) {
    // Mock trader trades - replace with real data
    return [];
  }

  logTradingActivity(order, executionResult) {
    const activity = {
      timestamp: new Date(),
      userId: order.userId,
      symbol: order.symbol,
      action: order.orderType,
      quantity: order.quantity,
      price: executionResult.executionPrice,
      fees: executionResult.fees,
      strategy: order.strategy,
      aiConfidence: order.aiConfidence
    };

    this.tradingHistory.push(activity);
  }

  getTradingHistory(userId, limit = 100) {
    return this.tradingHistory
      .filter(activity => activity.userId === userId)
      .slice(-limit);
  }
}

// Create singleton instance
const advancedTradingService = new AdvancedTradingService();

export default advancedTradingService; 