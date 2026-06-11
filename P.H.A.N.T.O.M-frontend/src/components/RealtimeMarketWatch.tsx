import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faMinus, faSync, faFlag, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { yahooFinanceAPI } from '../services/yahooFinanceAPI';
import { indianMarketAPI } from '../services/indianMarketAPI';

interface StockData {
  symbol: string;
  shortName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  isLoading?: boolean;
  market?: 'indian' | 'global';
}

const RealtimeMarketWatch = React.memo(() => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeMarket, setActiveMarket] = useState<'indian' | 'global'>('indian');

  // Default symbols for different markets
  const indianSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR'];
  const globalSymbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA'];

  // Fetch real market data
  const fetchMarketData = async () => {
    setIsRefreshing(true);
    
    try {
      let stockData: StockData[] = [];
      
      if (activeMarket === 'indian') {
        // Fetch Indian market data
        const quotes = await indianMarketAPI.getPopularIndianStocks();
        
        stockData = quotes.map(quote => ({
          symbol: quote.symbol,
          shortName: quote.companyName,
          price: quote.currentPrice,
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume,
          isLoading: false,
          market: 'indian' as const
        }));

        // Fill in any missing symbols with loading state
        const missingSymbols = indianSymbols.filter(
          symbol => !quotes.find(quote => quote.symbol === symbol)
        );
        
        missingSymbols.forEach(symbol => {
          stockData.push({
            symbol,
            shortName: symbol,
            price: 0,
            change: 0,
            changePercent: 0,
            volume: 0,
            isLoading: true,
            market: 'indian' as const
          });
        });
      } else {
        // Fetch global market data
        const quotes = await yahooFinanceAPI.getMultipleQuotes(globalSymbols);
        
        stockData = quotes.map(quote => ({
          symbol: quote.symbol,
          shortName: quote.shortName,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          volume: quote.regularMarketVolume,
          isLoading: false,
          market: 'global' as const
        }));

        // Fill in any missing symbols with loading state
        const missingSymbols = globalSymbols.filter(
          symbol => !quotes.find(quote => quote.symbol === symbol)
        );
        
        missingSymbols.forEach(symbol => {
          stockData.push({
            symbol,
            shortName: symbol,
            price: 0,
            change: 0,
            changePercent: 0,
            volume: 0,
            isLoading: true,
            market: 'global' as const
          });
        });
      }

      setStocks(stockData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      
      // Fallback to mock data if API fails
      const mockData: StockData[] = activeMarket === 'indian' ? [
        { symbol: 'RELIANCE', shortName: 'Reliance Industries', price: 2450.75, change: 15.20, changePercent: 0.62, volume: 52840000, market: 'indian' },
        { symbol: 'TCS', shortName: 'Tata Consultancy', price: 3820.50, change: -8.30, changePercent: -0.22, volume: 28450000, market: 'indian' },
        { symbol: 'HDFCBANK', shortName: 'HDFC Bank', price: 1520.10, change: 5.90, changePercent: 0.39, volume: 25670000, market: 'indian' },
        { symbol: 'INFY', shortName: 'Infosys Ltd', price: 1600.25, change: 10.50, changePercent: 0.66, volume: 31580000, market: 'indian' },
        { symbol: 'ICICIBANK', shortName: 'ICICI Bank', price: 950.30, change: -3.10, changePercent: -0.33, volume: 22140000, market: 'indian' },
        { symbol: 'HINDUNILVR', shortName: 'Hindustan Unilever', price: 820.00, change: 7.20, changePercent: 0.88, volume: 18950000, market: 'indian' }
      ] : [
        { symbol: 'AAPL', shortName: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, volume: 52840000, market: 'global' },
        { symbol: 'MSFT', shortName: 'Microsoft Corp.', price: 378.85, change: -1.20, changePercent: -0.32, volume: 28450000, market: 'global' },
        { symbol: 'GOOGL', shortName: 'Alphabet Inc.', price: 142.56, change: 0.85, changePercent: 0.60, volume: 25670000, market: 'global' },
        { symbol: 'TSLA', shortName: 'Tesla Inc.', price: 248.50, change: -5.30, changePercent: -2.09, volume: 95230000, market: 'global' },
        { symbol: 'AMZN', shortName: 'Amazon.com Inc.', price: 152.74, change: 1.85, changePercent: 1.23, volume: 31580000, market: 'global' },
        { symbol: 'NVDA', shortName: 'NVIDIA Corp.', price: 875.30, change: 12.45, changePercent: 1.44, volume: 22140000, market: 'global' }
      ];
      setStocks(mockData);
    }
    
    setIsRefreshing(false);
  };

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchMarketData();
    
    // Refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, [activeMarket]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return faArrowUp;
    if (change < 0) return faArrowDown;
    return faMinus;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const formatCurrency = (price: number, market: 'indian' | 'global') => {
    if (market === 'indian') {
      return `₹${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-cyan-400">
          Real-time Market Watch
        </h3>
        <div className="flex items-center space-x-4">
          {/* Market Toggle */}
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setActiveMarket('indian')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1 ${
                activeMarket === 'indian'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faFlag} />
              <span>Indian</span>
            </button>
            <button
              onClick={() => setActiveMarket('global')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1 ${
                activeMarket === 'global'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faGlobe} />
              <span>Global</span>
            </button>
          </div>
          
          <span className="text-xs text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchMarketData}
            disabled={isRefreshing}
            title="Refresh market data"
            className={`p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all ${
              isRefreshing ? 'animate-pulse cursor-not-allowed' : ''
            }`}
          >
            <FontAwesomeIcon 
              icon={faSync} 
              className={isRefreshing ? 'animate-spin' : ''} 
            />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-600/40 rounded-lg transition-all duration-300"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    {stock.symbol}
                  </h4>
                  <p className="text-xs text-gray-400 truncate max-w-32">
                    {stock.shortName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Price */}
              <div className="text-right">
                <p className="font-semibold text-white">
                  {stock.isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    formatCurrency(stock.price, stock.market || 'indian')
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  Vol: {stock.isLoading ? '-' : formatNumber(stock.volume)}
                </p>
              </div>

              {/* Change */}
              <div className={`text-right ${getTrendColor(stock.change)}`}>
                <div className="flex items-center space-x-1">
                  {!stock.isLoading && (
                    <FontAwesomeIcon 
                      icon={getTrendIcon(stock.change)} 
                      className="text-xs" 
                    />
                  )}
                  <span className="font-semibold text-sm">
                    {stock.isLoading ? '-' : stock.change.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs">
                  {stock.isLoading ? '-' : `${stock.changePercent.toFixed(2)}%`}
                </p>
              </div>

              {/* Trend Indicator */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-600/50">
                {stock.isLoading ? (
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
                ) : (
                  <FontAwesomeIcon
                    icon={getTrendIcon(stock.change)}
                    className={`text-sm ${getTrendColor(stock.change)}`}
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Powered by notice */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-500 text-center">
          Powered by {activeMarket === 'indian' ? 'Indian Market APIs' : 'Yahoo Finance API'} • Data may be delayed up to 20 minutes
        </p>
      </div>
    </div>
  );
});

RealtimeMarketWatch.displayName = 'RealtimeMarketWatch';

export default RealtimeMarketWatch; 