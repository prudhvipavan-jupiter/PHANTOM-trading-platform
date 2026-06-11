// P.H.A.N.T.O.M Trading Platform Market Data Model
// Comprehensive market data storage for profit-generating insights

import mongoose from 'mongoose';

const marketDataSchema = new mongoose.Schema({
  // Basic Information
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  symbolName: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: true,
    enum: ['NSE', 'BSE', 'NSE_FO', 'BSE_FO', 'MCX', 'NCDEX', 'US_STOCKS', 'FOREX', 'CRYPTO'],
    index: true
  },
  market: {
    type: String,
    required: true,
    enum: ['indian_stocks', 'us_stocks', 'forex', 'crypto', 'commodities', 'options', 'futures'],
    index: true
  },

  // Current Market Data
  currentPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  previousClose: {
    type: Number,
    required: true,
    min: [0, 'Previous close cannot be negative']
  },
  open: {
    type: Number,
    required: true,
    min: [0, 'Open price cannot be negative']
  },
  high: {
    type: Number,
    required: true,
    min: [0, 'High price cannot be negative']
  },
  low: {
    type: Number,
    required: true,
    min: [0, 'Low price cannot be negative']
  },
  volume: {
    type: Number,
    required: true,
    min: [0, 'Volume cannot be negative']
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },

  // Fundamental Data
  fundamental: {
    marketCap: {
      type: Number,
      default: 0
    },
    pe: {
      type: Number,
      default: 0
    },
    pb: {
      type: Number,
      default: 0
    },
    dividendYield: {
      type: Number,
      default: 0
    },
    eps: {
      type: Number,
      default: 0
    },
    bookValue: {
      type: Number,
      default: 0
    },
    roe: {
      type: Number,
      default: 0
    },
    roa: {
      type: Number,
      default: 0
    },
    debtToEquity: {
      type: Number,
      default: 0
    },
    currentRatio: {
      type: Number,
      default: 0
    },
    quickRatio: {
      type: Number,
      default: 0
    },
    operatingMargin: {
      type: Number,
      default: 0
    },
    netMargin: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    netIncome: {
      type: Number,
      default: 0
    },
    totalAssets: {
      type: Number,
      default: 0
    },
    totalLiabilities: {
      type: Number,
      default: 0
    },
    cashFlow: {
      type: Number,
      default: 0
    }
  },

  // Technical Indicators
  technical: {
    rsi: {
      type: Number,
      default: null
    },
    macd: {
      type: Number,
      default: null
    },
    macdSignal: {
      type: Number,
      default: null
    },
    macdHistogram: {
      type: Number,
      default: null
    },
    sma5: {
      type: Number,
      default: null
    },
    sma10: {
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
    sma100: {
      type: Number,
      default: null
    },
    sma200: {
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
    bollingerMiddle: {
      type: Number,
      default: null
    },
    bollingerLower: {
      type: Number,
      default: null
    },
    stochasticK: {
      type: Number,
      default: null
    },
    stochasticD: {
      type: Number,
      default: null
    },
    williamsR: {
      type: Number,
      default: null
    },
    adx: {
      type: Number,
      default: null
    },
    cci: {
      type: Number,
      default: null
    },
    atr: {
      type: Number,
      default: null
    },
    vwap: {
      type: Number,
      default: null
    },
    pivotPoints: {
      pp: {
        type: Number,
        default: null
      },
      r1: {
        type: Number,
        default: null
      },
      r2: {
        type: Number,
        default: null
      },
      r3: {
        type: Number,
        default: null
      },
      s1: {
        type: Number,
        default: null
      },
      s2: {
        type: Number,
        default: null
      },
      s3: {
        type: Number,
        default: null
      }
    }
  },

  // Market Depth (Level 2 Data)
  marketDepth: {
    bids: [{
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      orders: {
        type: Number,
        default: 0
      }
    }],
    asks: [{
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      orders: {
        type: Number,
        default: 0
      }
    }]
  },

  // Options Chain (for options trading)
  optionsChain: {
    expiryDates: [{
      type: Date
    }],
    strikes: [{
      type: Number
    }],
    calls: [{
      strike: {
        type: Number,
        required: true
      },
      expiry: {
        type: Date,
        required: true
      },
      lastPrice: {
        type: Number,
        default: 0
      },
      bid: {
        type: Number,
        default: 0
      },
      ask: {
        type: Number,
        default: 0
      },
      volume: {
        type: Number,
        default: 0
      },
      openInterest: {
        type: Number,
        default: 0
      },
      impliedVolatility: {
        type: Number,
        default: 0
      },
      delta: {
        type: Number,
        default: 0
      },
      gamma: {
        type: Number,
        default: 0
      },
      theta: {
        type: Number,
        default: 0
      },
      vega: {
        type: Number,
        default: 0
      }
    }],
    puts: [{
      strike: {
        type: Number,
        required: true
      },
      expiry: {
        type: Date,
        required: true
      },
      lastPrice: {
        type: Number,
        default: 0
      },
      bid: {
        type: Number,
        default: 0
      },
      ask: {
        type: Number,
        default: 0
      },
      volume: {
        type: Number,
        default: 0
      },
      openInterest: {
        type: Number,
        default: 0
      },
      impliedVolatility: {
        type: Number,
        default: 0
      },
      delta: {
        type: Number,
        default: 0
      },
      gamma: {
        type: Number,
        default: 0
      },
      theta: {
        type: Number,
        default: 0
      },
      vega: {
        type: Number,
        default: 0
      }
    }]
  },

  // Market Sentiment
  sentiment: {
    overall: {
      type: String,
      enum: ['BULLISH', 'BEARISH', 'NEUTRAL'],
      default: 'NEUTRAL'
    },
    score: {
      type: Number,
      min: -100,
      max: 100,
      default: 0
    },
    newsSentiment: {
      type: Number,
      min: -100,
      max: 100,
      default: 0
    },
    socialSentiment: {
      type: Number,
      min: -100,
      max: 100,
      default: 0
    },
    technicalSentiment: {
      type: Number,
      min: -100,
      max: 100,
      default: 0
    },
    institutionalSentiment: {
      type: Number,
      min: -100,
      max: 100,
      default: 0
    }
  },

  // AI Predictions
  aiPredictions: [{
    model: {
      type: String,
      required: true,
      enum: ['LSTM', 'GRU', 'TRANSFORMER', 'ENSEMBLE', 'TECHNICAL_AI', 'FUNDAMENTAL_AI']
    },
    prediction: {
      type: String,
      enum: ['BULLISH', 'BEARISH', 'NEUTRAL'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    targetPrice: {
      type: Number,
      default: null
    },
    stopLoss: {
      type: Number,
      default: null
    },
    timeHorizon: {
      type: String,
      enum: ['1D', '1W', '1M', '3M', '6M', '1Y'],
      required: true
    },
    reasoning: {
      type: String,
      maxlength: [1000, 'Reasoning cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  }],

  // News and Events
  news: [{
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    source: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    publishedAt: {
      type: Date,
      required: true
    },
    sentiment: {
      type: String,
      enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
      default: 'NEUTRAL'
    },
    impact: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    tags: [{
      type: String
    }]
  }],

  // Corporate Actions
  corporateActions: [{
    type: {
      type: String,
      enum: ['DIVIDEND', 'BONUS', 'SPLIT', 'RIGHTS', 'BUYBACK', 'MERGER', 'ACQUISITION'],
      required: true
    },
    announcementDate: {
      type: Date,
      required: true
    },
    exDate: {
      type: Date
    },
    recordDate: {
      type: Date
    },
    details: {
      type: String,
      required: true
    },
    impact: {
      type: String,
      enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
      default: 'NEUTRAL'
    }
  }],

  // Market Hours and Status
  marketStatus: {
    isOpen: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    nextOpen: {
      type: Date
    },
    nextClose: {
      type: Date
    },
    tradingHours: {
      open: {
        type: String,
        default: '09:15'
      },
      close: {
        type: String,
        default: '15:30'
      },
      timezone: {
        type: String,
        default: 'Asia/Kolkata'
      }
    }
  },

  // Historical Data Summary
  historicalSummary: {
    yearHigh: {
      type: Number,
      default: 0
    },
    yearLow: {
      type: Number,
      default: 0
    },
    yearHighDate: {
      type: Date
    },
    yearLowDate: {
      type: Date
    },
    averageVolume: {
      type: Number,
      default: 0
    },
    volatility: {
      type: Number,
      default: 0
    },
    beta: {
      type: Number,
      default: 1
    }
  },

  // Metadata
  metadata: {
    sector: {
      type: String,
      default: 'Unknown'
    },
    industry: {
      type: String,
      default: 'Unknown'
    },
    marketCapCategory: {
      type: String,
      enum: ['LARGE_CAP', 'MID_CAP', 'SMALL_CAP'],
      default: 'MID_CAP'
    },
    isIndex: {
      type: Boolean,
      default: false
    },
    isETF: {
      type: Boolean,
      default: false
    },
    isFNO: {
      type: Boolean,
      default: false
    },
    lotSize: {
      type: Number,
      default: 1
    },
    tickSize: {
      type: Number,
      default: 0.05
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for price change
marketDataSchema.virtual('priceChange').get(function() {
  return this.currentPrice - this.previousClose;
});

// Virtual for price change percentage
marketDataSchema.virtual('priceChangePercent').get(function() {
  if (this.previousClose === 0) return 0;
  return ((this.currentPrice - this.previousClose) / this.previousClose) * 100;
});

// Virtual for day range
marketDataSchema.virtual('dayRange').get(function() {
  return this.high - this.low;
});

// Virtual for day range percentage
marketDataSchema.virtual('dayRangePercent').get(function() {
  if (this.open === 0) return 0;
  return ((this.high - this.low) / this.open) * 100;
});

// Virtual for gap
marketDataSchema.virtual('gap').get(function() {
  return this.open - this.previousClose;
});

// Virtual for gap percentage
marketDataSchema.virtual('gapPercent').get(function() {
  if (this.previousClose === 0) return 0;
  return ((this.open - this.previousClose) / this.previousClose) * 100;
});

// Indexes for performance
marketDataSchema.index({ symbol: 1, exchange: 1 });
marketDataSchema.index({ market: 1 });
marketDataSchema.index({ 'sentiment.overall': 1 });
marketDataSchema.index({ 'marketStatus.isOpen': 1 });
marketDataSchema.index({ 'metadata.sector': 1 });
marketDataSchema.index({ 'metadata.marketCapCategory': 1 });
marketDataSchema.index({ currentPrice: 1 });
marketDataSchema.index({ changePercent: -1 });
marketDataSchema.index({ volume: -1 });
marketDataSchema.index({ updatedAt: -1 });

// Compound indexes for common queries
marketDataSchema.index({ market: 1, 'marketStatus.isOpen': 1 });
marketDataSchema.index({ exchange: 1, 'marketStatus.isOpen': 1 });
marketDataSchema.index({ 'metadata.sector': 1, changePercent: -1 });

// Pre-save middleware to calculate derived fields
marketDataSchema.pre('save', function(next) {
  // Calculate change and change percentage
  this.change = this.currentPrice - this.previousClose;
  this.changePercent = this.previousClose > 0 ? (this.change / this.previousClose) * 100 : 0;

  // Update last updated timestamp
  this.marketStatus.lastUpdated = new Date();

  next();
});

// Method to update current price and recalculate indicators
marketDataSchema.methods.updatePrice = function(newPrice, newVolume = null) {
  this.previousClose = this.currentPrice;
  this.currentPrice = newPrice;
  
  if (newVolume !== null) {
    this.volume = newVolume;
  }

  // Update high/low if necessary
  if (newPrice > this.high) {
    this.high = newPrice;
  }
  if (newPrice < this.low) {
    this.low = newPrice;
  }

  // Recalculate change and change percentage
  this.change = this.currentPrice - this.previousClose;
  this.changePercent = this.previousClose > 0 ? (this.change / this.previousClose) * 100 : 0;

  this.marketStatus.lastUpdated = new Date();
  
  return this.save();
};

// Method to add AI prediction
marketDataSchema.methods.addAIPrediction = function(predictionData) {
  // Remove expired predictions
  this.aiPredictions = this.aiPredictions.filter(p => p.expiresAt > new Date());
  
  // Add new prediction
  this.aiPredictions.push({
    ...predictionData,
    createdAt: new Date()
  });

  return this.save();
};

// Method to add news
marketDataSchema.methods.addNews = function(newsData) {
  this.news.unshift({
    ...newsData,
    publishedAt: new Date()
  });

  // Keep only last 50 news items
  if (this.news.length > 50) {
    this.news = this.news.slice(0, 50);
  }

  return this.save();
};

// Method to update sentiment
marketDataSchema.methods.updateSentiment = function(sentimentData) {
  this.sentiment = {
    ...this.sentiment,
    ...sentimentData
  };

  // Calculate overall sentiment
  const scores = [
    this.sentiment.newsSentiment,
    this.sentiment.socialSentiment,
    this.sentiment.technicalSentiment,
    this.sentiment.institutionalSentiment
  ].filter(score => score !== 0);

  if (scores.length > 0) {
    this.sentiment.score = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    if (this.sentiment.score > 20) {
      this.sentiment.overall = 'BULLISH';
    } else if (this.sentiment.score < -20) {
      this.sentiment.overall = 'BEARISH';
    } else {
      this.sentiment.overall = 'NEUTRAL';
    }
  }

  return this.save();
};

// Static method to get top gainers
marketDataSchema.statics.getTopGainers = async function(limit = 10, market = null) {
  const query = { 'marketStatus.isOpen': true };
  if (market) query.market = market;

  return await this.find(query)
    .sort({ changePercent: -1 })
    .limit(limit)
    .select('symbol symbolName currentPrice change changePercent volume');
};

// Static method to get top losers
marketDataSchema.statics.getTopLosers = async function(limit = 10, market = null) {
  const query = { 'marketStatus.isOpen': true };
  if (market) query.market = market;

  return await this.find(query)
    .sort({ changePercent: 1 })
    .limit(limit)
    .select('symbol symbolName currentPrice change changePercent volume');
};

// Static method to get most active
marketDataSchema.statics.getMostActive = async function(limit = 10, market = null) {
  const query = { 'marketStatus.isOpen': true };
  if (market) query.market = market;

  return await this.find(query)
    .sort({ volume: -1 })
    .limit(limit)
    .select('symbol symbolName currentPrice change changePercent volume');
};

// Static method to get AI recommendations
marketDataSchema.statics.getAIRecommendations = async function(limit = 20) {
  const now = new Date();
  
  return await this.find({
    'aiPredictions.expiresAt': { $gt: now },
    'aiPredictions.confidence': { $gte: 70 }
  })
    .sort({ 'aiPredictions.confidence': -1 })
    .limit(limit)
    .select('symbol symbolName currentPrice aiPredictions');
};

export default mongoose.model('MarketData', marketDataSchema); 