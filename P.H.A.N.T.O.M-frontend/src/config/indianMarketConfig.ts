// P.H.A.N.T.O.M Indian Market Configuration
// Comprehensive configuration for Indian stock market data

export const INDIAN_MARKET_CONFIG = {
  // Major Indian Indices
  INDICES: {
    NIFTY_50: {
      symbol: '^NSEI',
      name: 'Nifty 50',
      description: 'National Stock Exchange 50',
      sector: 'Index'
    },
    SENSEX: {
      symbol: '^BSESN',
      name: 'S&P BSE Sensex',
      description: 'Bombay Stock Exchange Sensitive Index',
      sector: 'Index'
    },
    BANK_NIFTY: {
      symbol: '^NSEBANK',
      name: 'Nifty Bank',
      description: 'Banking Sector Index',
      sector: 'Banking'
    },
    NIFTY_IT: {
      symbol: '^CNXIT',
      name: 'Nifty IT',
      description: 'Information Technology Index',
      sector: 'Technology'
    },
    NIFTY_PHARMA: {
      symbol: '^CNXPHARMA',
      name: 'Nifty Pharma',
      description: 'Pharmaceutical Index',
      sector: 'Healthcare'
    },
    NIFTY_AUTO: {
      symbol: '^CNXAUTO',
      name: 'Nifty Auto',
      description: 'Automobile Index',
      sector: 'Automobile'
    },
    NIFTY_FMCG: {
      symbol: '^CNXFMCG',
      name: 'Nifty FMCG',
      description: 'Fast Moving Consumer Goods Index',
      sector: 'FMCG'
    },
    NIFTY_METAL: {
      symbol: '^CNXMETAL',
      name: 'Nifty Metal',
      description: 'Metal Index',
      sector: 'Metals'
    },
    NIFTY_REALTY: {
      symbol: '^CNXREALTY',
      name: 'Nifty Realty',
      description: 'Real Estate Index',
      sector: 'Real Estate'
    },
    NIFTY_ENERGY: {
      symbol: '^CNXENERGY',
      name: 'Nifty Energy',
      description: 'Energy Index',
      sector: 'Energy'
    }
  },

  // Popular Indian Stocks (Nifty 50 + Major Stocks)
  POPULAR_STOCKS: [
    // Banking & Financial Services
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
    { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
    { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
    { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking' },
    { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'Financial Services' },

    // Technology
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Technology' },
    { symbol: 'INFY.NS', name: 'Infosys', sector: 'Technology' },
    { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'Technology' },
    { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'Technology' },
    { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'Technology' },

    // Oil & Gas
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Oil & Gas' },
    { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corporation', sector: 'Oil & Gas' },

    // Consumer Goods
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG' },
    { symbol: 'ITC.NS', name: 'ITC', sector: 'FMCG' },
    { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'FMCG' },
    { symbol: 'MARICO.NS', name: 'Marico', sector: 'FMCG' },

    // Automobile
    { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Automobile' },
    { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India', sector: 'Automobile' },
    { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Automobile' },
    { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto', sector: 'Automobile' },

    // Healthcare
    { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries', sector: 'Healthcare' },
    { symbol: 'DRREDDY.NS', name: 'Dr. Reddy\'s Laboratories', sector: 'Healthcare' },
    { symbol: 'CIPLA.NS', name: 'Cipla', sector: 'Healthcare' },
    { symbol: 'DIVISLAB.NS', name: 'Divi\'s Laboratories', sector: 'Healthcare' },

    // Telecom
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecom' },

    // Consumer Durables
    { symbol: 'TITAN.NS', name: 'Titan Company', sector: 'Consumer Durables' },

    // Construction & Materials
    { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Construction' },
    { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Construction' },

    // Metals
    { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metals' },
    { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metals' },
    { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metals' },

    // Power
    { symbol: 'NTPC.NS', name: 'NTPC', sector: 'Power' },
    { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation', sector: 'Power' },

    // Real Estate
    { symbol: 'DLF.NS', name: 'DLF', sector: 'Real Estate' },
    { symbol: 'GODREJPROP.NS', name: 'Godrej Properties', sector: 'Real Estate' }
  ],

  // Market Hours (IST)
  MARKET_HOURS: {
    PRE_MARKET: { start: '09:00', end: '09:08' },
    REGULAR_MARKET: { start: '09:15', end: '15:30' },
    POST_MARKET: { start: '15:40', end: '16:00' },
    WEEKDAYS: [1, 2, 3, 4, 5], // Monday to Friday
    TIMEZONE: 'Asia/Kolkata'
  },

  // API Configuration
  API_CONFIG: {
    // Yahoo Finance (Primary - Free)
    YAHOO_FINANCE: {
      baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart/',
      rateLimit: 100, // requests per minute
      timeout: 10000
    },

    // Alpha Vantage (Secondary - Free tier available)
    ALPHA_VANTAGE: {
      baseUrl: 'https://www.alphavantage.co/query',
      apiKey: 'demo', // Replace with your key
      rateLimit: 5, // requests per minute (free tier)
      timeout: 15000
    },

    // Polygon.io (Tertiary - Free tier available)
    POLYGON: {
      baseUrl: 'https://api.polygon.io/v2',
      apiKey: 'demo', // Replace with your key
      rateLimit: 5, // requests per minute (free tier)
      timeout: 15000
    },

    // NSE India (Unofficial - Use with caution)
    NSE_INDIA: {
      baseUrl: 'https://www.nseindia.com/api',
      rateLimit: 10,
      timeout: 20000
    },

    // Money Control (Unofficial - Use with caution)
    MONEY_CONTROL: {
      baseUrl: 'https://www.moneycontrol.com/api',
      rateLimit: 10,
      timeout: 20000
    },

    // Screener.in (Free)
    SCREENER: {
      baseUrl: 'https://www.screener.in/api',
      rateLimit: 20,
      timeout: 15000
    }
  },

  // Cache Configuration
  CACHE_CONFIG: {
    STOCK_QUOTE: 30000, // 30 seconds
    MARKET_DATA: 60000, // 1 minute
    INDICES: 30000, // 30 seconds
    GAINERS_LOSERS: 60000, // 1 minute
    MARKET_STATUS: 300000 // 5 minutes
  },

  // Trading Categories
  TRADING_CATEGORIES: {
    LARGE_CAP: 'Large Cap',
    MID_CAP: 'Mid Cap',
    SMALL_CAP: 'Small Cap',
    PENNY_STOCKS: 'Penny Stocks',
    FNO: 'F&O Stocks',
    INDEX: 'Index'
  },

  // Sector Classification
  SECTORS: [
    'Banking',
    'Technology',
    'Oil & Gas',
    'FMCG',
    'Automobile',
    'Healthcare',
    'Telecom',
    'Consumer Durables',
    'Construction',
    'Metals',
    'Power',
    'Real Estate',
    'Financial Services',
    'Pharmaceuticals',
    'Energy',
    'Infrastructure',
    'Media',
    'Retail',
    'Agriculture',
    'Logistics'
  ],

  // Popular Stock Combinations for Analysis
  STOCK_COMBINATIONS: {
    BANKING_PACK: ['HDFCBANK.NS', 'ICICIBANK.NS', 'SBIN.NS', 'KOTAKBANK.NS', 'AXISBANK.NS'],
    TECH_PACK: ['TCS.NS', 'INFY.NS', 'WIPRO.NS', 'TECHM.NS', 'HCLTECH.NS'],
    FMCG_PACK: ['HINDUNILVR.NS', 'ITC.NS', 'NESTLEIND.NS', 'MARICO.NS'],
    AUTO_PACK: ['TATAMOTORS.NS', 'MARUTI.NS', 'M&M.NS', 'BAJAJ-AUTO.NS'],
    PHARMA_PACK: ['SUNPHARMA.NS', 'DRREDDY.NS', 'CIPLA.NS', 'DIVISLAB.NS'],
    METAL_PACK: ['TATASTEEL.NS', 'JSWSTEEL.NS', 'HINDALCO.NS']
  },

  // Market Events
  MARKET_EVENTS: {
    EARNINGS_SEASON: {
      Q1: { start: '07-01', end: '07-31' },
      Q2: { start: '10-01', end: '10-31' },
      Q3: { start: '01-01', end: '01-31' },
      Q4: { start: '04-01', end: '04-30' }
    },
    BUDGET_DAY: '02-01',
    RBI_POLICY_MEETINGS: [
      '02-08', '04-06', '06-08', '08-10', '10-06', '12-08'
    ]
  },

  // Risk Levels
  RISK_LEVELS: {
    LOW: { color: '#00ff00', description: 'Low Risk - Stable stocks' },
    MEDIUM: { color: '#ffff00', description: 'Medium Risk - Growth stocks' },
    HIGH: { color: '#ff0000', description: 'High Risk - Volatile stocks' }
  }
};

// Helper functions
export const getStockBySymbol = (symbol: string) => {
  return INDIAN_MARKET_CONFIG.POPULAR_STOCKS.find(stock => stock.symbol === symbol);
};

export const getStocksBySector = (sector: string) => {
  return INDIAN_MARKET_CONFIG.POPULAR_STOCKS.filter(stock => stock.sector === sector);
};

export const getIndexBySymbol = (symbol: string) => {
  return Object.values(INDIAN_MARKET_CONFIG.INDICES).find(index => index.symbol === symbol);
};

export const isMarketOpen = (): boolean => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  const isWeekday = INDIAN_MARKET_CONFIG.MARKET_HOURS.WEEKDAYS.includes(day);
  const currentTime = hour * 60 + minute;
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return isWeekday && currentTime >= marketOpen && currentTime <= marketClose;
};

export const getNextMarketOpen = (): string => {
  const now = new Date();
  const day = now.getDay();
  
  if (day === 0) return 'Monday 9:15 AM'; // Sunday
  if (day === 6) return 'Monday 9:15 AM'; // Saturday
  if (day >= 1 && day <= 5) {
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;
    const marketOpen = 9 * 60 + 15;
    
    if (currentTime < marketOpen) {
      return 'Today 9:15 AM';
    } else {
      return 'Tomorrow 9:15 AM';
    }
  }
  
  return 'Monday 9:15 AM';
}; 