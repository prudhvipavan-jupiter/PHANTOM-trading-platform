// P.H.A.N.T.O.M Trading Platform User Model
// Comprehensive user management with profit tracking

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },

  // Trading Profile
  tradingProfile: {
    experience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    },
    preferredMarkets: [{
      type: String,
      enum: ['indian_stocks', 'us_stocks', 'forex', 'crypto', 'commodities', 'options', 'futures']
    }],
    tradingStyle: {
      type: String,
      enum: ['day_trading', 'swing_trading', 'position_trading', 'scalping', 'investing'],
      default: 'swing_trading'
    }
  },

  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },

  // Role and Permissions
  role: {
    type: String,
    enum: ['user', 'premium', 'trader', 'admin', 'super_admin'],
    default: 'user'
  },
  permissions: [{
    type: String,
    enum: [
      'read_portfolio', 'write_portfolio', 'execute_trades', 'view_analytics',
      'social_trading', 'copy_trading', 'admin_users', 'admin_trading',
      'admin_analytics', 'admin_system', 'ai_predictions', 'advanced_charts',
      'real_time_data', 'options_trading', 'futures_trading', 'forex_trading'
    ]
  }],

  // Financial Information
  wallet: {
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }]
  },

  // Profit Tracking
  profitMetrics: {
    totalProfit: {
      type: Number,
      default: 0
    },
    totalLoss: {
      type: Number,
      default: 0
    },
    netProfit: {
      type: Number,
      default: 0
    },
    totalTrades: {
      type: Number,
      default: 0
    },
    winningTrades: {
      type: Number,
      default: 0
    },
    losingTrades: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    },
    averageProfit: {
      type: Number,
      default: 0
    },
    averageLoss: {
      type: Number,
      default: 0
    },
    profitFactor: {
      type: Number,
      default: 0
    },
    maxDrawdown: {
      type: Number,
      default: 0
    },
    sharpeRatio: {
      type: Number,
      default: 0
    },
    bestTrade: {
      type: Number,
      default: 0
    },
    worstTrade: {
      type: Number,
      default: 0
    }
  },

  // Broker Connections
  brokerAccounts: [{
    broker: {
      type: String,
      enum: ['zerodha', 'paytm_money', 'angel_one', 'upstox', 'icici_direct', 'hdfc_sec']
    },
    accountId: String,
    apiKey: String,
    apiSecret: String,
    accessToken: String,
    publicAccessToken: String,
    readAccessToken: String,
    refreshToken: String,
    isActive: {
      type: Boolean,
      default: false
    },
    lastSync: Date
  }],

  // Preferences
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      },
      profitAlerts: {
        type: Boolean,
        default: true
      },
      lossAlerts: {
        type: Boolean,
        default: true
      },
      marketAlerts: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa']
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },

  // Security
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,

  // Social Trading
  socialTrading: {
    isPublic: {
      type: Boolean,
      default: false
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    copyTraders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    copiedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    performanceRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for profit percentage
userSchema.virtual('profitPercentage').get(function() {
  if (this.profitMetrics.totalTrades === 0) return 0;
  return (this.profitMetrics.netProfit / this.profitMetrics.totalTrades) * 100;
});

// Virtual for account value
userSchema.virtual('accountValue').get(function() {
  return this.wallet.balance + this.profitMetrics.netProfit;
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'profitMetrics.netProfit': -1 });
userSchema.index({ 'socialTrading.performanceRating': -1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update profit metrics
userSchema.methods.updateProfitMetrics = function(trade) {
  const { profit, isWin } = trade;
  
  this.profitMetrics.totalTrades += 1;
  this.profitMetrics.netProfit += profit;
  
  if (isWin) {
    this.profitMetrics.totalProfit += profit;
    this.profitMetrics.winningTrades += 1;
    this.profitMetrics.bestTrade = Math.max(this.profitMetrics.bestTrade, profit);
  } else {
    this.profitMetrics.totalLoss += Math.abs(profit);
    this.profitMetrics.losingTrades += 1;
    this.profitMetrics.worstTrade = Math.min(this.profitMetrics.worstTrade, profit);
  }
  
  this.profitMetrics.winRate = (this.profitMetrics.winningTrades / this.profitMetrics.totalTrades) * 100;
  this.profitMetrics.averageProfit = this.profitMetrics.totalProfit / this.profitMetrics.winningTrades || 0;
  this.profitMetrics.averageLoss = this.profitMetrics.totalLoss / this.profitMetrics.losingTrades || 0;
  this.profitMetrics.profitFactor = this.profitMetrics.totalProfit / this.profitMetrics.totalLoss || 0;
  
  return this.save();
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

export default mongoose.model('User', userSchema); 