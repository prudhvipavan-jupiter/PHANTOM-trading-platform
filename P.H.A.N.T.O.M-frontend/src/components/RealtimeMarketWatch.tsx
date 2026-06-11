import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faMinus, faSync, faFlag, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { api } from '../utils/api';
import type { LiveQuote } from '../services/phantomApi';

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

function mapQuote(quote: LiveQuote, market: 'indian' | 'global'): StockData {
  const price = quote.price ?? quote.currentPrice ?? 0;
  return {
    symbol: quote.symbol.replace('.NS', '').replace('.BO', ''),
    shortName: quote.symbolName || quote.symbol,
    price,
    change: quote.change ?? 0,
    changePercent: quote.changePercent ?? 0,
    volume: quote.volume ?? 0,
    isLoading: false,
    market,
  };
}

const RealtimeMarketWatch = React.memo(() => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeMarket, setActiveMarket] = useState<'indian' | 'global'>('indian');
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const quotes = activeMarket === 'indian'
        ? await api.getLiveIndianMarket()
        : await api.getLiveGlobalMarket();
      const stockData = (quotes as LiveQuote[]).map((q) => mapQuote(q, activeMarket));
      setStocks(stockData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch market data:', err);
      setError((err as Error).message);
      setStocks([]);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeMarket]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

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
    if (market === 'indian') return `₹${price.toFixed(2)}`;
    if (price > 100) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-cyan-400">Real-time Market Watch</h3>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setActiveMarket('indian')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1 ${
                activeMarket === 'indian' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faFlag} />
              <span>Indian</span>
            </button>
            <button
              onClick={() => setActiveMarket('global')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1 ${
                activeMarket === 'global' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faGlobe} />
              <span>Global</span>
            </button>
          </div>
          <span className="text-xs text-gray-400">Updated: {lastUpdate.toLocaleTimeString()}</span>
          <button
            onClick={fetchMarketData}
            disabled={isRefreshing}
            title="Refresh market data"
            className={`p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white ${isRefreshing ? 'animate-pulse' : ''}`}
          >
            <FontAwesomeIcon icon={faSync} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">Market data error: {error}</p>}

      <div className="space-y-3">
        {stocks.length === 0 && !isRefreshing && (
          <p className="text-gray-400 text-sm text-center py-4">No market data available.</p>
        )}
        {stocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-600/40 rounded-lg"
          >
            <div>
              <h4 className="font-semibold text-white text-sm">{stock.symbol}</h4>
              <p className="text-xs text-gray-400 truncate max-w-32">{stock.shortName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-white">{formatCurrency(stock.price, stock.market || 'indian')}</p>
                <p className="text-xs text-gray-400">Vol: {formatNumber(stock.volume)}</p>
              </div>
              <div className={`text-right ${getTrendColor(stock.change)}`}>
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={getTrendIcon(stock.change)} className="text-xs" />
                  <span className="font-semibold text-sm">{stock.change.toFixed(2)}</span>
                </div>
                <p className="text-xs">{stock.changePercent.toFixed(2)}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-500 text-center">
          Live NSE/BSE prices (Yahoo fallback for global) · Paper trading only
        </p>
      </div>
    </div>
  );
});

RealtimeMarketWatch.displayName = 'RealtimeMarketWatch';

export default RealtimeMarketWatch;
