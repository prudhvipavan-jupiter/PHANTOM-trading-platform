// Yahoo Finance API Service for Global Market Data
// Provides real-time and historical market data for global markets

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

export interface TrainingData {
  features: number[][];
  targets: number[];
  featureNames: string[];
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
}

class YahooFinanceAPI {
  private readonly baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data;
    }
    return null;
  }

  // Get real-time stock quote
  async getStockQuote(symbol: string): Promise<MarketData | null> {
    const cacheKey = `quote_${symbol}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}${symbol}?interval=1d&range=1d`);
      if (!response.ok) return null;

      const data = await response.json();
      const result = data.chart.result[0];
      const quote = result.indicators.quote[0];
      const meta = result.meta;

      const marketData: MarketData = {
        symbol: symbol,
        name: meta.symbol || symbol,
        price: meta.regularMarketPrice || 0,
        change: (meta.regularMarketPrice || 0) - (meta.previousClose || 0),
        changePercent: meta.regularMarketPrice && meta.previousClose 
          ? ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100 
          : 0,
        volume: quote.volume?.[0] || 0,
        marketCap: 0,
        high: quote.high?.[0] || 0,
        low: quote.low?.[0] || 0,
        open: quote.open?.[0] || 0,
        previousClose: meta.previousClose || 0,
        timestamp: Date.now()
      };

      this.setCache(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      return null;
    }
  }

  // Get historical data for AI training
  async getMarketDataForAI(symbol: string): Promise<MarketData[] | null> {
    const cacheKey = `historical_${symbol}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}${symbol}?interval=1d&range=1y`);
      if (!response.ok) return null;

      const data = await response.json();
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];

      const historicalData: MarketData[] = [];

      for (let i = 0; i < timestamps.length; i++) {
        if (quote.close[i] !== null && quote.close[i] !== undefined) {
          historicalData.push({
            symbol: symbol,
            name: result.meta.symbol || symbol,
            price: quote.close[i],
            change: i > 0 ? quote.close[i] - quote.close[i - 1] : 0,
            changePercent: i > 0 ? ((quote.close[i] - quote.close[i - 1]) / quote.close[i - 1]) * 100 : 0,
            volume: quote.volume[i] || 0,
            marketCap: 0,
            high: quote.high[i] || 0,
            low: quote.low[i] || 0,
            open: quote.open[i] || 0,
            previousClose: i > 0 ? quote.close[i - 1] : quote.close[i],
            timestamp: timestamps[i] * 1000
          });
        }
      }

      this.setCache(cacheKey, historicalData);
      return historicalData;
    } catch (error) {
      console.error('Historical data fetch error:', error);
      return null;
    }
  }

  // Prepare training data for AI models
  prepareTrainingData(historicalData: MarketData[]): TrainingData {
    const features: number[][] = [];
    const targets: number[] = [];
    const featureNames = [
      'price', 'volume', 'high', 'low', 'open', 'change', 'changePercent',
      'price_sma_5', 'price_sma_10', 'price_sma_20', 'volume_sma_5',
      'rsi_14', 'macd', 'bollinger_upper', 'bollinger_lower'
    ];

    for (let i = 20; i < historicalData.length - 1; i++) {
      const currentData = historicalData[i];
      const nextData = historicalData[i + 1];
      
      // Calculate technical indicators
      const sma5 = this.calculateSMA(historicalData, i, 5, 'price');
      const sma10 = this.calculateSMA(historicalData, i, 10, 'price');
      const sma20 = this.calculateSMA(historicalData, i, 20, 'price');
      const volumeSMA5 = this.calculateSMA(historicalData, i, 5, 'volume');
      const rsi = this.calculateRSI(historicalData, i, 14);
      const macd = this.calculateMACD(historicalData, i);
      const bollinger = this.calculateBollingerBands(historicalData, i, 20);

      const featureVector = [
        currentData.price,
        currentData.volume,
        currentData.high,
        currentData.low,
        currentData.open,
        currentData.change,
        currentData.changePercent,
        sma5,
        sma10,
        sma20,
        volumeSMA5,
        rsi,
        macd,
        bollinger.upper
      ];

      features.push(featureVector);
      targets.push(nextData.changePercent); // Predict next day's percentage change
    }

    return { features, targets, featureNames };
  }

  // Search for symbols
  async searchSymbols(query: string): Promise<SearchResult[]> {
    if (query.length < 2) return [];

    try {
      // Mock search results for global markets
      const mockResults: SearchResult[] = [
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock' },
        { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
        { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Stock' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock' },
        { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Stock' },
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF' },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF' }
      ];

      return mockResults.filter(result => 
        result.symbol.toLowerCase().includes(query.toLowerCase()) ||
        result.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Technical indicator calculations
  private calculateSMA(data: MarketData[], index: number, period: number, field: keyof MarketData): number {
    if (index < period - 1) return 0;
    
    const sum = data
      .slice(index - period + 1, index + 1)
      .reduce((acc, item) => acc + (item[field] as number), 0);
    
    return sum / period;
  }

  private calculateRSI(data: MarketData[], index: number, period: number): number {
    if (index < period) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = index - period + 1; i <= index; i++) {
      const change = data[i].change;
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(data: MarketData[], index: number): number {
    if (index < 26) return 0;

    const ema12 = this.calculateEMA(data, index, 12, 'price');
    const ema26 = this.calculateEMA(data, index, 26, 'price');
    
    return ema12 - ema26;
  }

  private calculateEMA(data: MarketData[], index: number, period: number, field: keyof MarketData): number {
    if (index < period - 1) return 0;

    const multiplier = 2 / (period + 1);
    let ema = data[index - period + 1][field] as number;

    for (let i = index - period + 2; i <= index; i++) {
      ema = (data[i][field] as number * multiplier) + (ema * (1 - multiplier));
    }

    return ema;
  }

  private calculateBollingerBands(data: MarketData[], index: number, period: number): { upper: number; lower: number } {
    if (index < period - 1) return { upper: 0, lower: 0 };

    const sma = this.calculateSMA(data, index, period, 'price');
    let variance = 0;

    for (let i = index - period + 1; i <= index; i++) {
      variance += Math.pow(data[i].price - sma, 2);
    }

    const standardDeviation = Math.sqrt(variance / period);
    const upper = sma + (standardDeviation * 2);
    const lower = sma - (standardDeviation * 2);

    return { upper, lower };
  }
}

export const yahooFinanceAPI = new YahooFinanceAPI(); 