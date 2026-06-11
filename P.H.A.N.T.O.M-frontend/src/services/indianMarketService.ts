// P.H.A.N.T.O.M Indian Market Data Service
// Comprehensive Indian stock market data with multiple API sources

import { INDIAN_MARKET_CONFIG } from '../config/indianMarketConfig';

export interface IndianStockQuote {
  symbol: string;
  companyName: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  pe: number;
  pb: number;
  dividendYield: number;
  faceValue: number;
  sector: string;
  industry: string;
  exchange: string;
  timestamp: number;
}

export interface IndianIndex {
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

export interface IndianMarketData {
  nifty50: IndianIndex;
  sensex: IndianIndex;
  bankNifty: IndianIndex;
  niftyIT: IndianIndex;
  niftyPharma: IndianIndex;
  niftyAuto: IndianIndex;
  niftyFMCG: IndianIndex;
  niftyMetal: IndianIndex;
  niftyRealty: IndianIndex;
  niftyEnergy: IndianIndex;
}

export interface TopGainersLosers {
  gainers: IndianStockQuote[];
  losers: IndianStockQuote[];
  mostActive: IndianStockQuote[];
}

export interface MarketDepth {
  symbol: string;
  bids: Array<{ price: number; quantity: number }>;
  asks: Array<{ price: number; quantity: number }>;
  timestamp: number;
}

export interface OptionsChain {
  symbol: string;
  expiryDate: string;
  strikePrice: number;
  callOI: number;
  callVolume: number;
  callLTP: number;
  putOI: number;
  putVolume: number;
  putLTP: number;
}

class IndianMarketService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = INDIAN_MARKET_CONFIG.CACHE_CONFIG.STOCK_QUOTE;

  // API Endpoints
  private readonly APIs = {
    // Primary: Yahoo Finance (Free, reliable)
    yahooFinance: INDIAN_MARKET_CONFIG.API_CONFIG.YAHOO_FINANCE.baseUrl,
    
    // Secondary: Alpha Vantage (Free tier available)
    alphaVantage: INDIAN_MARKET_CONFIG.API_CONFIG.ALPHA_VANTAGE.baseUrl,
    
    // Tertiary: Polygon.io (Free tier available)
    polygon: INDIAN_MARKET_CONFIG.API_CONFIG.POLYGON.baseUrl,
    
    // Indian Market Specific APIs
    nseIndia: INDIAN_MARKET_CONFIG.API_CONFIG.NSE_INDIA.baseUrl,
    moneyControl: INDIAN_MARKET_CONFIG.API_CONFIG.MONEY_CONTROL.baseUrl,
    
    // Alternative: Screener.in (Free)
    screener: INDIAN_MARKET_CONFIG.API_CONFIG.SCREENER.baseUrl,
  };

  private readonly API_KEYS = {
    alphaVantage: INDIAN_MARKET_CONFIG.API_CONFIG.ALPHA_VANTAGE.apiKey,
    polygon: INDIAN_MARKET_CONFIG.API_CONFIG.POLYGON.apiKey,
  };

  // Popular Indian Stocks
  private readonly POPULAR_STOCKS = INDIAN_MARKET_CONFIG.POPULAR_STOCKS.map(stock => stock.symbol);

  // Major Indices
  private readonly INDICES = Object.values(INDIAN_MARKET_CONFIG.INDICES).map(index => index.symbol);

  private async delay(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

  // Get Indian stock quote with multiple fallbacks
  async getIndianStockQuote(symbol: string): Promise<IndianStockQuote | null> {
    const cacheKey = `stock_${symbol}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Try Yahoo Finance first (most reliable for Indian stocks)
      const data = await this.getFromYahooFinance(symbol);
      if (data) {
        this.setCache(cacheKey, data);
        return data;
      }

      // Fallback to Alpha Vantage
      const alphaData = await this.getFromAlphaVantage(symbol);
      if (alphaData) {
        this.setCache(cacheKey, alphaData);
        return alphaData;
      }

      // Fallback to Polygon.io
      const polygonData = await this.getFromPolygon(symbol);
      if (polygonData) {
        this.setCache(cacheKey, polygonData);
        return polygonData;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return null;
    }
  }

  // Yahoo Finance API
  private async getFromYahooFinance(symbol: string): Promise<IndianStockQuote | null> {
    try {
      const response = await fetch(`${this.APIs.yahooFinance}${symbol}?interval=1d&range=1d`);
      if (!response.ok) return null;

      const data = await response.json();
      const result = data.chart.result[0];
      const quote = result.indicators.quote[0];
      const meta = result.meta;

      return {
        symbol: symbol.replace('.NS', ''),
        companyName: meta.symbol || symbol,
        currentPrice: meta.regularMarketPrice || 0,
        previousClose: meta.previousClose || 0,
        change: (meta.regularMarketPrice || 0) - (meta.previousClose || 0),
        changePercent: meta.regularMarketPrice && meta.previousClose 
          ? ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100 
          : 0,
        volume: quote.volume?.[0] || 0,
        marketCap: 0, // Not available in Yahoo Finance
        high: quote.high?.[0] || 0,
        low: quote.low?.[0] || 0,
        open: quote.open?.[0] || 0,
        dayHigh: quote.high?.[0] || 0,
        dayLow: quote.low?.[0] || 0,
        yearHigh: 0,
        yearLow: 0,
        pe: 0,
        pb: 0,
        dividendYield: 0,
        faceValue: 0,
        sector: '',
        industry: '',
        exchange: 'NSE',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      return null;
    }
  }

  // Alpha Vantage API
  private async getFromAlphaVantage(symbol: string): Promise<IndianStockQuote | null> {
    try {
      const response = await fetch(
        `${this.APIs.alphaVantage}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.API_KEYS.alphaVantage}`
      );
      if (!response.ok) return null;

      const data = await response.json();
      const quote = data['Global Quote'];
      if (!quote) return null;

      return {
        symbol: symbol.replace('.NS', ''),
        companyName: symbol,
        currentPrice: parseFloat(quote['05. price']) || 0,
        previousClose: parseFloat(quote['08. previous close']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')) || 0,
        volume: parseInt(quote['06. volume']) || 0,
        marketCap: 0,
        high: 0,
        low: 0,
        open: 0,
        dayHigh: 0,
        dayLow: 0,
        yearHigh: 0,
        yearLow: 0,
        pe: 0,
        pb: 0,
        dividendYield: 0,
        faceValue: 0,
        sector: '',
        industry: '',
        exchange: 'NSE',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      return null;
    }
  }

  // Polygon.io API
  private async getFromPolygon(symbol: string): Promise<IndianStockQuote | null> {
    try {
      const response = await fetch(
        `${this.APIs.polygon}/aggs/ticker/${symbol}/prev?apikey=${this.API_KEYS.polygon}`
      );
      if (!response.ok) return null;

      const data = await response.json();
      const result = data.results?.[0];
      if (!result) return null;

      return {
        symbol: symbol.replace('.NS', ''),
        companyName: symbol,
        currentPrice: result.c || 0,
        previousClose: result.pc || 0,
        change: (result.c || 0) - (result.pc || 0),
        changePercent: result.pc ? ((result.c - result.pc) / result.pc) * 100 : 0,
        volume: result.v || 0,
        marketCap: 0,
        high: result.h || 0,
        low: result.l || 0,
        open: result.o || 0,
        dayHigh: result.h || 0,
        dayLow: result.l || 0,
        yearHigh: 0,
        yearLow: 0,
        pe: 0,
        pb: 0,
        dividendYield: 0,
        faceValue: 0,
        sector: '',
        industry: '',
        exchange: 'NSE',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Polygon API error:', error);
      return null;
    }
  }

  // Get all major Indian indices
  async getIndianIndices(): Promise<IndianMarketData> {
    const cacheKey = 'indices';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const indices: any = {};

    // Fetch all indices in parallel
    const promises = this.INDICES.map(async (index) => {
      const data = await this.getIndianStockQuote(index);
      if (data) {
        const indexName = this.getIndexName(index);
        indices[indexName] = {
          symbol: index,
          name: this.getIndexDisplayName(index),
          currentValue: data.currentPrice,
          change: data.change,
          changePercent: data.changePercent,
          high: data.high,
          low: data.low,
          volume: data.volume,
          timestamp: data.timestamp
        };
      }
    });

    await Promise.all(promises);
    this.setCache(cacheKey, indices);
    return indices;
  }

  // Get popular Indian stocks
  async getPopularIndianStocks(): Promise<IndianStockQuote[]> {
    const cacheKey = 'popular_stocks';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const stocks: IndianStockQuote[] = [];

    // Fetch stocks in batches to avoid rate limiting
    for (let i = 0; i < this.POPULAR_STOCKS.length; i += 5) {
      const batch = this.POPULAR_STOCKS.slice(i, i + 5);
      const promises = batch.map(symbol => this.getIndianStockQuote(symbol));
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        if (result) stocks.push(result);
      });

      // Add delay between batches
      if (i + 5 < this.POPULAR_STOCKS.length) {
        await this.delay(1000);
      }
    }

    this.setCache(cacheKey, stocks);
    return stocks;
  }

  // Get top gainers and losers
  async getTopGainersLosers(): Promise<TopGainersLosers> {
    const cacheKey = 'gainers_losers';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const stocks = await this.getPopularIndianStocks();
    
    const sorted = stocks.sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sorted.slice(0, 10);
    const losers = sorted.slice(-10).reverse();
    const mostActive = stocks.sort((a, b) => b.volume - a.volume).slice(0, 10);

    const result = { gainers, losers, mostActive };
    this.setCache(cacheKey, result);
    return result;
  }

  // Search Indian stocks
  async searchIndianStocks(query: string): Promise<IndianStockQuote[]> {
    if (query.length < 2) return [];

    const allStocks = await this.getPopularIndianStocks();
    return allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get market depth (mock data for now)
  async getMarketDepth(symbol: string): Promise<MarketDepth | null> {
    const stock = await this.getIndianStockQuote(symbol);
    if (!stock) return null;

    // Generate mock market depth data
    const currentPrice = stock.currentPrice;
    const bids = [];
    const asks = [];

    for (let i = 1; i <= 5; i++) {
      bids.push({
        price: currentPrice - (i * 0.1),
        quantity: Math.floor(Math.random() * 1000) + 100
      });
      asks.push({
        price: currentPrice + (i * 0.1),
        quantity: Math.floor(Math.random() * 1000) + 100
      });
    }

    return {
      symbol,
      bids: bids.reverse(),
      asks,
      timestamp: Date.now()
    };
  }

  // Get options chain (mock data for now)
  async getOptionsChain(symbol: string): Promise<OptionsChain[]> {
    const stock = await this.getIndianStockQuote(symbol);
    if (!stock) return [];

    const currentPrice = stock.currentPrice;
    const options: OptionsChain[] = [];

    // Generate mock options data
    for (let i = -5; i <= 5; i++) {
      const strikePrice = currentPrice + (i * 10);
      options.push({
        symbol,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        strikePrice,
        callOI: Math.floor(Math.random() * 10000),
        callVolume: Math.floor(Math.random() * 1000),
        callLTP: Math.max(0, currentPrice - strikePrice + Math.random() * 5),
        putOI: Math.floor(Math.random() * 10000),
        putVolume: Math.floor(Math.random() * 1000),
        putLTP: Math.max(0, strikePrice - currentPrice + Math.random() * 5)
      });
    }

    return options;
  }

  // Helper methods
  private getIndexName(symbol: string): string {
    const mapping: { [key: string]: string } = {
      '^NSEI': 'nifty50',
      '^BSESN': 'sensex',
      '^NSEBANK': 'bankNifty',
      '^CNXIT': 'niftyIT',
      '^CNXPHARMA': 'niftyPharma',
      '^CNXAUTO': 'niftyAuto',
      '^CNXFMCG': 'niftyFMCG',
      '^CNXMETAL': 'niftyMetal',
      '^CNXREALTY': 'niftyRealty',
      '^CNXENERGY': 'niftyEnergy'
    };
    return mapping[symbol] || symbol;
  }

  private getIndexDisplayName(symbol: string): string {
    const mapping: { [key: string]: string } = {
      '^NSEI': 'Nifty 50',
      '^BSESN': 'S&P BSE Sensex',
      '^NSEBANK': 'Nifty Bank',
      '^CNXIT': 'Nifty IT',
      '^CNXPHARMA': 'Nifty Pharma',
      '^CNXAUTO': 'Nifty Auto',
      '^CNXFMCG': 'Nifty FMCG',
      '^CNXMETAL': 'Nifty Metal',
      '^CNXREALTY': 'Nifty Realty',
      '^CNXENERGY': 'Nifty Energy'
    };
    return mapping[symbol] || symbol;
  }

  // Get market status
  async getMarketStatus(): Promise<{ isOpen: boolean; nextOpen: string; nextClose: string }> {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Indian market hours: 9:15 AM to 3:30 PM (Monday to Friday)
    const isWeekday = day >= 1 && day <= 5;
    const currentTime = hour * 60 + minute;
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM

    const isOpen = isWeekday && currentTime >= marketOpen && currentTime <= marketClose;

    return {
      isOpen,
      nextOpen: isOpen ? 'Market is open' : 'Next open: Monday 9:15 AM',
      nextClose: isOpen ? 'Closes at 3:30 PM' : 'Market closed'
    };
  }
}

// Export singleton instance
export const indianMarketService = new IndianMarketService(); 