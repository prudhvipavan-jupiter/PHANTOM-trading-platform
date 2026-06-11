import React, { useState, useEffect } from 'react';
// Removed unused motion import
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faCog,
  faChartLine,
  faBrain,
  faBullseye,
  faBalanceScale
} from '@fortawesome/free-solid-svg-icons';
import { getClosestProgressWidthClass } from '../../utils/progressUtils';

interface Strategy {
  id: string;
  name: string;
  type: 'MOMENTUM' | 'MEAN_REVERSION' | 'ARBITRAGE' | 'SCALPING' | 'SWING' | 'GRID' | 'DCA';
  market: 'CRYPTO' | 'STOCKS' | 'FOREX' | 'COMMODITIES' | 'ALL';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedReturn: number;
  maxDrawdown: number;
  successRate: number;
  capitalRequired: number;
  status: 'ACTIVE' | 'PAUSED' | 'BACKTESTING' | 'OPTIMIZING' | 'DRAFT';
  profitGenerated: number;
  tradesCount: number;
  description: string;
  parameters: {
    entryThreshold: number;
    exitThreshold: number;
    stopLoss: number;
    takeProfit: number;
    positionSize: number;
    maxPositions: number;
    rebalanceFrequency: string;
  };
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    avgTrade: number;
    avgWin: number;
    avgLoss: number;
  };
}

const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Crypto Momentum Hunter Pro',
    type: 'MOMENTUM',
    market: 'CRYPTO',
    riskLevel: 'HIGH',
    expectedReturn: 45.2,
    maxDrawdown: 12.5,
    successRate: 78.5,
    capitalRequired: 50000,
    status: 'ACTIVE',
    profitGenerated: 22500,
    tradesCount: 156,
    description: 'Advanced momentum-based strategy using multiple technical indicators to capture crypto trends.',
    parameters: {
      entryThreshold: 0.75,
      exitThreshold: 0.25,
      stopLoss: 0.05,
      takeProfit: 0.15,
      positionSize: 0.1,
      maxPositions: 5,
      rebalanceFrequency: '1H'
    },
    performance: {
      totalReturn: 45.2,
      sharpeRatio: 2.1,
      maxDrawdown: 12.5,
      winRate: 78.5,
      profitFactor: 2.8,
      avgTrade: 144.2,
      avgWin: 245.6,
      avgLoss: -87.3
    }
  },
  {
    id: '2',
    name: 'Stock Mean Reversion Elite',
    type: 'MEAN_REVERSION',
    market: 'STOCKS',
    riskLevel: 'MEDIUM',
    expectedReturn: 28.7,
    maxDrawdown: 8.2,
    successRate: 85.3,
    capitalRequired: 100000,
    status: 'ACTIVE',
    profitGenerated: 28700,
    tradesCount: 89,
    description: 'Mean reversion strategy for blue-chip stocks with statistical arbitrage.',
    parameters: {
      entryThreshold: 0.6,
      exitThreshold: 0.4,
      stopLoss: 0.03,
      takeProfit: 0.08,
      positionSize: 0.15,
      maxPositions: 3,
      rebalanceFrequency: '4H'
    },
    performance: {
      totalReturn: 28.7,
      sharpeRatio: 1.8,
      maxDrawdown: 8.2,
      winRate: 85.3,
      profitFactor: 3.2,
      avgTrade: 322.5,
      avgWin: 456.7,
      avgLoss: -142.8
    }
  },
  {
    id: '3',
    name: 'Forex Scalping Master',
    type: 'SCALPING',
    market: 'FOREX',
    riskLevel: 'HIGH',
    expectedReturn: 35.8,
    maxDrawdown: 15.2,
    successRate: 72.1,
    capitalRequired: 25000,
    status: 'BACKTESTING',
    profitGenerated: 8950,
    tradesCount: 423,
    description: 'High-frequency scalping strategy for major currency pairs.',
    parameters: {
      entryThreshold: 0.8,
      exitThreshold: 0.2,
      stopLoss: 0.02,
      takeProfit: 0.04,
      positionSize: 0.05,
      maxPositions: 10,
      rebalanceFrequency: '15M'
    },
    performance: {
      totalReturn: 35.8,
      sharpeRatio: 1.5,
      maxDrawdown: 15.2,
      winRate: 72.1,
      profitFactor: 2.1,
      avgTrade: 21.2,
      avgWin: 35.6,
      avgLoss: -16.9
    }
  }
];

const mockBacktestData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  profit: Math.floor(Math.random() * 5000) + 1000,
  trades: Math.floor(Math.random() * 20) + 5,
  success: Math.floor(Math.random() * 20) + 70,
  drawdown: Math.floor(Math.random() * 10) + 2
}));

const AIStrategyBuilder = React.memo(() => {
  const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [totalProfit, setTotalProfit] = useState(60150);
  const [activeStrategies] = useState(2);
  const [backtestResults, setBacktestResults] = useState(mockBacktestData);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    type: 'MOMENTUM' as Strategy['type'],
    market: 'CRYPTO' as Strategy['market'],
    riskLevel: 'MEDIUM' as Strategy['riskLevel'],
    capitalRequired: 50000,
    description: ''
  });

  // Simulate real-time profit generation
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalProfit(prev => prev + Math.floor(Math.random() * 500) + 100);
      setBacktestResults(prev => prev.map(item => ({
        ...item,
        profit: item.profit + Math.floor(Math.random() * 200) + 50
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createNewStrategy = () => {
    if (!newStrategy.name || !newStrategy.description) return;

    const strategy: Strategy = {
      id: Date.now().toString(),
      name: newStrategy.name,
      type: newStrategy.type,
      market: newStrategy.market,
      riskLevel: newStrategy.riskLevel,
      expectedReturn: Math.floor(Math.random() * 40) + 20,
      maxDrawdown: Math.floor(Math.random() * 15) + 5,
      successRate: Math.floor(Math.random() * 20) + 70,
      capitalRequired: newStrategy.capitalRequired,
      status: 'DRAFT',
      profitGenerated: 0,
      tradesCount: 0,
      description: newStrategy.description,
      parameters: {
        entryThreshold: 0.7,
        exitThreshold: 0.3,
        stopLoss: 0.05,
        takeProfit: 0.12,
        positionSize: 0.1,
        maxPositions: 5,
        rebalanceFrequency: '1H'
      },
      performance: {
        totalReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        profitFactor: 0,
        avgTrade: 0,
        avgWin: 0,
        avgLoss: 0
      }
    };

    setStrategies(prev => [strategy, ...prev]);
    setNewStrategy({ name: '', type: 'MOMENTUM', market: 'CRYPTO', riskLevel: 'MEDIUM', capitalRequired: 50000, description: '' });
    setIsCreating(false);
  };

  const optimizeStrategy = (strategyId: string) => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          
          // Update strategy with optimized parameters
          setStrategies(prev => prev.map(s => 
            s.id === strategyId 
              ? { 
                  ...s, 
                  expectedReturn: s.expectedReturn * 1.15,
                  successRate: Math.min(s.successRate * 1.05, 95),
                  status: 'ACTIVE' as const
                }
              : s
          ));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startBacktesting = (strategyId: string) => {
    setIsBacktesting(true);
    setTimeout(() => {
      setIsBacktesting(false);
      setSelectedStrategy(strategies.find(s => s.id === strategyId) || null);
    }, 3000);
  };

  const getStatusColor = (status: Strategy['status']) => {
    switch (status) {
      case 'ACTIVE': return 'text-[#00f2ff]';
      case 'PAUSED': return 'text-[#f0b323]';
      case 'BACKTESTING': return 'text-[#ff4500]';
      case 'OPTIMIZING': return 'text-[#1e90ff]';
      case 'DRAFT': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskColor = (risk: Strategy['riskLevel']) => {
    switch (risk) {
      case 'LOW': return 'text-[#00f2ff]';
      case 'MEDIUM': return 'text-[#f0b323]';
      case 'HIGH': return 'text-[#ff4500]';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MOMENTUM': return faChartLine;
      case 'MEAN_REVERSION': return faBalanceScale;
      case 'SCALPING': return faBullseye;
      case 'SWING': return faChartLine;
      case 'ARBITRAGE': return faBullseye;
      default: return faBrain;
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

  return (
    <div className="p-6 flex flex-col bg-[#1a1a1a] h-screen overflow-y-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#3a3a3a] mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-primary-main">Neural Strategy Builder</h1>
          <p className="text-text-secondary mb-6">Create and optimize AI-powered trading strategies using advanced neural networks</p>
        </div>
        <div
          onClick={() => setIsCreating(true)}
          className="phantom-button bg-gradient-to-r from-[#00f2ff] to-[#1e90ff] px-6 py-3 cursor-pointer"
        >
          <FontAwesomeIcon icon={faBrain} className="mr-2" />
          Create New Strategy
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="phantom-card p-4 rounded-lg"
          >
            <h3 className="text-[#00f2ff] text-sm mb-2">💰 Total Profit Generated</h3>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalProfit)}</div>
            <div className="text-[#00f2ff] text-xs mt-2">+₹{Math.floor(totalProfit * 0.12)} this month</div>
          </div>

          <div
            className="phantom-card p-4 rounded-lg"
          >
            <h3 className="text-[#f0b323] text-sm mb-2">🚀 Active Strategies</h3>
            <div className="text-2xl font-bold text-white">{activeStrategies}</div>
            <div className="text-[#f0b323] text-xs mt-2">Out of {strategies.length} total</div>
          </div>

          <div
            className="phantom-card p-4 rounded-lg"
          >
            <h3 className="text-[#ff4500] text-sm mb-2">📊 Avg Success Rate</h3>
            <div className="text-2xl font-bold text-white">
              {Math.round(strategies.reduce((acc, s) => acc + s.successRate, 0) / strategies.length)}%
            </div>
            <div className="text-[#ff4500] text-xs mt-2">Across all strategies</div>
        </div>

          <div
            className="phantom-card p-4 rounded-lg"
          >
            <h3 className="text-[#1e90ff] text-sm mb-2">⚡ Total Trades</h3>
            <div className="text-2xl font-bold text-white">
              {strategies.reduce((acc, s) => acc + s.tradesCount, 0)}
            </div>
            <div className="text-[#1e90ff] text-xs mt-2">Executed today</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Strategy List */}
          <div className="lg:col-span-1">
            <div
              className="phantom-card p-4 rounded-lg h-full"
            >
              <h2 className="phantom-subtitle text-xl mb-4 border-b border-[#3a3a3a] pb-2">
                📋 Trading Strategies
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {strategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedStrategy?.id === strategy.id
                        ? 'bg-[#00f2ff] bg-opacity-20 border border-[#00f2ff]'
                        : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FontAwesomeIcon 
                          icon={getTypeIcon(strategy.type)} 
                          className={`mr-2 ${getStatusColor(strategy.status)}`}
                        />
                        <span className="font-semibold text-white">{strategy.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(strategy.status)}`}>
                        {strategy.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{strategy.description}</div>
                    <div className="flex justify-between text-xs">
                      <span className={getRiskColor(strategy.riskLevel)}>{strategy.riskLevel} Risk</span>
                      <span className="text-[#f0b323]">{strategy.expectedReturn}% Return</span>
                      <span className="text-[#00f2ff]">{formatCurrency(strategy.profitGenerated)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategy Details */}
          <div className="lg:col-span-2">
            {selectedStrategy ? (
              <div
                className="phantom-card p-4 rounded-lg h-full"
              >
                <div className="flex items-center justify-between mb-4 border-b border-[#3a3a3a] pb-2">
                  <h2 className="phantom-subtitle text-xl">{selectedStrategy.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startBacktesting(selectedStrategy.id)}
                      className="phantom-button bg-gradient-to-r from-[#f0b323] to-[#ff8c00] px-3 py-1 text-sm cursor-pointer"
                      disabled={isBacktesting}
                    >
                      <FontAwesomeIcon icon={faPlay} className="mr-1" />
                      {isBacktesting ? 'Testing...' : 'Backtest'}
                    </button>
                    <button
                      onClick={() => optimizeStrategy(selectedStrategy.id)}
                      className="phantom-button bg-gradient-to-r from-[#1e90ff] to-[#4169e1] px-3 py-1 text-sm cursor-pointer"
                      disabled={isOptimizing}
                    >
                      <FontAwesomeIcon icon={faCog} className="mr-1" />
                      {isOptimizing ? 'Optimizing...' : 'Optimize'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strategy Overview */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-[#00f2ff]">Strategy Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{selectedStrategy.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market:</span>
                        <span className="text-white">{selectedStrategy.market}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span className={getRiskColor(selectedStrategy.riskLevel)}>{selectedStrategy.riskLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Return:</span>
                        <span className="text-[#f0b323]">{selectedStrategy.expectedReturn}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Drawdown:</span>
                        <span className="text-[#ff4500]">{selectedStrategy.maxDrawdown}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-[#00f2ff]">{selectedStrategy.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Capital Required:</span>
                        <span className="text-white">{formatCurrency(selectedStrategy.capitalRequired)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
        <div>
                    <h3 className="text-lg font-semibold mb-3 text-[#f0b323]">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Return:</span>
                        <span className="text-[#00f2ff]">{selectedStrategy.performance.totalReturn}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sharpe Ratio:</span>
                        <span className="text-[#f0b323]">{selectedStrategy.performance.sharpeRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-[#00f2ff]">{selectedStrategy.performance.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Profit Factor:</span>
                        <span className="text-[#f0b323]">{selectedStrategy.performance.profitFactor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Trade:</span>
                        <span className="text-white">{formatCurrency(selectedStrategy.performance.avgTrade)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Profit:</span>
                        <span className="text-[#00f2ff]">{formatCurrency(selectedStrategy.profitGenerated)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trades Count:</span>
                        <span className="text-white">{selectedStrategy.tradesCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Backtest Results Chart */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#1e90ff]">Backtest Results</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={backtestResults}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                        <XAxis dataKey="day" stroke="#a0a0b0" tick={{ fill: '#a0a0b0', fontSize: 12 }} />
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
                          dataKey="profit"
                          stroke="#00f2ff"
                          fill="url(#profitGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
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
                    <h3 className="text-lg font-semibold mb-3 text-[#1e90ff]">AI Optimization Progress</h3>
                    <div className="bg-[#1a1a1a] p-4 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Optimizing Strategy Parameters...</span>
                        <span>{optimizationProgress}%</span>
                      </div>
                      <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                        <div
                          className={`optimization-progress-bar ${getClosestProgressWidthClass(optimizationProgress)}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="phantom-card p-8 rounded-lg h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <FontAwesomeIcon icon={faBrain} className="text-6xl text-[#00f2ff] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Strategy</h3>
                  <p className="text-gray-400">Choose a strategy from the list to view detailed information and performance metrics.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Strategy Modal */}
      {isCreating && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="phantom-card p-6 rounded-lg w-full max-w-md"
          >
            <h2 className="phantom-subtitle text-xl mb-4">Create New Strategy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Strategy Name</label>
                <input
                  type="text"
                  value={newStrategy.name}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white"
                  placeholder="Enter strategy name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Strategy Type</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStrategy.type}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, type: e.target.value as Strategy['type'] }))}
                  title="Strategy Type"
                >
                  <option value="MOMENTUM">Momentum Trading</option>
                  <option value="MEAN_REVERSION">Mean Reversion</option>
                  <option value="SCALPING">Scalping</option>
                  <option value="SWING">Swing Trading</option>
                  <option value="ARBITRAGE">Arbitrage</option>
                  <option value="GRID">Grid Trading</option>
                  <option value="DCA">Dollar Cost Averaging</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Market</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStrategy.market}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, market: e.target.value as Strategy['market'] }))}
                  title="Market"
                >
                  <option value="CRYPTO">Cryptocurrency</option>
                  <option value="STOCKS">Stocks</option>
                  <option value="FOREX">Forex</option>
                  <option value="COMMODITIES">Commodities</option>
                  <option value="ALL">All Markets</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Risk Level</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStrategy.riskLevel}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, riskLevel: e.target.value as Strategy['riskLevel'] }))}
                  title="Risk Level"
                >
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
          </select>
        </div>
        <div>
                <label className="block text-sm font-medium mb-2">Capital Required</label>
          <input
                  type="number"
                  value={newStrategy.capitalRequired}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, capitalRequired: parseInt(e.target.value) }))}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white"
                  placeholder="Enter capital amount"
          />
        </div>
        <div>
                <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white"
                  rows={3}
                  placeholder="Describe your strategy"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <div
                onClick={() => setIsCreating(false)}
                className="flex-1 p-3 bg-[#2a2a2a] text-white rounded-lg cursor-pointer"
              >
                Cancel
        </div>
              <div
                onClick={createNewStrategy}
                className="flex-1 p-3 bg-gradient-to-r from-[#00f2ff] to-[#1e90ff] text-white rounded-lg cursor-pointer"
              >
                Create Strategy
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AIStrategyBuilder;