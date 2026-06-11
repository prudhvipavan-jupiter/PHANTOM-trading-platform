// P.H.A.N.T.O.M Trading Platform Portfolio Model
// Comprehensive portfolio management for maximum profit generation

import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  // Basic Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    default: 'Main Portfolio'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Portfolio Holdings
  holdings: [{
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
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative']
    },
    averagePrice: {
      type: Number,
      required: true,
      min: [0, 'Average price cannot be negative']
    },
    currentPrice: {
      type: Number,
      default: 0
    },
    marketValue: {
      type: Number,
      default: 0
    },
    investedAmount: {
      type: Number,
      required: true,
      min: [0, 'Invested amount cannot be negative']
    },
    profitLoss: {
      type: Number,
      default: 0
    },
    profitLossPercentage: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    sector: {
      type: String,
      default: 'Unknown'
    },
    industry: {
      type: String,
      default: 'Unknown'
    },
    weight: {
      type: Number,
      default: 0
    }
  }],

  // Portfolio Summary
  summary: {
    totalInvested: {
      type: Number,
      default: 0,
      min: [0, 'Total invested cannot be negative']
    },
    totalMarketValue: {
      type: Number,
      default: 0,
      min: [0, 'Total market value cannot be negative']
    },
    totalProfitLoss: {
      type: Number,
      default: 0
    },
    totalProfitLossPercentage: {
      type: Number,
      default: 0
    },
    totalUnrealizedProfitLoss: {
      type: Number,
      default: 0
    },
    totalRealizedProfitLoss: {
      type: Number,
      default: 0
    },
    numberOfHoldings: {
      type: Number,
      default: 0
    },
    numberOfWinningPositions: {
      type: Number,
      default: 0
    },
    numberOfLosingPositions: {
      type: Number,
      default: 0
    }
  },

  // Performance Metrics
  performance: {
    // Risk Metrics
    volatility: {
      type: Number,
      default: 0
    },
    beta: {
      type: Number,
      default: 1
    },
    alpha: {
      type: Number,
      default: 0
    },
    sharpeRatio: {
      type: Number,
      default: 0
    },
    sortinoRatio: {
      type: Number,
      default: 0
    },
    maxDrawdown: {
      type: Number,
      default: 0
    },
    valueAtRisk: {
      type: Number,
      default: 0
    },

    // Return Metrics
    totalReturn: {
      type: Number,
      default: 0
    },
    annualizedReturn: {
      type: Number,
      default: 0
    },
    monthlyReturn: {
      type: Number,
      default: 0
    },
    weeklyReturn: {
      type: Number,
      default: 0
    },
    dailyReturn: {
      type: Number,
      default: 0
    },

    // Win/Loss Metrics
    winRate: {
      type: Number,
      default: 0
    },
    profitFactor: {
      type: Number,
      default: 0
    },
    averageWin: {
      type: Number,
      default: 0
    },
    averageLoss: {
      type: Number,
      default: 0
    },
    largestWin: {
      type: Number,
      default: 0
    },
    largestLoss: {
      type: Number,
      default: 0
    }
  },

  // Asset Allocation
  assetAllocation: {
    stocks: {
      type: Number,
      default: 0
    },
    bonds: {
      type: Number,
      default: 0
    },
    commodities: {
      type: Number,
      default: 0
    },
    forex: {
      type: Number,
      default: 0
    },
    crypto: {
      type: Number,
      default: 0
    },
    cash: {
      type: Number,
      default: 0
    }
  },

  // Sector Allocation
  sectorAllocation: {
    technology: {
      type: Number,
      default: 0
    },
    healthcare: {
      type: Number,
      default: 0
    },
    finance: {
      type: Number,
      default: 0
    },
    energy: {
      type: Number,
      default: 0
    },
    consumer: {
      type: Number,
      default: 0
    },
    industrial: {
      type: Number,
      default: 0
    },
    materials: {
      type: Number,
      default: 0
    },
    utilities: {
      type: Number,
      default: 0
    },
    realEstate: {
      type: Number,
      default: 0
    },
    communication: {
      type: Number,
      default: 0
    }
  },

  // Market Cap Allocation
  marketCapAllocation: {
    largeCap: {
      type: Number,
      default: 0
    },
    midCap: {
      type: Number,
      default: 0
    },
    smallCap: {
      type: Number,
      default: 0
    }
  },

  // Risk Profile
  riskProfile: {
    riskScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    riskLevel: {
      type: String,
      enum: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'],
      default: 'MODERATE'
    },
    targetReturn: {
      type: Number,
      default: 12 // 12% annual return
    },
    maxDrawdownLimit: {
      type: Number,
      default: 20 // 20% maximum drawdown
    }
  },

  // Portfolio Settings
  settings: {
    rebalancing: {
      enabled: {
        type: Boolean,
        default: false
      },
      frequency: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'],
        default: 'MONTHLY'
      },
      threshold: {
        type: Number,
        default: 5 // 5% deviation threshold
      }
    },
    stopLoss: {
      enabled: {
        type: Boolean,
        default: false
      },
      percentage: {
        type: Number,
        default: 10 // 10% stop loss
      }
    },
    takeProfit: {
      enabled: {
        type: Boolean,
        default: false
      },
      percentage: {
        type: Number,
        default: 20 // 20% take profit
      }
    },
    diversification: {
      maxSingleStockWeight: {
        type: Number,
        default: 20 // Maximum 20% in single stock
      },
      maxSectorWeight: {
        type: Number,
        default: 30 // Maximum 30% in single sector
      }
    }
  },

  // Historical Data
  historicalData: [{
    date: {
      type: Date,
      required: true
    },
    totalValue: {
      type: Number,
      required: true
    },
    totalInvested: {
      type: Number,
      required: true
    },
    totalProfitLoss: {
      type: Number,
      required: true
    },
    totalProfitLossPercentage: {
      type: Number,
      required: true
    },
    numberOfHoldings: {
      type: Number,
      required: true
    }
  }],

  // Alerts and Notifications
  alerts: [{
    type: {
      type: String,
      enum: ['PROFIT_TARGET', 'LOSS_LIMIT', 'REBALANCE', 'NEWS', 'TECHNICAL_SIGNAL'],
      required: true
    },
    symbol: String,
    condition: {
      type: String,
      enum: ['ABOVE', 'BELOW', 'CROSSES_ABOVE', 'CROSSES_BELOW'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    message: String,
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // AI Recommendations
  aiRecommendations: [{
    symbol: {
      type: String,
      required: true
    },
    action: {
      type: String,
      enum: ['BUY', 'SELL', 'HOLD', 'ADD', 'REDUCE'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    reason: String,
    targetPrice: Number,
    stopLoss: Number,
    timeHorizon: {
      type: String,
      enum: ['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM'],
      default: 'MEDIUM_TERM'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for portfolio value
portfolioSchema.virtual('portfolioValue').get(function() {
  return this.summary.totalMarketValue;
});

// Virtual for total return
portfolioSchema.virtual('totalReturn').get(function() {
  if (this.summary.totalInvested === 0) return 0;
  return ((this.summary.totalMarketValue - this.summary.totalInvested) / this.summary.totalInvested) * 100;
});

// Virtual for cash percentage
portfolioSchema.virtual('cashPercentage').get(function() {
  if (this.summary.totalMarketValue === 0) return 0;
  return (this.assetAllocation.cash / this.summary.totalMarketValue) * 100;
});

// Indexes for performance
portfolioSchema.index({ userId: 1 });
portfolioSchema.index({ 'summary.totalProfitLoss': -1 });
portfolioSchema.index({ 'performance.sharpeRatio': -1 });
portfolioSchema.index({ 'riskProfile.riskScore': 1 });

// Pre-save middleware to update summary
portfolioSchema.pre('save', function(next) {
  if (this.isModified('holdings')) {
    this.updateSummary();
  }
  next();
});

// Method to update portfolio summary
portfolioSchema.methods.updateSummary = function() {
  let totalInvested = 0;
  let totalMarketValue = 0;
  let totalProfitLoss = 0;
  let numberOfHoldings = this.holdings.length;
  let numberOfWinningPositions = 0;
  let numberOfLosingPositions = 0;

  // Calculate totals from holdings
  this.holdings.forEach(holding => {
    totalInvested += holding.investedAmount;
    totalMarketValue += holding.marketValue;
    totalProfitLoss += holding.profitLoss;

    if (holding.profitLoss > 0) {
      numberOfWinningPositions++;
    } else if (holding.profitLoss < 0) {
      numberOfLosingPositions++;
    }
  });

  // Update summary
  this.summary = {
    totalInvested,
    totalMarketValue,
    totalProfitLoss,
    totalProfitLossPercentage: totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0,
    totalUnrealizedProfitLoss: totalProfitLoss,
    totalRealizedProfitLoss: 0, // Will be updated from trade history
    numberOfHoldings,
    numberOfWinningPositions,
    numberOfLosingPositions
  };

  // Update asset allocation
  this.updateAssetAllocation();
  this.updateSectorAllocation();
  this.updateMarketCapAllocation();
};

// Method to update asset allocation
portfolioSchema.methods.updateAssetAllocation = function() {
  const totalValue = this.summary.totalMarketValue;
  if (totalValue === 0) return;

  let stocks = 0, bonds = 0, commodities = 0, forex = 0, crypto = 0, cash = this.assetAllocation.cash;

  this.holdings.forEach(holding => {
    switch (holding.market) {
      case 'indian_stocks':
      case 'us_stocks':
        stocks += holding.marketValue;
        break;
      case 'commodities':
        commodities += holding.marketValue;
        break;
      case 'forex':
        forex += holding.marketValue;
        break;
      case 'crypto':
        crypto += holding.marketValue;
        break;
    }
  });

  this.assetAllocation = {
    stocks: (stocks / totalValue) * 100,
    bonds: (bonds / totalValue) * 100,
    commodities: (commodities / totalValue) * 100,
    forex: (forex / totalValue) * 100,
    crypto: (crypto / totalValue) * 100,
    cash: (cash / totalValue) * 100
  };
};

// Method to update sector allocation
portfolioSchema.methods.updateSectorAllocation = function() {
  const totalValue = this.summary.totalMarketValue;
  if (totalValue === 0) return;

  const sectorTotals = {};

  this.holdings.forEach(holding => {
    const sector = holding.sector.toLowerCase();
    if (!sectorTotals[sector]) {
      sectorTotals[sector] = 0;
    }
    sectorTotals[sector] += holding.marketValue;
  });

  // Reset all sectors
  Object.keys(this.sectorAllocation).forEach(sector => {
    this.sectorAllocation[sector] = 0;
  });

  // Update with actual values
  Object.keys(sectorTotals).forEach(sector => {
    const percentage = (sectorTotals[sector] / totalValue) * 100;
    if (this.sectorAllocation.hasOwnProperty(sector)) {
      this.sectorAllocation[sector] = percentage;
    }
  });
};

// Method to update market cap allocation
portfolioSchema.methods.updateMarketCapAllocation = function() {
  const totalValue = this.summary.totalMarketValue;
  if (totalValue === 0) return;

  let largeCap = 0, midCap = 0, smallCap = 0;

  this.holdings.forEach(holding => {
    // This would need market cap data from external API
    // For now, using a simple heuristic based on price
    if (holding.currentPrice > 1000) {
      largeCap += holding.marketValue;
    } else if (holding.currentPrice > 100) {
      midCap += holding.marketValue;
    } else {
      smallCap += holding.marketValue;
    }
  });

  this.marketCapAllocation = {
    largeCap: (largeCap / totalValue) * 100,
    midCap: (midCap / totalValue) * 100,
    smallCap: (smallCap / totalValue) * 100
  };
};

// Method to add holding
portfolioSchema.methods.addHolding = function(holdingData) {
  const existingIndex = this.holdings.findIndex(h => h.symbol === holdingData.symbol);
  
  if (existingIndex >= 0) {
    // Update existing holding
    const existing = this.holdings[existingIndex];
    const totalQuantity = existing.quantity + holdingData.quantity;
    const totalInvested = existing.investedAmount + holdingData.investedAmount;
    const newAveragePrice = totalInvested / totalQuantity;

    this.holdings[existingIndex] = {
      ...existing,
      quantity: totalQuantity,
      averagePrice: newAveragePrice,
      investedAmount: totalInvested,
      lastUpdated: new Date()
    };
  } else {
    // Add new holding
    this.holdings.push({
      ...holdingData,
      lastUpdated: new Date()
    });
  }

  this.updateSummary();
  return this.save();
};

// Method to remove holding
portfolioSchema.methods.removeHolding = function(symbol, quantity) {
  const holdingIndex = this.holdings.findIndex(h => h.symbol === symbol);
  
  if (holdingIndex === -1) {
    throw new Error('Holding not found');
  }

  const holding = this.holdings[holdingIndex];
  
  if (quantity >= holding.quantity) {
    // Remove entire holding
    this.holdings.splice(holdingIndex, 1);
  } else {
    // Reduce quantity
    holding.quantity -= quantity;
    holding.investedAmount = holding.quantity * holding.averagePrice;
    holding.lastUpdated = new Date();
  }

  this.updateSummary();
  return this.save();
};

// Method to update holding prices
portfolioSchema.methods.updatePrices = function(priceData) {
  this.holdings.forEach(holding => {
    if (priceData[holding.symbol]) {
      holding.currentPrice = priceData[holding.symbol].price;
      holding.marketValue = holding.quantity * holding.currentPrice;
      holding.profitLoss = holding.marketValue - holding.investedAmount;
      holding.profitLossPercentage = holding.investedAmount > 0 ? 
        (holding.profitLoss / holding.investedAmount) * 100 : 0;
      holding.lastUpdated = new Date();
    }
  });

  this.updateSummary();
  return this.save();
};

// Static method to get portfolio performance
portfolioSchema.statics.getPerformance = async function(userId, period = '1Y') {
  const portfolio = await this.findOne({ userId });
  if (!portfolio) return null;

  // Calculate performance metrics based on historical data
  const historicalData = portfolio.historicalData;
  if (historicalData.length < 2) return null;

  const sortedData = historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
  const latest = sortedData[sortedData.length - 1];
  const earliest = sortedData[0];

  const totalReturn = ((latest.totalValue - earliest.totalValue) / earliest.totalValue) * 100;
  const daysDiff = (new Date(latest.date) - new Date(earliest.date)) / (1000 * 60 * 60 * 24);
  const annualizedReturn = Math.pow(1 + totalReturn / 100, 365 / daysDiff) - 1;

  return {
    totalReturn,
    annualizedReturn,
    volatility: portfolio.performance.volatility,
    sharpeRatio: portfolio.performance.sharpeRatio,
    maxDrawdown: portfolio.performance.maxDrawdown
  };
};

export default mongoose.model('Portfolio', portfolioSchema); 