// P.H.A.N.T.O.M Trading Platform Trade Model
// Comprehensive trade tracking for maximum profit generation

import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  // Basic Trade Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  symbolName: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: true,
    enum: ['NSE', 'BSE', 'NSE_FO', 'BSE_FO', 'MCX', 'NCDEX', 'US_STOCKS', 'FOREX', 'CRYPTO']
  },
  market: {
    type: String,
    required: true,
    enum: ['indian_stocks', 'us_stocks', 'forex', 'crypto', 'commodities', 'options', 'futures']
  },

  // Trade Details
  tradeType: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL', 'SHORT', 'COVER']
  },
  orderType: {
    type: String,
    required: true,
    enum: ['MARKET', 'LIMIT', 'STOP_LOSS', 'STOP_LIMIT', 'TRAILING_STOP', 'BRACKET', 'OCO']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },

  // Order Status
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED'],
    default: 'PENDING'
  },
  filledQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Filled quantity cannot be negative']
  },
  averagePrice: {
    type: Number,
    default: 0
  },

  // Profit/Loss Tracking
  profitLoss: {
    type: Number,
    default: 0
  },
  profitLossPercentage: {
    type: Number,
    default: 0
  },
  isWin: {
    type: Boolean,
    default: null
  },
  exitPrice: {
    type: Number,
    default: null
  },
  exitTime: {
    type: Date,
    default: null
  },

  // Timing
  entryTime: {
    type: Date,
    default: Date.now
  },
  exitTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },

  // Risk Management
  stopLoss: {
    type: Number,
    default: null
  },
  takeProfit: {
    type: Number,
    default: null
  },
  trailingStop: {
    type: Number,
    default: null
  },
  riskAmount: {
    type: Number,
    default: 0
  },
  riskPercentage: {
    type: Number,
    default: 0
  },

  // Broker Information
  broker: {
    type: String,
    enum: ['zerodha', 'paytm_money', 'angel_one', 'upstox', 'icici_direct', 'hdfc_sec', 'paper_trading'],
    default: 'paper_trading'
  },
  brokerOrderId: {
    type: String,
    default: null
  },
  brokerTradeId: {
    type: String,
    default: null
  },

  // AI and Strategy
  aiPrediction: {
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    direction: {
      type: String,
      enum: ['BULLISH', 'BEARISH', 'NEUTRAL'],
      default: 'NEUTRAL'
    },
    targetPrice: {
      type: Number,
      default: null
    },
    stopLossPrice: {
      type: Number,
      default: null
    }
  },
  strategy: {
    name: {
      type: String,
      default: 'MANUAL'
    },
    type: {
      type: String,
      enum: ['MANUAL', 'AI_DRIVEN', 'TECHNICAL', 'FUNDAMENTAL', 'MOMENTUM', 'MEAN_REVERSION', 'ARBITRAGE'],
      default: 'MANUAL'
    },
    parameters: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },

  // Technical Indicators
  technicalIndicators: {
    rsi: {
      type: Number,
      default: null
    },
    macd: {
      type: Number,
      default: null
    },
    sma20: {
      type: Number,
      default: null
    },
    sma50: {
      type: Number,
      default: null
    },
    ema12: {
      type: Number,
      default: null
    },
    ema26: {
      type: Number,
      default: null
    },
    bollingerUpper: {
      type: Number,
      default: null
    },
    bollingerLower: {
      type: Number,
      default: null
    },
    volume: {
      type: Number,
      default: null
    },
    volumeSMA: {
      type: Number,
      default: null
    }
  },

  // Market Conditions
  marketConditions: {
    volatility: {
      type: Number,
      default: 0
    },
    trend: {
      type: String,
      enum: ['BULLISH', 'BEARISH', 'SIDEWAYS'],
      default: 'SIDEWAYS'
    },
    volume: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    marketSentiment: {
      type: String,
      enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
      default: 'NEUTRAL'
    }
  },

  // Social Trading
  socialTrading: {
    isPublic: {
      type: Boolean,
      default: false
    },
    copiedBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      copiedAt: {
        type: Date,
        default: Date.now
      }
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comment: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Notes and Tags
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],

  // Fees and Charges
  fees: {
    brokerage: {
      type: Number,
      default: 0
    },
    stt: {
      type: Number,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    sebi: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },

  // Performance Metrics
  performance: {
    sharpeRatio: {
      type: Number,
      default: 0
    },
    maxDrawdown: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    },
    profitFactor: {
      type: Number,
      default: 0
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for trade duration
tradeSchema.virtual('tradeDuration').get(function() {
  if (!this.exitTime) return null;
  return Math.round((this.exitTime - this.entryTime) / (1000 * 60)); // minutes
});

// Virtual for net profit/loss after fees
tradeSchema.virtual('netProfitLoss').get(function() {
  return this.profitLoss - this.fees.total;
});

// Virtual for ROI
tradeSchema.virtual('roi').get(function() {
  if (this.totalAmount === 0) return 0;
  return (this.profitLoss / this.totalAmount) * 100;
});

// Virtual for net ROI
tradeSchema.virtual('netRoi').get(function() {
  if (this.totalAmount === 0) return 0;
  return (this.netProfitLoss / this.totalAmount) * 100;
});

// Indexes for performance
tradeSchema.index({ userId: 1, entryTime: -1 });
tradeSchema.index({ symbol: 1, entryTime: -1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ profitLoss: -1 });
tradeSchema.index({ 'aiPrediction.confidence': -1 });
tradeSchema.index({ 'strategy.type': 1 });

// Pre-save middleware to calculate fees
tradeSchema.pre('save', function(next) {
  if (this.isModified('totalAmount')) {
    // Calculate fees based on broker and amount
    const amount = this.totalAmount;
    let brokerage = 0;
    
    switch (this.broker) {
      case 'zerodha':
        brokerage = Math.min(20, amount * 0.0003); // Rs 20 or 0.03%
        break;
      case 'paytm_money':
        brokerage = Math.min(15, amount * 0.0002); // Rs 15 or 0.02%
        break;
      case 'angel_one':
        brokerage = Math.min(25, amount * 0.0004); // Rs 25 or 0.04%
        break;
      default:
        brokerage = 0; // Paper trading
    }
    
    const stt = amount * 0.0005; // 0.05% STT
    const gst = brokerage * 0.18; // 18% GST on brokerage
    const sebi = amount * 0.000001; // SEBI charges
    
    this.fees = {
      brokerage,
      stt,
      gst,
      sebi,
      total: brokerage + stt + gst + sebi
    };
  }
  
  if (this.isModified('exitTime') && this.exitTime) {
    this.duration = Math.round((this.exitTime - this.entryTime) / (1000 * 60));
  }
  
  next();
});

// Method to calculate profit/loss
tradeSchema.methods.calculateProfitLoss = function(currentPrice) {
  if (this.status !== 'COMPLETED') return 0;
  
  let profitLoss = 0;
  
  if (this.tradeType === 'BUY') {
    profitLoss = (currentPrice - this.averagePrice) * this.filledQuantity;
  } else if (this.tradeType === 'SELL') {
    profitLoss = (this.averagePrice - currentPrice) * this.filledQuantity;
  }
  
  this.profitLoss = profitLoss;
  this.profitLossPercentage = (profitLoss / this.totalAmount) * 100;
  this.isWin = profitLoss > 0;
  
  return profitLoss;
};

// Method to close trade
tradeSchema.methods.closeTrade = function(exitPrice, exitTime = new Date()) {
  this.exitPrice = exitPrice;
  this.exitTime = exitTime;
  this.status = 'COMPLETED';
  
  // Calculate profit/loss
  let profitLoss = 0;
  
  if (this.tradeType === 'BUY') {
    profitLoss = (exitPrice - this.averagePrice) * this.filledQuantity;
  } else if (this.tradeType === 'SELL') {
    profitLoss = (this.averagePrice - exitPrice) * this.filledQuantity;
  }
  
  this.profitLoss = profitLoss;
  this.profitLossPercentage = (profitLoss / this.totalAmount) * 100;
  this.isWin = profitLoss > 0;
  this.duration = Math.round((exitTime - this.entryTime) / (1000 * 60));
  
  return this.save();
};

// Static method to get user's trading statistics
tradeSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'COMPLETED' } },
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
  
  if (stats.length === 0) {
    return {
      totalTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      netProfit: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      bestTrade: 0,
      worstTrade: 0,
      averageProfit: 0,
      averageLoss: 0,
      profitFactor: 0
    };
  }
  
  const stat = stats[0];
  return {
    ...stat,
    winRate: (stat.winningTrades / stat.totalTrades) * 100,
    profitFactor: Math.abs(stat.totalProfit / stat.totalLoss) || 0
  };
};

export default mongoose.model('Trade', tradeSchema); 