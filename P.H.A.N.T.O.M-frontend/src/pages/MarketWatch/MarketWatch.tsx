import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faStar,
  faArrowUp,
  faArrowDown,
  faMinus,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import IndianMarketWatch from '../../components/IndianMarketWatch';
import { api } from '../../utils/api';
import type { LiveQuote } from '../../services/phantomApi';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  high24h: number;
  low24h: number;
  open: number;
  previousClose: number;
  trend: 'up' | 'down' | 'sideways';
  category: 'CRYPTO' | 'STOCKS' | 'FOREX' | 'COMMODITIES';
  isFavorite: boolean;
  isWatched: boolean;
  technicalIndicators: {
    rsi: number;
    macd: number;
    bollingerUpper: number;
    bollingerLower: number;
    movingAverage20: number;
    movingAverage50: number;
  };
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  relatedSymbols: string[];
}

interface TradingSignal {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  potential: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: Date;
}

const generateMarketData = (): MarketData[] => [
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    price: 45230.50,
    change: 1125.30,
    changePercent: 2.55,
    volume: '2.3B',
    marketCap: '890.5B',
    high24h: 45800,
    low24h: 44500,
    open: 44105.20,
    previousClose: 44105.20,
    trend: 'up',
    category: 'CRYPTO',
    isFavorite: true,
    isWatched: true,
    technicalIndicators: {
      rsi: 65.2,
      macd: 245.6,
      bollingerUpper: 46500,
      bollingerLower: 43500,
      movingAverage20: 44800,
      movingAverage50: 44200
    }
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    price: 2845.20,
    change: -35.80,
    changePercent: -1.24,
    volume: '1.8B',
    marketCap: '342.1B',
    high24h: 2900,
    low24h: 2800,
    open: 2881.00,
    previousClose: 2881.00,
    trend: 'down',
    category: 'CRYPTO',
    isFavorite: false,
    isWatched: true,
    technicalIndicators: {
      rsi: 42.8,
      macd: -12.3,
      bollingerUpper: 2950,
      bollingerLower: 2750,
      movingAverage20: 2850,
      movingAverage50: 2900
    }
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2520.75,
    change: 21.25,
    changePercent: 0.85,
    volume: '850M',
    marketCap: '1.7T',
    high24h: 2540,
    low24h: 2500,
    open: 2499.50,
    previousClose: 2499.50,
    trend: 'up',
    category: 'STOCKS',
    isFavorite: true,
    isWatched: false,
    technicalIndicators: {
      rsi: 58.7,
      macd: 15.2,
      bollingerUpper: 2560,
      bollingerLower: 2480,
      movingAverage20: 2510,
      movingAverage50: 2490
    }
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3845.30,
    change: 42.80,
    changePercent: 1.12,
    volume: '620M',
    marketCap: '1.4T',
    high24h: 3860,
    low24h: 3820,
    open: 3802.50,
    previousClose: 3802.50,
    trend: 'up',
    category: 'STOCKS',
    isFavorite: false,
    isWatched: true,
    technicalIndicators: {
      rsi: 62.3,
      macd: 28.5,
      bollingerUpper: 3880,
      bollingerLower: 3780,
      movingAverage20: 3830,
      movingAverage50: 3810
    }
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    price: 1.0925,
    change: -0.0015,
    changePercent: -0.14,
    volume: '450M',
    marketCap: 'N/A',
    high24h: 1.0950,
    low24h: 1.0900,
    open: 1.0940,
    previousClose: 1.0940,
    trend: 'down',
    category: 'FOREX',
    isFavorite: false,
    isWatched: false,
    technicalIndicators: {
      rsi: 45.6,
      macd: -0.002,
      bollingerUpper: 1.0980,
      bollingerLower: 1.0880,
      movingAverage20: 1.0930,
      movingAverage50: 1.0950
    }
  },
  {
    symbol: 'GOLD',
    name: 'Gold',
    price: 1985.40,
    change: 14.80,
    changePercent: 0.75,
    volume: '320M',
    marketCap: 'N/A',
    high24h: 1990,
    low24h: 1975,
    open: 1970.60,
    previousClose: 1970.60,
    trend: 'up',
    category: 'COMMODITIES',
    isFavorite: true,
    isWatched: true,
    technicalIndicators: {
      rsi: 68.9,
      macd: 8.5,
      bollingerUpper: 2000,
      bollingerLower: 1960,
      movingAverage20: 1980,
      movingAverage50: 1970
    }
  }
];

function mapQuoteToMarketData(quote: LiveQuote, category: MarketData['category']): MarketData {
  const price = quote.price ?? quote.currentPrice ?? 0;
  const change = quote.change ?? 0;
  const changePercent = quote.changePercent ?? 0;
  return {
    symbol: quote.symbol,
    name: quote.symbolName || quote.symbol,
    price,
    change,
    changePercent,
    volume: String(quote.volume ?? 0),
    marketCap: quote.marketCap ? String(quote.marketCap) : '—',
    high24h: quote.high ?? price,
    low24h: quote.low ?? price,
    open: quote.open ?? price,
    previousClose: quote.previousClose ?? price,
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'sideways',
    category,
    isFavorite: false,
    isWatched: false,
    technicalIndicators: {
      rsi: Math.min(100, Math.max(0, 50 + changePercent * 5)),
      macd: change,
      bollingerUpper: price * 1.02,
      bollingerLower: price * 0.98,
      movingAverage20: price,
      movingAverage50: quote.previousClose ?? price,
    },
  };
}

function deriveSignals(data: MarketData[]): TradingSignal[] {
  return data.slice(0, 8).map((item) => {
    const signal: TradingSignal['signal'] =
      item.changePercent > 1 ? 'BUY' : item.changePercent < -1 ? 'SELL' : 'HOLD';
    return {
      symbol: item.symbol,
      signal,
      confidence: Math.min(95, Math.round(Math.abs(item.changePercent) * 15 + 50)),
      reasoning: `Live move ${item.changePercent.toFixed(2)}% — momentum indicator only, not financial advice.`,
      potential: `${item.changePercent >= 0 ? '+' : ''}${item.changePercent.toFixed(2)}%`,
      risk: Math.abs(item.changePercent) > 2 ? 'HIGH' : 'MEDIUM',
      timestamp: new Date(),
    };
  });
}

const MarketWatch = React.memo(() => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [newsData] = useState<NewsItem[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [priceHistory, setPriceHistory] = useState<Array<{ time: string; price: number; volume: number }>>([]);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MarketData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory] = useState<'ALL' | MarketData['category']>('ALL');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWatched, setShowWatched] = useState(false);
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('1D');

  const fetchLiveMarkets = async () => {
    setMarketError(null);
    try {
      const [indian, global] = await Promise.all([
        api.getLiveIndianMarket(),
        api.getLiveGlobalMarket(),
      ]);
      const indianRows = (indian as LiveQuote[]).map((q) => mapQuoteToMarketData(q, 'STOCKS'));
      const globalRows = (global as LiveQuote[]).map((q) =>
        mapQuoteToMarketData(q, q.symbol.includes('-USD') ? 'CRYPTO' : 'STOCKS'),
      );
      const combined = [...indianRows, ...globalRows];
      setMarketData(combined);
      setTradingSignals(deriveSignals(combined));
    } catch (e) {
      setMarketError((e as Error).message);
    }
  };

  useEffect(() => {
    fetchLiveMarkets();
    const interval = setInterval(fetchLiveMarkets, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedAsset) return;
    const range = timeframe === '1H' || timeframe === '4H' ? '5d' : timeframe === '1W' ? '3mo' : '1mo';
    api.getHistorical(selectedAsset.symbol, range).then((rows) => {
      setPriceHistory(
        rows.map((r, i) => ({
          time: r.date || String(i),
          price: r.price,
          volume: 0,
        })),
      );
    }).catch(() => setPriceHistory([]));
  }, [selectedAsset, timeframe]);

  const toggleFavorite = (symbol: string) => {
    setMarketData(prev => prev.map(item => 
      item.symbol === symbol ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const toggleWatched = (symbol: string) => {
    setMarketData(prev => prev.map(item => 
      item.symbol === symbol ? { ...item, isWatched: !item.isWatched } : item
    ));
  };

  const filteredData = marketData.filter(item => {
    const matchesSearch = item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesFavorites = !showFavorites || item.isFavorite;
    const matchesWatched = !showWatched || item.isWatched;
    
    return matchesSearch && matchesCategory && matchesFavorites && matchesWatched;
  });

  const getTrendIcon = (trend: MarketData['trend']) => {
    switch (trend) {
      case 'up': return faArrowUp;
      case 'down': return faArrowDown;
      case 'sideways': return faMinus;
      default: return faMinus;
    }
  };

  const getTrendColor = (trend: MarketData['trend']) => {
    switch (trend) {
      case 'up': return 'text-[#00f2ff]';
      case 'down': return 'text-[#ff4500]';
      case 'sideways': return 'text-[#f0b323]';
      default: return 'text-gray-400';
    }
  };

  const getSentimentColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'text-[#00f2ff]';
      case 'negative': return 'text-[#ff4500]';
      case 'neutral': return 'text-[#f0b323]';
      default: return 'text-gray-400';
    }
  };

  const getImpactColor = (impact: NewsItem['impact']) => {
    switch (impact) {
      case 'high': return 'bg-[#ff4500] text-white';
      case 'medium': return 'bg-[#f0b323] text-black';
      case 'low': return 'bg-[#00f2ff] text-black';
      default: return 'bg-gray-600 text-white';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="p-6 flex flex-col bg-[#1a1a1a] h-screen overflow-y-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#3a3a3a] mb-6">
        <div>
          <h1 className="phantom-title text-4xl mb-1">📊 Market Watch</h1>
          {marketError && <p className="text-red-400 text-sm mt-2">{marketError}</p>}
          <p className="phantom-subtitle text-lg">
            Browse 5,000+ NSE/BSE symbols with live prices — search like any broker terminal (scroll down for full list)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {['1H', '4H', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-[#00f2ff] text-black'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Filters and Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <select 
                    className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as "1H" | "4H" | "1D" | "1W")}
                    title="Timeframe"
                  >
                    <option value="1H">1H</option>
                    <option value="4H">4H</option>
                    <option value="1D">1D</option>
                    <option value="1W">1W</option>
                  </select>
          <motion.button
            onClick={() => setShowFavorites(!showFavorites)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all ${
              showFavorites ? 'bg-[#00f2ff] text-black' : 'bg-[#2a2a2a] text-white'
            }`}
          >
            <FontAwesomeIcon icon={faStar} className="mr-2" />
            Favorites
          </motion.button>
          <motion.button
            onClick={() => setShowWatched(!showWatched)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all ${
              showWatched ? 'bg-[#f0b323] text-black' : 'bg-[#2a2a2a] text-white'
            }`}
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            Watched
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Market Data Table */}
          <div className="lg:col-span-2">
                <motion.div
              className="phantom-card p-4 rounded-lg h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="phantom-subtitle text-xl mb-4 border-b border-[#3a3a3a] pb-2">
                📈 Market Data ({filteredData.length} assets)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3a3a3a]">
                      <th className="text-left py-3 px-2">Asset</th>
                      <th className="text-right py-3 px-2">Price</th>
                      <th className="text-right py-3 px-2">Change</th>
                      <th className="text-right py-3 px-2">Volume</th>
                      <th className="text-right py-3 px-2">Market Cap</th>
                      <th className="text-center py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <motion.tr
                        key={item.symbol}
                        onClick={() => setSelectedAsset(item)}
                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] cursor-pointer"
                        whileHover={{ scale: 1.01 }}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center">
                  <div>
                              <div className="font-semibold text-white">{item.symbol}</div>
                              <div className="text-sm text-gray-400">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2">
                          <div className="font-semibold text-white">{formatCurrency(item.price)}</div>
                          <div className={`text-xs ${getTrendColor(item.trend)}`}>
                            <FontAwesomeIcon icon={getTrendIcon(item.trend)} className="mr-1" />
                            {item.trend}
                          </div>
                        </td>
                        <td className="text-right py-3 px-2">
                          <div className={`font-semibold ${item.change >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}`}>
                            {formatCurrency(item.change)}
                  </div>
                          <div className={`text-xs ${item.changePercent >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}`}>
                            {formatPercentage(item.changePercent)}
                  </div>
                        </td>
                        <td className="text-right py-3 px-2">
                          <div className="text-white">{item.volume}</div>
                        </td>
                        <td className="text-right py-3 px-2">
                          <div className="text-white">{item.marketCap}</div>
                        </td>
                        <td className="text-center py-3 px-2">
                          <div className="flex justify-center space-x-2">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.symbol);
                              }}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className={`text-lg ${item.isFavorite ? 'text-[#f0b323]' : 'text-gray-400'}`}
                            >
                              <FontAwesomeIcon icon={item.isFavorite ? faStar : faStar} />
                            </motion.button>
                            <motion.button
                    onClick={(e) => {
                                e.stopPropagation();
                                toggleWatched(item.symbol);
                              }}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className={`text-lg ${item.isWatched ? 'text-[#00f2ff]' : 'text-gray-400'}`}
                            >
                              <FontAwesomeIcon icon={item.isWatched ? faEye : faEyeSlash} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
                </motion.div>
          </div>

          {/* News and Signals */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Trading Signals */}
              <motion.div
                className="phantom-card p-4 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="phantom-subtitle text-xl mb-4 border-b border-[#3a3a3a] pb-2">
                  🤖 Trading Signals
                </h2>
                <div className="space-y-3">
                  {tradingSignals.map((signal) => (
                    <div key={signal.symbol} className="bg-[#1a1a1a] p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-white">{signal.symbol}</span>
                        <span className={`text-sm font-semibold ${
                          signal.signal === 'BUY' ? 'text-[#00f2ff]' : 
                          signal.signal === 'SELL' ? 'text-[#ff4500]' : 'text-[#f0b323]'
                        }`}>
                          {signal.signal}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{signal.reasoning}</div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#f0b323]">{signal.potential}</span>
                        <span className="text-gray-400">{signal.confidence}% confidence</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(signal.timestamp)}
                      </div>
                    </div>
                  ))}
          </div>
        </motion.div>

              {/* Market News */}
        <motion.div
                className="phantom-card p-4 rounded-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="phantom-subtitle text-xl mb-4 border-b border-[#3a3a3a] pb-2">
                  📰 Market News
                </h2>
                <div className="space-y-3">
                  {newsData.map((news) => (
                    <div key={news.id} className="bg-[#1a1a1a] p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white text-sm">{news.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getImpactColor(news.impact)}`}>
                          {news.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{news.summary}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">{news.source}</span>
                        <span className={getSentimentColor(news.sentiment)}>
                          {news.sentiment}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(news.publishedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Asset Details */}
        {selectedAsset && (
          <motion.div
            className="phantom-card p-4 rounded-lg mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#3a3a3a] pb-2">
              <h2 className="phantom-subtitle text-xl">
                {selectedAsset.name} ({selectedAsset.symbol}) - {timeframe} Chart
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{formatCurrency(selectedAsset.price)}</div>
                  <div className={`text-sm ${selectedAsset.change >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}`}>
                    {formatCurrency(selectedAsset.change)} ({formatPercentage(selectedAsset.changePercent)})
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Price Chart */}
              <div className="lg:col-span-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                      <XAxis dataKey="time" stroke="#a0a0b0" tick={{ fill: '#a0a0b0', fontSize: 12 }} />
                      <YAxis stroke="#a0a0b0" tick={{ fill: '#a0a0b0', fontSize: 12 }} />
                      <Tooltip
                        wrapperStyle={{ outline: 'none' }}
                        contentStyle={{
                          backgroundColor: '#2a2a2a',
                          border: '1px solid #00f2ff',
                          borderRadius: '8px',
                          color: '#ffffff',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#00f2ff"
                        fill="url(#priceGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#00f2ff" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Technical Indicators */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#f0b323]">Technical Indicators</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">RSI:</span>
                    <span className="text-white">{selectedAsset.technicalIndicators.rsi.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MACD:</span>
                    <span className="text-white">{selectedAsset.technicalIndicators.macd.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">BB Upper:</span>
                    <span className="text-white">{formatCurrency(selectedAsset.technicalIndicators.bollingerUpper)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">BB Lower:</span>
                    <span className="text-white">{formatCurrency(selectedAsset.technicalIndicators.bollingerLower)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MA 20:</span>
                    <span className="text-white">{formatCurrency(selectedAsset.technicalIndicators.movingAverage20)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MA 50:</span>
                    <span className="text-white">{formatCurrency(selectedAsset.technicalIndicators.movingAverage50)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6 text-[#1e90ff]">Market Data</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Open:</span>
                    <span className="text-white">{formatCurrency(selectedAsset.open)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">High 24h:</span>
                    <span className="text-white">{formatCurrency(selectedAsset.high24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Low 24h:</span>
                    <span className="text-white">{formatCurrency(selectedAsset.low24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-white">{selectedAsset.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="text-white">{selectedAsset.marketCap}</span>
                  </div>
                </div>
              </div>
          </div>
        </motion.div>
        )}

        {/* Indian Market Section */}
        <div className="mt-8">
          <IndianMarketWatch />
        </div>
      </div>
    </div>
  );
});

export default MarketWatch; 