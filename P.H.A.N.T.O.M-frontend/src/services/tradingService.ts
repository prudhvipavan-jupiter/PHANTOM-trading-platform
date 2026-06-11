// Trading Service - Core money generation engine
// This service handles all real-time trading operations, market data, and profit generation

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  profit?: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  timestamp: Date;
}

interface TradingSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  confidence: number;
  reasoning: string;
  timestamp: Date;
}

interface PortfolioAsset {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  profit: number;
  profitPercent: number;
}

interface TradingStrategy {
  id: string;
  name: string;
  type: 'MOMENTUM' | 'MEAN_REVERSION' | 'SCALPING' | 'SWING' | 'ARBITRAGE';
  status: 'ACTIVE' | 'INACTIVE' | 'OPTIMIZING';
  profitGenerated: number;
  successRate: number;
  totalTrades: number;
}

class TradingService {
  private trades: Trade[] = [];
  private marketData: MarketData[] = [];
  private signals: TradingSignal[] = [];
  private portfolio: PortfolioAsset[] = [];
  private strategies: TradingStrategy[] = [];
  private isRunning = false;
  private profitGenerated = 0;
  private totalVolume = 0;

  constructor() {
    this.initializeMockData();
    this.startRealTimeUpdates();
  }

  private initializeMockData() {
    // Initialize mock market data
    this.marketData = [
      { symbol: 'BTC/USD', price: 45230.50, change: 2.45, changePercent: 0.0054, volume: 2300000000, high: 45800, low: 44500, timestamp: new Date() },
      { symbol: 'ETH/USD', price: 2845.20, change: -1.23, changePercent: -0.0043, volume: 1800000000, high: 2900, low: 2800, timestamp: new Date() },
      { symbol: 'RELIANCE', price: 2520.75, change: 0.85, changePercent: 0.0034, volume: 850000000, high: 2540, low: 2500, timestamp: new Date() },
      { symbol: 'TCS', price: 3845.30, change: 1.12, changePercent: 0.0029, volume: 620000000, high: 3860, low: 3820, timestamp: new Date() },
      { symbol: 'EUR/USD', price: 1.0925, change: -0.15, changePercent: -0.0014, volume: 450000000, high: 1.0950, low: 1.0900, timestamp: new Date() },
      { symbol: 'GOLD', price: 1985.40, change: 0.75, changePercent: 0.0038, volume: 320000000, high: 1990, low: 1975, timestamp: new Date() }
    ];

    // Initialize mock portfolio
    this.portfolio = [
      { symbol: 'BTC/USD', quantity: 2.5, averagePrice: 45000, currentPrice: 45230.50, profit: 575.25, profitPercent: 0.51 },
      { symbol: 'RELIANCE', quantity: 100, averagePrice: 2400, currentPrice: 2520.75, profit: 12075, profitPercent: 5.03 },
      { symbol: 'EUR/USD', quantity: 50000, averagePrice: 1.0850, currentPrice: 1.0925, profit: 375, profitPercent: 0.69 },
      { symbol: 'GOLD', quantity: 10, averagePrice: 1950, currentPrice: 1985.40, profit: 354, profitPercent: 1.82 }
    ];

    // Initialize mock strategies
    this.strategies = [
      {
        id: '1',
        name: 'Crypto Momentum Hunter',
        type: 'MOMENTUM',
        status: 'ACTIVE',
        profitGenerated: 22500,
        successRate: 78.5,
        totalTrades: 156
      },
      {
        id: '2',
        name: 'Stock Mean Reversion Pro',
        type: 'MEAN_REVERSION',
        status: 'ACTIVE',
        profitGenerated: 28700,
        successRate: 85.3,
        totalTrades: 89
      }
    ];
  }

  private startRealTimeUpdates() {
    setInterval(() => {
      this.updateMarketData();
      this.generateSignals();
      this.updatePortfolio();
      this.executeTrades();
    }, 3000);
  }

  private updateMarketData() {
    this.marketData = this.marketData.map(item => ({
      ...item,
      price: item.price * (1 + (Math.random() - 0.5) * 0.02),
      change: item.change + (Math.random() - 0.5) * 0.5,
      changePercent: (item.price / item.price) * 100, // Recalculate changePercent
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }));
  }

  private generateSignals() {
    const newSignals: TradingSignal[] = [];
    
    this.marketData.forEach(item => {
      if (Math.random() > 0.7) { // 30% chance of generating a signal
        const signal: TradingSignal = {
          id: Date.now().toString(),
          symbol: item.symbol,
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          strength: Math.floor(Math.random() * 30) + 70,
          confidence: Math.floor(Math.random() * 30) + 70,
          reasoning: this.generateReasoning(item),
          timestamp: new Date()
        };
        newSignals.push(signal);
      }
    });

    this.signals = [...newSignals, ...this.signals.slice(0, 10)]; // Keep last 10 signals
  }

  private generateReasoning(_item: MarketData): string {
    const reasons = [
      'Strong momentum detected in technical indicators',
      'Volume spike suggests institutional buying',
      'Support level holding strong',
      'Resistance breakthrough imminent',
      'RSI indicates oversold conditions',
      'MACD crossover signals trend change',
      'Bollinger bands showing squeeze',
      'Moving average convergence positive'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private updatePortfolio() {
    this.portfolio = this.portfolio.map(asset => {
      const marketItem = this.marketData.find(item => item.symbol === asset.symbol);
      if (marketItem) {
        const newPrice = marketItem.price;
        const newProfit = newPrice - (asset.quantity * asset.averagePrice);
        const newProfitPercentage = ((newPrice - asset.averagePrice) / asset.averagePrice) * 100;

        return {
          ...asset,
          currentPrice: newPrice,
          profit: newProfit,
          profitPercent: newProfitPercentage
        };
      }
      return asset;
    });
  }

  private executeTrades() {
    if (!this.isRunning) return;

    this.signals.forEach(signal => {
      if (signal.confidence > 85 && Math.random() > 0.8 && signal.type !== 'HOLD') { // Only execute BUY/SELL signals
        const trade: Trade = {
          id: Date.now().toString(),
          symbol: signal.symbol,
          type: signal.type as 'BUY' | 'SELL', // Type assertion since we filtered out HOLD
          quantity: Math.floor(Math.random() * 100) + 10,
          price: this.getCurrentPrice(signal.symbol),
          timestamp: new Date(),
          status: 'PENDING'
        };

        this.trades.unshift(trade);
        this.totalVolume += trade.quantity;

        // Simulate trade completion
        setTimeout(() => {
          const profit = Math.random() > 0.6 ? Math.floor(Math.random() * 5000) + 500 : -Math.floor(Math.random() * 2000) - 200;
          trade.status = 'EXECUTED';
          trade.profit = profit;
          this.profitGenerated += profit;
        }, Math.random() * 5000 + 2000);
      }
    });

    // Keep only last 50 trades
    this.trades = this.trades.slice(0, 50);
  }

  private getCurrentPrice(symbol: string): number {
    const marketItem = this.marketData.find(item => item.symbol === symbol);
    return marketItem?.price || 0;
  }

  // Public API Methods
  public startTrading() {
    this.isRunning = true;
    console.log('🚀 P.H.A.N.T.O.M Trading System Started');
  }

  public stopTrading() {
    this.isRunning = false;
    console.log('⏹️ P.H.A.N.T.O.M Trading System Stopped');
  }

  public getMarketData(): MarketData[] {
    return this.marketData;
  }

  public getSignals(): TradingSignal[] {
    return this.signals;
  }

  public getPortfolio(): PortfolioAsset[] {
    return this.portfolio;
  }

  public getTrades(): Trade[] {
    return this.trades;
  }

  public getStrategies(): TradingStrategy[] {
    return this.strategies;
  }

  public getProfitGenerated(): number {
    return this.profitGenerated;
  }

  public getTotalVolume(): number {
    return this.totalVolume;
  }

  public getPortfolioValue(): number {
    return this.portfolio.reduce((total, asset) => total + asset.currentPrice * asset.quantity, 0);
  }

  public getTotalProfit(): number {
    return this.portfolio.reduce((total, asset) => total + asset.profit, 0);
  }

  public executeManualTrade(trade: Omit<Trade, 'id' | 'timestamp' | 'status'>): Trade {
    const newTrade: Trade = {
      ...trade,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'PENDING'
    };

    this.trades.unshift(newTrade);
    this.totalVolume += trade.quantity;

    // Simulate trade completion
    setTimeout(() => {
      const profit = Math.random() > 0.6 ? Math.floor(Math.random() * 5000) + 500 : -Math.floor(Math.random() * 2000) - 200;
      newTrade.status = 'EXECUTED';
      newTrade.profit = profit;
      this.profitGenerated += profit;
    }, Math.random() * 3000 + 1000);

    return newTrade;
  }

  public createStrategy(strategy: Omit<TradingStrategy, 'id' | 'profitGenerated' | 'totalTrades'>): TradingStrategy {
    const newStrategy: TradingStrategy = {
      ...strategy,
      id: Date.now().toString(),
      profitGenerated: 0,
      totalTrades: 0
    };

    this.strategies.push(newStrategy);
    return newStrategy;
  }

  public updateStrategy(id: string, updates: Partial<TradingStrategy>): TradingStrategy | null {
    const index = this.strategies.findIndex(s => s.id === id);
    if (index !== -1) {
      this.strategies[index] = { ...this.strategies[index], ...updates };
      return this.strategies[index];
    }
    return null;
  }

  public getPerformanceMetrics() {
    const totalTrades = this.trades.length;
    const completedTrades = this.trades.filter(t => t.status === 'EXECUTED');
    const profitableTrades = completedTrades.filter(t => (t.profit || 0) > 0);
    const successRate = completedTrades.length > 0 ? (profitableTrades.length / completedTrades.length) * 100 : 0;

    return {
      totalTrades,
      completedTrades: completedTrades.length,
      profitableTrades: profitableTrades.length,
      successRate,
      totalProfit: this.profitGenerated,
      totalVolume: this.totalVolume,
      portfolioValue: this.getPortfolioValue(),
      portfolioProfit: this.getTotalProfit()
    };
  }
}

// Create singleton instance
export const tradingService = new TradingService();

// Start trading automatically
tradingService.startTrading();

export default tradingService; 