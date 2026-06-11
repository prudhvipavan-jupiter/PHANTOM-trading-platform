// Indian Market API Service for Indian Market Data & AI Training
// Provides comprehensive Indian stock market data for P.H.A.N.T.O.M

import { indianMarketService } from './indianMarketService';
import type { IndianStockQuote } from './indianMarketService';

export interface MarketDataForAI {
  symbol: string;
  historical: IndianStockQuote[];
  technical: {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    bollingerUpper: number;
    bollingerLower: number;
  };
  fundamentals: {
    marketCap: number;
    pe: number;
    pb: number;
    dividendYield: number;
  };
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

class IndianMarketAPI {
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

  // Get Indian market data for AI training
  async getIndianMarketDataForAI(symbol: string): Promise<MarketDataForAI | null> {
    const cacheKey = `ai_data_${symbol}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Get current stock data
      const currentData = await indianMarketService.getIndianStockQuote(symbol);
      if (!currentData) return null;

      // Generate historical data (mock for now, would be real in production)
      const historical = this.generateHistoricalData(symbol, currentData);
      
      // Calculate technical indicators
      const technical = this.calculateTechnicalIndicators(historical);
      
      // Get fundamentals
      const fundamentals = {
        marketCap: currentData.marketCap,
        pe: currentData.pe,
        pb: currentData.pb,
        dividendYield: currentData.dividendYield
      };

      const marketData: MarketDataForAI = {
        symbol,
        historical,
        technical,
        fundamentals
      };

      this.setCache(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error('Error fetching Indian market data for AI:', error);
      return null;
    }
  }

  // Prepare training data for AI models
  prepareIndianTrainingData(marketData: MarketDataForAI): TrainingData {
    const features: number[][] = [];
    const targets: number[] = [];
    const featureNames = [
      'price', 'volume', 'high', 'low', 'open', 'change', 'changePercent',
      'price_sma_5', 'price_sma_10', 'price_sma_20', 'volume_sma_5',
      'rsi_14', 'macd', 'bollinger_upper', 'bollinger_lower',
      'market_cap', 'pe_ratio', 'pb_ratio', 'dividend_yield'
    ];

    for (let i = 20; i < marketData.historical.length - 1; i++) {
      const currentData = marketData.historical[i];
      const nextData = marketData.historical[i + 1];
      
      // Calculate technical indicators
      const sma5 = this.calculateSMA(marketData.historical, i, 5, 'currentPrice');
      const sma10 = this.calculateSMA(marketData.historical, i, 10, 'currentPrice');
      const sma20 = this.calculateSMA(marketData.historical, i, 20, 'currentPrice');
      const volumeSMA5 = this.calculateSMA(marketData.historical, i, 5, 'volume');
      const rsi = this.calculateRSI(marketData.historical, i, 14);
      const macd = this.calculateMACD(marketData.historical, i);
      const bollinger = this.calculateBollingerBands(marketData.historical, i, 20);

      const featureVector = [
        currentData.currentPrice,
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
        bollinger.upper,
        marketData.fundamentals.marketCap,
        marketData.fundamentals.pe,
        marketData.fundamentals.pb,
        marketData.fundamentals.dividendYield
      ];

      features.push(featureVector);
      targets.push(nextData.changePercent); // Predict next day's percentage change
    }

    return { features, targets, featureNames };
  }

  // Search for Indian stocks
  async searchIndianStocks(query: string): Promise<SearchResult[]> {
    if (query.length < 2) return [];

    try {
      const results = await indianMarketService.searchIndianStocks(query);
      return results.map(stock => ({
        symbol: stock.symbol,
        name: stock.companyName,
        type: 'Stock'
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Generate historical data (mock implementation)
  private generateHistoricalData(symbol: string, currentData: IndianStockQuote): IndianStockQuote[] {
    const historical: IndianStockQuote[] = [];
    const basePrice = currentData.currentPrice;
    const baseVolume = currentData.volume;

    // Generate 252 days of historical data (1 trading year)
    for (let i = 251; i >= 0; i--) {
      const daysAgo = i;
      const volatility = 0.02; // 2% daily volatility
      const trend = 0.0001; // Slight upward trend
      
      // Generate price with some randomness
      const priceChange = (Math.random() - 0.5) * volatility + trend;
      const price = basePrice * Math.pow(1 + priceChange, daysAgo);
      
      // Generate volume with some randomness
      const volumeChange = (Math.random() - 0.5) * 0.3; // 30% volume variation
      const volume = baseVolume * (1 + volumeChange);
      
      // Generate OHLC data
      const open = price * (1 + (Math.random() - 0.5) * 0.01);
      const high = Math.max(open, price) * (1 + Math.random() * 0.005);
      const low = Math.min(open, price) * (1 - Math.random() * 0.005);
      
      const previousPrice = i < 251 ? historical[historical.length - 1].currentPrice : price;
      const change = price - previousPrice;
      const changePercent = (change / previousPrice) * 100;

      historical.push({
        symbol: symbol,
        companyName: currentData.companyName,
        currentPrice: price,
        previousClose: previousPrice,
        change: change,
        changePercent: changePercent,
        volume: Math.floor(volume),
        marketCap: currentData.marketCap,
        high: high,
        low: low,
        open: open,
        dayHigh: high,
        dayLow: low,
        yearHigh: currentData.yearHigh,
        yearLow: currentData.yearLow,
        pe: currentData.pe,
        pb: currentData.pb,
        dividendYield: currentData.dividendYield,
        faceValue: currentData.faceValue,
        sector: currentData.sector,
        industry: currentData.industry,
        exchange: currentData.exchange,
        timestamp: Date.now() - (daysAgo * 24 * 60 * 60 * 1000)
      });
    }

    return historical;
  }

  // Calculate technical indicators
  private calculateTechnicalIndicators(data: IndianStockQuote[]): {
    rsi: number;
    macd: number;
    sma20: number;
    sma50: number;
    bollingerUpper: number;
    bollingerLower: number;
  } {
    if (data.length < 50) {
      return {
        rsi: 50,
        macd: 0,
        sma20: data[data.length - 1]?.currentPrice || 0,
        sma50: data[data.length - 1]?.currentPrice || 0,
        bollingerUpper: data[data.length - 1]?.currentPrice || 0,
        bollingerLower: data[data.length - 1]?.currentPrice || 0
      };
    }

    const currentIndex = data.length - 1;
    
    return {
      rsi: this.calculateRSI(data, currentIndex, 14),
      macd: this.calculateMACD(data, currentIndex),
      sma20: this.calculateSMA(data, currentIndex, 20, 'currentPrice'),
      sma50: this.calculateSMA(data, currentIndex, 50, 'currentPrice'),
      bollingerUpper: this.calculateBollingerBands(data, currentIndex, 20).upper,
      bollingerLower: this.calculateBollingerBands(data, currentIndex, 20).lower
    };
  }

  // Technical indicator calculations
  private calculateSMA(data: IndianStockQuote[], index: number, period: number, field: keyof IndianStockQuote): number {
    if (index < period - 1) return 0;
    
    const sum = data
      .slice(index - period + 1, index + 1)
      .reduce((acc, item) => acc + (item[field] as number), 0);
    
    return sum / period;
  }

  private calculateRSI(data: IndianStockQuote[], index: number, period: number): number {
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

  private calculateMACD(data: IndianStockQuote[], index: number): number {
    if (index < 26) return 0;

    const ema12 = this.calculateEMA(data, index, 12, 'currentPrice');
    const ema26 = this.calculateEMA(data, index, 26, 'currentPrice');
    
    return ema12 - ema26;
  }

  private calculateEMA(data: IndianStockQuote[], index: number, period: number, field: keyof IndianStockQuote): number {
    if (index < period - 1) return 0;

    const multiplier = 2 / (period + 1);
    let ema = data[index - period + 1][field] as number;

    for (let i = index - period + 2; i <= index; i++) {
      ema = (data[i][field] as number * multiplier) + (ema * (1 - multiplier));
    }

    return ema;
  }

  private calculateBollingerBands(data: IndianStockQuote[], index: number, period: number): { upper: number; lower: number } {
    if (index < period - 1) return { upper: 0, lower: 0 };

    const sma = this.calculateSMA(data, index, period, 'currentPrice');
    let variance = 0;

    for (let i = index - period + 1; i <= index; i++) {
      variance += Math.pow(data[i].currentPrice - sma, 2);
    }

    const standardDeviation = Math.sqrt(variance / period);
    const upper = sma + (standardDeviation * 2);
    const lower = sma - (standardDeviation * 2);

    return { upper, lower };
  }
}

export const indianMarketAPI = new IndianMarketAPI(); 