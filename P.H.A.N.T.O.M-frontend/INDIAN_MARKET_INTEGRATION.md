# 🇮🇳 P.H.A.N.T.O.M Indian Market Integration

## Overview

P.H.A.N.T.O.M has been enhanced with comprehensive Indian stock market data integration, providing real-time market data, indices, and analysis tools specifically designed for the Indian market.

## 🚀 Features

### 📊 Real-Time Market Data
- **Live Stock Quotes**: Real-time prices for 40+ major Indian stocks
- **Market Indices**: Nifty 50, Sensex, Bank Nifty, and sector-specific indices
- **Top Gainers/Losers**: Daily market movers
- **Volume Analysis**: Trading volume and market activity
- **Market Status**: Real-time market open/close status

### 🏢 Comprehensive Stock Coverage
- **Nifty 50 Stocks**: All major index constituents
- **Sector-wise Classification**: Banking, IT, FMCG, Auto, Pharma, etc.
- **Large Cap Focus**: Emphasis on stable, liquid stocks
- **Popular Stocks**: Most traded and watched stocks

### 📈 Multiple Data Sources
- **Primary**: Yahoo Finance (Free, reliable)
- **Secondary**: Alpha Vantage (Free tier)
- **Tertiary**: Polygon.io (Free tier)
- **Fallback**: Multiple sources for data reliability

### 🎯 Indian Market Specific Features
- **Indian Market Hours**: 9:15 AM - 3:30 PM IST
- **Rupee Formatting**: All prices in ₹ (Indian Rupees)
- **Indian Numbering**: Lakhs, Crores format
- **Market Events**: Earnings seasons, Budget day, RBI meetings

## 📁 File Structure

```
src/
├── services/
│   └── indianMarketService.ts          # Main Indian market data service
├── components/
│   └── IndianMarketWatch.tsx           # Indian market watch component
├── config/
│   └── indianMarketConfig.ts           # Configuration and constants
└── pages/
    └── MarketWatch/
        └── MarketWatch.tsx             # Enhanced with Indian market section
```

## 🔧 Configuration

### API Keys Setup

To get the best data quality, you can add your API keys:

1. **Alpha Vantage** (Free tier: 5 requests/minute)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Get free API key
   - Update in `config/indianMarketConfig.ts`

2. **Polygon.io** (Free tier: 5 requests/minute)
   - Visit: https://polygon.io/
   - Get free API key
   - Update in `config/indianMarketConfig.ts`

### Configuration File

```typescript
// src/config/indianMarketConfig.ts
export const INDIAN_MARKET_CONFIG = {
  API_CONFIG: {
    ALPHA_VANTAGE: {
      apiKey: 'YOUR_API_KEY_HERE', // Replace with your key
    },
    POLYGON: {
      apiKey: 'YOUR_API_KEY_HERE', // Replace with your key
    }
  }
}
```

## 📊 Available Data

### Major Indices
- **Nifty 50** (^NSEI): National Stock Exchange 50
- **Sensex** (^BSESN): S&P BSE Sensitive Index
- **Bank Nifty** (^NSEBANK): Banking Sector Index
- **Nifty IT** (^CNXIT): Information Technology Index
- **Nifty Pharma** (^CNXPHARMA): Pharmaceutical Index
- **Nifty Auto** (^CNXAUTO): Automobile Index
- **Nifty FMCG** (^CNXFMCG): Fast Moving Consumer Goods Index
- **Nifty Metal** (^CNXMETAL): Metal Index
- **Nifty Realty** (^CNXREALTY): Real Estate Index
- **Nifty Energy** (^CNXENERGY): Energy Index

### Popular Stocks (40+ stocks)
- **Banking**: HDFC Bank, ICICI Bank, SBI, Kotak Bank, Axis Bank
- **Technology**: TCS, Infosys, Wipro, Tech Mahindra, HCL Tech
- **Oil & Gas**: Reliance Industries, ONGC
- **FMCG**: HUL, ITC, Nestle India, Marico
- **Automobile**: Tata Motors, Maruti Suzuki, M&M, Bajaj Auto
- **Healthcare**: Sun Pharma, Dr. Reddy's, Cipla, Divi's Labs
- **And many more...**

## 🎨 UI Components

### Indian Market Watch Component

The `IndianMarketWatch` component provides:

- **Market Status**: Real-time open/close status
- **Indices Tab**: All major Indian indices with live data
- **Popular Stocks Tab**: 40+ major stocks with prices and changes
- **Top Gainers Tab**: Daily top performing stocks
- **Top Losers Tab**: Daily worst performing stocks
- **Auto-refresh**: Updates every 30 seconds
- **Responsive Design**: Works on all screen sizes

### Integration with Market Watch

The Indian market data is integrated into the main Market Watch page as a dedicated section, providing seamless access to both global and Indian market data.

## 🔄 Data Refresh

- **Stock Quotes**: 30 seconds cache
- **Market Data**: 1 minute cache
- **Indices**: 30 seconds cache
- **Gainers/Losers**: 1 minute cache
- **Market Status**: 5 minutes cache

## 🛠️ Usage Examples

### Get Stock Quote
```typescript
import { indianMarketService } from '../services/indianMarketService';

const stockData = await indianMarketService.getIndianStockQuote('RELIANCE.NS');
console.log(stockData);
// Output: { symbol: 'RELIANCE', currentPrice: 2450.50, change: 25.30, ... }
```

### Get All Indices
```typescript
const indices = await indianMarketService.getIndianIndices();
console.log(indices.nifty50);
// Output: { symbol: '^NSEI', name: 'Nifty 50', currentValue: 19500.25, ... }
```

### Get Top Gainers/Losers
```typescript
const marketMovers = await indianMarketService.getTopGainersLosers();
console.log(marketMovers.gainers); // Top 10 gainers
console.log(marketMovers.losers);  // Top 10 losers
```

### Search Stocks
```typescript
const searchResults = await indianMarketService.searchIndianStocks('TCS');
console.log(searchResults);
// Output: Array of stocks matching 'TCS'
```

## 🎯 Market Hours

Indian market operates from:
- **Pre-market**: 9:00 AM - 9:08 AM IST
- **Regular Market**: 9:15 AM - 3:30 PM IST
- **Post-market**: 3:40 PM - 4:00 PM IST
- **Days**: Monday to Friday (excluding holidays)

## 📱 Mobile Responsive

All Indian market components are fully responsive and work seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Data Reliability

The system uses multiple fallback mechanisms:

1. **Primary Source**: Yahoo Finance (most reliable)
2. **Secondary Source**: Alpha Vantage (if Yahoo fails)
3. **Tertiary Source**: Polygon.io (if others fail)
4. **Caching**: Reduces API calls and improves performance
5. **Error Handling**: Graceful degradation if APIs are unavailable

## 🚀 Performance Optimizations

- **Intelligent Caching**: Reduces API calls
- **Batch Processing**: Fetches multiple stocks efficiently
- **Rate Limiting**: Respects API limits
- **Lazy Loading**: Loads data only when needed
- **Error Recovery**: Automatic retry mechanisms

## 🔮 Future Enhancements

Planned features for Indian market integration:

- **Options Chain Data**: F&O market data
- **Market Depth**: Level 2 market data
- **Technical Indicators**: RSI, MACD, Bollinger Bands
- **News Integration**: Indian market news
- **Alerts**: Price alerts for Indian stocks
- **Portfolio Tracking**: Indian stock portfolio
- **Screener**: Advanced stock screening
- **Charts**: Interactive price charts

## 📞 Support

For issues or questions about Indian market integration:

1. Check the console for error messages
2. Verify API keys are correctly configured
3. Ensure internet connection is stable
4. Check if market is open (data may be limited outside market hours)

## 🎉 Getting Started

1. **Login** to P.H.A.N.T.O.M
2. **Navigate** to Market Watch
3. **Scroll down** to find the Indian Market section
4. **Explore** different tabs (Indices, Stocks, Gainers, Losers)
5. **Refresh** data manually or wait for auto-refresh

The Indian market integration is now fully functional and ready for use! 🇮🇳 