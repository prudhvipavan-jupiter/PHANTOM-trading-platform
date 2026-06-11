import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faChartLine,
  faShieldAlt,
  faBullseye,
  faChartPie,
  faBalanceScale,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  profit: number;
  profitPercentage: number;
  allocation: number;
  category: 'CRYPTO' | 'STOCKS' | 'FOREX' | 'COMMODITIES' | 'BONDS' | 'REAL_ESTATE';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  lastUpdated: Date;
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

interface PortfolioMetrics {
  totalValue: number;
  totalProfit: number;
  totalProfitPercentage: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  yearlyChange: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
}

const mockPortfolioAssets: PortfolioAsset[] = [
  {
    id: '1',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    quantity: 2.5,
    avgPrice: 45000,
    currentPrice: 45230.50,
    marketValue: 113076.25,
    profit: 575.25,
    profitPercentage: 0.51,
    allocation: 25,
    category: 'CRYPTO',
    risk: 'HIGH',
    lastUpdated: new Date(),
    performance: { daily: 2.1, weekly: 8.5, monthly: 15.2, yearly: 45.8 }
  },
  {
    id: '2',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    quantity: 100,
    avgPrice: 2400,
    currentPrice: 2520.75,
    marketValue: 252075,
    profit: 12075,
    profitPercentage: 5.03,
    allocation: 35,
    category: 'STOCKS',
    risk: 'MEDIUM',
    lastUpdated: new Date(),
    performance: { daily: 0.85, weekly: 3.2, monthly: 8.7, yearly: 28.5 }
  },
  {
    id: '3',
    symbol: 'EUR/USD',
    name: 'Euro/US Dollar',
    quantity: 50000,
    avgPrice: 1.0850,
    currentPrice: 1.0925,
    marketValue: 54625,
    profit: 375,
    profitPercentage: 0.69,
    allocation: 15,
    category: 'FOREX',
    risk: 'LOW',
    lastUpdated: new Date(),
    performance: { daily: 0.15, weekly: 0.8, monthly: 2.1, yearly: 8.5 }
  },
  {
    id: '4',
    symbol: 'GOLD',
    name: 'Gold',
    quantity: 10,
    avgPrice: 1950,
    currentPrice: 1985.40,
    marketValue: 19854,
    profit: 354,
    profitPercentage: 1.82,
    allocation: 10,
    category: 'COMMODITIES',
    risk: 'LOW',
    lastUpdated: new Date(),
    performance: { daily: 0.75, weekly: 2.8, monthly: 6.5, yearly: 18.2 }
  },
  {
    id: '5',
    symbol: 'ETH/USD',
    name: 'Ethereum',
    quantity: 15,
    avgPrice: 2800,
    currentPrice: 2845.20,
    marketValue: 42678,
    profit: 678,
    profitPercentage: 1.61,
    allocation: 15,
    category: 'CRYPTO',
    risk: 'HIGH',
    lastUpdated: new Date(),
    performance: { daily: -1.23, weekly: 5.2, monthly: 12.8, yearly: 38.5 }
  }
];

const mockPortfolioHistory = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  value: 400000 + Math.random() * 100000,
  profit: Math.random() * 50000,
  allocation: {
    crypto: 40 + Math.random() * 10,
    stocks: 35 + Math.random() * 10,
    forex: 15 + Math.random() * 5,
    commodities: 10 + Math.random() * 5
  }
}));

const PortfolioManagement = React.memo(() => {
  const [assets, setAssets] = useState<PortfolioAsset[]>(mockPortfolioAssets);
  const [selectedAsset, setSelectedAsset] = useState<PortfolioAsset | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState(mockPortfolioHistory);
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    name: '',
    quantity: 0,
    avgPrice: 0,
    category: 'CRYPTO' as PortfolioAsset['category'],
    risk: 'MEDIUM' as PortfolioAsset['risk']
  });

  // Calculate portfolio metrics
  const portfolioMetrics: PortfolioMetrics = {
    totalValue: assets.reduce((sum, asset) => sum + asset.marketValue, 0),
    totalProfit: assets.reduce((sum, asset) => sum + asset.profit, 0),
    totalProfitPercentage: assets.reduce((sum, asset) => sum + asset.profitPercentage, 0) / assets.length,
    dailyChange: assets.reduce((sum, asset) => sum + asset.performance.daily, 0),
    weeklyChange: assets.reduce((sum, asset) => sum + asset.performance.weekly, 0),
    monthlyChange: assets.reduce((sum, asset) => sum + asset.performance.monthly, 0),
    yearlyChange: assets.reduce((sum, asset) => sum + asset.performance.yearly, 0),
    sharpeRatio: 1.85,
    maxDrawdown: 8.2,
    volatility: 12.5,
    beta: 0.95,
    alpha: 2.3
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        currentPrice: asset.currentPrice * (1 + (Math.random() - 0.5) * 0.02),
        lastUpdated: new Date()
      })));
      
      setPortfolioHistory(prev => prev.map(item => ({
        ...item,
        value: item.value * (1 + (Math.random() - 0.5) * 0.01),
        profit: item.profit * (1 + (Math.random() - 0.5) * 0.02)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const optimizePortfolio = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          
          // Simulate portfolio optimization results
          setAssets(prev => prev.map(asset => ({
            ...asset,
            allocation: asset.allocation * (0.9 + Math.random() * 0.2), // Adjust allocation
            profitPercentage: asset.profitPercentage * (1 + Math.random() * 0.1) // Improve performance
          })));
          return 100;
    }
        return prev + 10;
      });
    }, 200);
  };

  const addAsset = () => {
    if (!newAsset.symbol || !newAsset.name || newAsset.quantity <= 0 || newAsset.avgPrice <= 0) return;

    const asset: PortfolioAsset = {
      id: Date.now().toString(),
      symbol: newAsset.symbol,
      name: newAsset.name,
      quantity: newAsset.quantity,
      avgPrice: newAsset.avgPrice,
      currentPrice: newAsset.avgPrice * (1 + (Math.random() - 0.5) * 0.1),
      marketValue: newAsset.quantity * newAsset.avgPrice,
      profit: 0,
      profitPercentage: 0,
      allocation: 5,
      category: newAsset.category,
      risk: newAsset.risk,
      lastUpdated: new Date(),
      performance: { daily: 0, weekly: 0, monthly: 0, yearly: 0 }
    };

    setAssets(prev => [...prev, asset]);
    setNewAsset({ symbol: '', name: '', quantity: 0, avgPrice: 0, category: 'CRYPTO', risk: 'MEDIUM' });
    setIsAddingAsset(false);
  };

  const removeAsset = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    if (selectedAsset?.id === assetId) {
      setSelectedAsset(null);
    }
  };

  const getRiskColor = (risk: PortfolioAsset['risk']) => {
    switch (risk) {
      case 'LOW': return 'text-[#00f2ff]';
      case 'MEDIUM': return 'text-[#f0b323]';
      case 'HIGH': return 'text-[#ff4500]';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: PortfolioAsset['category']) => {
    switch (category) {
      case 'CRYPTO': return faBullseye;
      case 'STOCKS': return faChartLine;
      case 'FOREX': return faDollarSign;
      case 'COMMODITIES': return faBalanceScale;
      case 'BONDS': return faShieldAlt;
      case 'REAL_ESTATE': return faBullseye;
      default: return faChartPie;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="p-6 flex flex-col bg-[#1a1a1a] h-screen overflow-y-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#3a3a3a] mb-6">
        <div>
          <h1 className="phantom-title text-4xl mb-1">💼 Portfolio Management</h1>
          <p className="phantom-subtitle text-lg">
            Advanced portfolio tracking, optimization, and risk management for maximum returns
          </p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            onClick={() => setIsAddingAsset(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="phantom-button bg-gradient-to-r from-[#00f2ff] to-[#1e90ff] px-4 py-2"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Asset
          </motion.button>
          <motion.button
            onClick={optimizePortfolio}
            disabled={isOptimizing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="phantom-button bg-gradient-to-r from-[#f0b323] to-[#ff8c00] px-4 py-2"
          >
            <FontAwesomeIcon icon={faBullseye} className="mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize Portfolio'}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="phantom-card p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-[#00f2ff] text-sm mb-2">💰 Total Portfolio Value</h3>
            <div className="text-2xl font-bold text-white">{formatCurrency(portfolioMetrics.totalValue)}</div>
            <div className="text-[#00f2ff] text-xs mt-2">
              {formatPercentage(portfolioMetrics.dailyChange)} today
            </div>
          </motion.div>

          <motion.div
            className="phantom-card p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-[#f0b323] text-sm mb-2">📈 Total Profit</h3>
            <div className="text-2xl font-bold text-white">{formatCurrency(portfolioMetrics.totalProfit)}</div>
            <div className="text-[#f0b323] text-xs mt-2">
              {formatPercentage(portfolioMetrics.totalProfitPercentage)} return
            </div>
          </motion.div>

          <motion.div
            className="phantom-card p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-[#ff4500] text-sm mb-2">⚡ Sharpe Ratio</h3>
            <div className="text-2xl font-bold text-white">{portfolioMetrics.sharpeRatio}</div>
            <div className="text-[#ff4500] text-xs mt-2">
              Risk-adjusted return
            </div>
          </motion.div>

          <motion.div
            className="phantom-card p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-[#1e90ff] text-sm mb-2">🛡️ Max Drawdown</h3>
            <div className="text-2xl font-bold text-white">{portfolioMetrics.maxDrawdown}%</div>
            <div className="text-[#1e90ff] text-xs mt-2">
              Risk management
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Portfolio Assets */}
          <div className="lg:col-span-1">
            <motion.div
              className="phantom-card p-4 rounded-lg h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="phantom-subtitle text-xl mb-4 border-b border-[#3a3a3a] pb-2">
                📊 Portfolio Assets ({assets.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedAsset?.id === asset.id
                        ? 'bg-[#00f2ff] bg-opacity-20 border border-[#00f2ff]'
                        : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FontAwesomeIcon 
                          icon={getCategoryIcon(asset.category)} 
                          className="mr-2 text-[#00f2ff]"
                        />
                        <div>
                          <div className="font-semibold text-white">{asset.symbol}</div>
                          <div className="text-xs text-gray-400">{asset.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{formatCurrency(asset.marketValue)}</div>
                        <div className={`text-xs ${asset.profit >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}`}>
                          {formatPercentage(asset.profitPercentage)}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={getRiskColor(asset.risk)}>{asset.risk} Risk</span>
                      <span className="text-gray-400">{asset.allocation.toFixed(1)}%</span>
                      <span className="text-[#f0b323]">{asset.quantity} units</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Portfolio Analytics */}
          <div className="lg:col-span-2">
            {selectedAsset ? (
              <motion.div
                className="phantom-card p-4 rounded-lg h-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4 border-b border-[#3a3a3a] pb-2">
                  <h2 className="phantom-subtitle text-xl">{selectedAsset.name} ({selectedAsset.symbol})</h2>
                  <motion.button
                    onClick={() => removeAsset(selectedAsset.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#ff4500] hover:text-red-400"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Asset Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-[#00f2ff]">Asset Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Price:</span>
                        <span className="text-white">{formatCurrency(selectedAsset.currentPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Price:</span>
                        <span className="text-white">{formatCurrency(selectedAsset.avgPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantity:</span>
                        <span className="text-white">{selectedAsset.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Value:</span>
                        <span className="text-white">{formatCurrency(selectedAsset.marketValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Profit:</span>
                        <span className={selectedAsset.profit >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}>
                          {formatCurrency(selectedAsset.profit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Profit %:</span>
                        <span className={selectedAsset.profitPercentage >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}>
                          {formatPercentage(selectedAsset.profitPercentage)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Allocation:</span>
                        <span className="text-[#f0b323]">{selectedAsset.allocation.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={getRiskColor(selectedAsset.risk)}>{selectedAsset.risk}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-[#f0b323]">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily:</span>
                        <span className={selectedAsset.performance.daily >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}>
                          {formatPercentage(selectedAsset.performance.daily)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weekly:</span>
                        <span className={selectedAsset.performance.weekly >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}>
                          {formatPercentage(selectedAsset.performance.weekly)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly:</span>
                        <span className={selectedAsset.performance.monthly >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}>
                          {formatPercentage(selectedAsset.performance.monthly)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Yearly:</span>
                        <span className={selectedAsset.performance.yearly >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]'}>
                          {formatPercentage(selectedAsset.performance.yearly)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white">{selectedAsset.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-gray-400">
                          {selectedAsset.lastUpdated.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio Performance Chart */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#1e90ff]">Portfolio Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={portfolioHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                        <XAxis dataKey="date" stroke="#a0a0b0" tick={{ fill: '#a0a0b0', fontSize: 12 }} />
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
                          dataKey="value"
                          stroke="#00f2ff"
                          fill="url(#portfolioGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Optimization Progress */}
                {isOptimizing && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#1e90ff]">Portfolio Optimization</h3>
                    <div className="bg-[#1a1a1a] p-4 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Optimizing asset allocation and risk management...</span>
                        <span>{optimizationProgress}%</span>
                      </div>
                      <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-[#1e90ff] to-[#00f2ff] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${optimizationProgress}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="phantom-card p-8 rounded-lg h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center">
                  <FontAwesomeIcon icon={faChartPie} className="text-6xl text-[#00f2ff] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select an Asset</h3>
                  <p className="text-gray-400">Choose an asset from the portfolio to view detailed information and performance metrics.</p>
              </div>
              </motion.div>
          )}
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddingAsset && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="phantom-card p-6 rounded-lg w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="phantom-subtitle text-xl mb-4">Add New Asset</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Symbol</label>
                <input
                  type="text"
                  value={newAsset.symbol}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, symbol: e.target.value }))}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white"
                  placeholder="e.g., BTC/USD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Asset Name</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white"
                  placeholder="e.g., Bitcoin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={newAsset.quantity}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Average Price</label>
                <input
                  type="number"
                  value={newAsset.avgPrice}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, avgPrice: parseFloat(e.target.value) }))}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white"
                  placeholder="Enter average price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newAsset.category}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, category: e.target.value as PortfolioAsset['category'] }))}
                  title="Asset Category"
                >
                  <option value="CRYPTO">Cryptocurrency</option>
                  <option value="STOCKS">Stocks</option>
                  <option value="FOREX">Forex</option>
                  <option value="COMMODITIES">Commodities</option>
                  <option value="BONDS">Bonds</option>
                  <option value="REAL_ESTATE">Real Estate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Risk Level</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newAsset.risk}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, risk: e.target.value as PortfolioAsset['risk'] }))}
                  title="Risk Level"
                >
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <motion.button
                onClick={() => setIsAddingAsset(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 p-3 bg-[#2a2a2a] text-white rounded-lg"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={addAsset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 p-3 bg-gradient-to-r from-[#00f2ff] to-[#1e90ff] text-white rounded-lg"
              >
                Add Asset
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
});

export default PortfolioManagement; 