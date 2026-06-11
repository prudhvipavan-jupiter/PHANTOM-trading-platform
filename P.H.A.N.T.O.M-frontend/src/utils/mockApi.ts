// P.H.A.N.T.O.M Mock API service for frontend-only development
// This provides mock data and functionality when no backend is available

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Mock data
const mockUser: User = {
  _id: '1',
  name: 'Admin User',
  email: 'admin@phantom.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

const mockToken = 'mock_jwt_token_' + Date.now();

// Mock API client
class MockApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('phantom_token');
  }

  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.delay(800); // Simulate network delay

    // Check credentials
    if (credentials.username === 'admin@phantom.com' && credentials.password === 'Honey@!2!6') {
      this.token = mockToken;
      localStorage.setItem('phantom_token', mockToken);
      localStorage.setItem('phantom_user', JSON.stringify(mockUser));
      
      return {
        token: mockToken,
        user: mockUser,
        message: 'Login successful'
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async logout(): Promise<void> {
    await this.delay(300);
    this.token = null;
    localStorage.removeItem('phantom_token');
    localStorage.removeItem('phantom_user');
  }

  async register(userData: { name: string; email: string; password: string }): Promise<LoginResponse> {
    await this.delay(1000);
    
    const newUser: User = {
      _id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    this.token = mockToken;
    localStorage.setItem('phantom_token', mockToken);
    localStorage.setItem('phantom_user', JSON.stringify(newUser));

    return {
      token: mockToken,
      user: newUser,
      message: 'Registration successful'
    };
  }

  async getProfile(): Promise<User> {
    await this.delay(400);
    const userStr = localStorage.getItem('phantom_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return mockUser;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    await this.delay(600);
    const updatedUser = { ...mockUser, ...profileData };
    localStorage.setItem('phantom_user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  // Market data methods
  async getMarketData(): Promise<any[]> {
    await this.delay(500);
    return [
      { symbol: 'AAPL', price: 150.25, change: 2.15, changePercent: 1.45 },
      { symbol: 'GOOGL', price: 2750.80, change: -15.20, changePercent: -0.55 },
      { symbol: 'MSFT', price: 320.45, change: 8.75, changePercent: 2.81 },
      { symbol: 'TSLA', price: 850.30, change: 25.60, changePercent: 3.10 },
      { symbol: 'AMZN', price: 185.90, change: -3.45, changePercent: -1.82 }
    ];
  }

  async getPortfolio(): Promise<any> {
    await this.delay(600);
    return {
      totalValue: 125000,
      dailyChange: 1250,
      dailyChangePercent: 1.01,
      holdings: [
        { symbol: 'AAPL', shares: 100, value: 15025, change: 215 },
        { symbol: 'GOOGL', shares: 20, value: 55016, change: -304 },
        { symbol: 'MSFT', shares: 50, value: 16022, change: 437 }
      ]
    };
  }

  async getTradingSignals(): Promise<any[]> {
    await this.delay(400);
    return [
      { symbol: 'AAPL', signal: 'BUY', confidence: 85, reason: 'Strong technical indicators' },
      { symbol: 'TSLA', signal: 'HOLD', confidence: 70, reason: 'Waiting for breakout' },
      { symbol: 'NVDA', signal: 'SELL', confidence: 80, reason: 'Overbought conditions' }
    ];
  }

  async getTradingHistory(): Promise<any[]> {
    await this.delay(500);
    return [
      { id: 1, symbol: 'AAPL', type: 'BUY', shares: 50, price: 148.50, date: '2025-07-29' },
      { id: 2, symbol: 'GOOGL', type: 'SELL', shares: 10, price: 2765.20, date: '2025-07-28' },
      { id: 3, symbol: 'MSFT', type: 'BUY', shares: 25, price: 315.75, date: '2025-07-27' }
    ];
  }

  async placeTrade(tradeData: { symbol: string; type: 'BUY' | 'SELL'; amount: number; price?: number }): Promise<any> {
    await this.delay(1000);
    return {
      success: true,
      orderId: Date.now(),
      message: `${tradeData.type} order placed for ${tradeData.symbol}`,
      ...tradeData
    };
  }

  async getWalletBalance(): Promise<any> {
    await this.delay(300);
    return {
      balance: 25000,
      currency: 'USD',
      lastUpdated: new Date().toISOString()
    };
  }

  async getTransactionHistory(): Promise<any[]> {
    await this.delay(400);
    return [
      { id: 1, type: 'DEPOSIT', amount: 10000, date: '2025-07-25', status: 'completed' },
      { id: 2, type: 'WITHDRAWAL', amount: 5000, date: '2025-07-20', status: 'completed' },
      { id: 3, type: 'TRADE', amount: -1500, date: '2025-07-29', status: 'completed' }
    ];
  }

  async getAnalytics(): Promise<any> {
    await this.delay(700);
    return {
      totalReturn: 12.5,
      sharpeRatio: 1.8,
      maxDrawdown: -5.2,
      volatility: 15.3,
      beta: 1.1
    };
  }

  async getPerformanceMetrics(): Promise<any> {
    await this.delay(500);
    return {
      dailyReturn: 1.2,
      weeklyReturn: 3.8,
      monthlyReturn: 8.5,
      yearlyReturn: 15.2
    };
  }

  async getAIStrategies(): Promise<any[]> {
    await this.delay(600);
    return [
      { id: 1, name: 'Momentum Trading', status: 'active', performance: 8.5 },
      { id: 2, name: 'Mean Reversion', status: 'paused', performance: 5.2 },
      { id: 3, name: 'Arbitrage Bot', status: 'active', performance: 12.1 }
    ];
  }

  async createAIStrategy(strategyData: any): Promise<any> {
    await this.delay(800);
    return {
      success: true,
      strategyId: Date.now(),
      message: 'AI strategy created successfully'
    };
  }

  async getNotifications(): Promise<any[]> {
    await this.delay(300);
    return [
      { id: 1, type: 'trade', message: 'AAPL order executed successfully', read: false, date: '2025-07-29T10:30:00Z' },
      { id: 2, type: 'alert', message: 'Market volatility detected', read: true, date: '2025-07-29T09:15:00Z' },
      { id: 3, type: 'system', message: 'System maintenance scheduled', read: false, date: '2025-07-29T08:00:00Z' }
    ];
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.delay(200);
    // Mock implementation
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.delay(300);
    // Mock implementation
  }

  async getSocialFeed(): Promise<any[]> {
    await this.delay(500);
    return [
      { id: 1, user: 'TraderPro', message: 'Great day for tech stocks!', likes: 45, date: '2025-07-29T11:00:00Z' },
      { id: 2, user: 'CryptoKing', message: 'Bitcoin showing strong support at 45k', likes: 32, date: '2025-07-29T10:30:00Z' },
      { id: 3, user: 'StockMaster', message: 'Market analysis: Bullish on renewable energy', likes: 28, date: '2025-07-29T10:00:00Z' }
    ];
  }

  async followTrader(traderId: string): Promise<void> {
    await this.delay(400);
    // Mock implementation
  }

  async getAdminStats(): Promise<any> {
    await this.delay(600);
    return {
      totalUsers: 1250,
      activeUsers: 890,
      totalTrades: 15420,
      dailyVolume: 2500000
    };
  }

  async getSystemStatus(): Promise<any> {
    await this.delay(200);
    return {
      status: 'online',
      uptime: 99.9,
      lastCheck: new Date().toISOString()
    };
  }

  async healthCheck(): Promise<boolean> {
    await this.delay(100);
    return true;
  }
}

// Export singleton instance
export const mockApi = new MockApiClient(); 