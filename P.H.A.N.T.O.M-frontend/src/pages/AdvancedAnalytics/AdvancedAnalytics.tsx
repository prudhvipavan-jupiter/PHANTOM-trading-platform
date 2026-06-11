import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faShieldAlt, 
  faChartPie, 
  faNetworkWired, 
  faIndustry, 
  faCalculator,
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle,
  faArrowDown,
  faEye,
  faEyeSlash,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface AdvancedAnalyticsProps {
  className?: string;
}

interface RiskMetrics {
  var95: number;
  var99: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  sortinoRatio: number;
  calmarRatio: number;
}

interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  cagr: number;
  alpha: number;
  beta: number;
  informationRatio: number;
  treynorRatio: number;
  jensenAlpha: number;
}

interface CorrelationData {
  asset: string;
  btc: number;
  eth: number;
  gold: number;
  spy: number;
  qqq: number;
  vix: number;
}

interface SectorData {
  sector: string;
  weight: number;
  return: number;
  volatility: number;
  sharpe: number;
  marketCap: number;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ className = '' }) => {
  const [selectedTab, setSelectedTab] = useState<'risk' | 'performance' | 'correlation' | 'sector'>('risk');
  const [showDetails, setShowDetails] = useState(true);
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  // Mock Risk Analytics Data
  const riskMetrics: RiskMetrics = {
    var95: 2.45,
    var99: 3.67,
    sharpeRatio: 1.85,
    maxDrawdown: -8.23,
    volatility: 12.34,
    beta: 0.87,
    alpha: 2.34,
    sortinoRatio: 2.12,
    calmarRatio: 1.67
  };

  // Mock Performance Data
  const performanceMetrics: PerformanceMetrics = {
    totalReturn: 45.67,
    annualizedReturn: 23.45,
    cagr: 21.34,
    alpha: 2.34,
    beta: 0.87,
    informationRatio: 1.23,
    treynorRatio: 2.45,
    jensenAlpha: 1.89
  };

  // Mock Correlation Data
  const correlationData: CorrelationData[] = [
    { asset: 'BTC', btc: 1.00, eth: 0.78, gold: 0.12, spy: 0.34, qqq: 0.29, vix: -0.45 },
    { asset: 'ETH', btc: 0.78, eth: 1.00, gold: 0.15, spy: 0.31, qqq: 0.28, vix: -0.42 },
    { asset: 'GOLD', btc: 0.12, eth: 0.15, gold: 1.00, spy: 0.08, qqq: 0.06, vix: 0.23 },
    { asset: 'SPY', btc: 0.34, eth: 0.31, gold: 0.08, spy: 1.00, qqq: 0.95, vix: -0.67 },
    { asset: 'QQQ', btc: 0.29, eth: 0.28, gold: 0.06, spy: 0.95, qqq: 1.00, vix: -0.71 },
    { asset: 'VIX', btc: -0.45, eth: -0.42, gold: 0.23, spy: -0.67, qqq: -0.71, vix: 1.00 }
  ];

  // Mock Sector Data
  const sectorData: SectorData[] = [
    { sector: 'Technology', weight: 35.2, return: 28.5, volatility: 18.2, sharpe: 1.57, marketCap: 1250000 },
    { sector: 'Healthcare', weight: 18.7, return: 15.3, volatility: 14.8, sharpe: 1.03, marketCap: 850000 },
    { sector: 'Financial', weight: 22.1, return: 12.8, volatility: 16.5, sharpe: 0.78, marketCap: 920000 },
    { sector: 'Consumer', weight: 12.4, return: 18.9, volatility: 13.2, sharpe: 1.43, marketCap: 680000 },
    { sector: 'Energy', weight: 8.3, return: 8.7, volatility: 22.1, sharpe: 0.39, marketCap: 450000 },
    { sector: 'Materials', weight: 3.3, return: 11.2, volatility: 19.8, sharpe: 0.57, marketCap: 320000 }
  ];

  // Mock Drawdown Data
  const drawdownData = [
    { date: '2024-01', drawdown: 0 },
    { date: '2024-02', drawdown: -2.1 },
    { date: '2024-03', drawdown: -5.3 },
    { date: '2024-04', drawdown: -8.2 },
    { date: '2024-05', drawdown: -6.7 },
    { date: '2024-06', drawdown: -3.4 },
    { date: '2024-07', drawdown: -1.2 },
    { date: '2024-08', drawdown: 0 }
  ];

  const getRiskColor = (value: number, type: 'positive' | 'negative' | 'neutral') => {
    if (type === 'positive') {
      return value > 1.5 ? 'text-green-400' : value > 1.0 ? 'text-yellow-400' : 'text-red-400';
    } else if (type === 'negative') {
      return value < -5 ? 'text-red-400' : value < -2 ? 'text-yellow-400' : 'text-green-400';
    } else {
      return value < 0.5 ? 'text-green-400' : value < 1.0 ? 'text-yellow-400' : 'text-red-400';
    }
  };

  const getPerformanceColor = (value: number) => {
    return value > 20 ? 'text-green-400' : value > 10 ? 'text-yellow-400' : 'text-red-400';
  };

  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue > 0.7) return 'text-red-400';
    if (absValue > 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const tabs = [
    { id: 'risk', label: 'Risk Analytics', icon: faShieldAlt },
    { id: 'performance', label: 'Performance Metrics', icon: faChartPie },
    { id: 'correlation', label: 'Correlation Analysis', icon: faNetworkWired },
    { id: 'sector', label: 'Sector Analysis', icon: faIndustry }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white ${className}`}>
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border-b border-cyan-400/30 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faCalculator} className="text-black text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                ADVANCED ANALYTICS
              </h1>
              <p className="text-cyan-400 font-mono text-sm">Comprehensive risk and performance analysis</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-400 font-mono focus:border-cyan-400/60 focus:outline-none"
              aria-label="Select time frame for analytics"
            >
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
              <option value="ALL">All Time</option>
            </select>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
              title={showDetails ? "Hide details" : "Show details"}
            >
              <FontAwesomeIcon 
                icon={showDetails ? faEyeSlash : faEye} 
                className="text-cyan-400 text-lg" 
              />
            </button>
            
            <button 
              className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
              title="Download analytics report"
              aria-label="Download analytics report"
            >
              <FontAwesomeIcon icon={faDownload} className="text-cyan-400 text-lg" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Navigation Tabs */}
        <motion.div
          className="flex space-x-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono font-bold transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/50'
                  : 'text-cyan-300 hover:bg-cyan-500/20'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Risk Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-red-400 font-mono font-bold">Value at Risk (95%)</h3>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(riskMetrics.var95, 'negative')}`}>
                    {riskMetrics.var95}%
                  </div>
                  <div className="text-red-400 font-mono text-sm mt-2">Maximum expected loss</div>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-green-400 font-mono font-bold">Sharpe Ratio</h3>
                    <FontAwesomeIcon icon={faChartLine} className="text-green-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(riskMetrics.sharpeRatio, 'positive')}`}>
                    {riskMetrics.sharpeRatio}
                  </div>
                  <div className="text-green-400 font-mono text-sm mt-2">Risk-adjusted returns</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-yellow-400 font-mono font-bold">Max Drawdown</h3>
                    <FontAwesomeIcon icon={faArrowDown} className="text-yellow-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(riskMetrics.maxDrawdown, 'negative')}`}>
                    {riskMetrics.maxDrawdown}%
                  </div>
                  <div className="text-yellow-400 font-mono text-sm mt-2">Largest peak-to-trough</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-blue-400 font-mono font-bold">Volatility</h3>
                    <FontAwesomeIcon icon={faChartLine} className="text-blue-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(riskMetrics.volatility, 'neutral')}`}>
                    {riskMetrics.volatility}%
                  </div>
                  <div className="text-blue-400 font-mono text-sm mt-2">Annualized volatility</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-purple-400 font-mono font-bold">Beta</h3>
                    <FontAwesomeIcon icon={faNetworkWired} className="text-purple-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(riskMetrics.beta, 'neutral')}`}>
                    {riskMetrics.beta}
                  </div>
                  <div className="text-purple-400 font-mono text-sm mt-2">Market sensitivity</div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-indigo-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-indigo-400 font-mono font-bold">Alpha</h3>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-indigo-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(riskMetrics.alpha, 'positive')}`}>
                    {riskMetrics.alpha}%
                  </div>
                  <div className="text-indigo-400 font-mono text-sm mt-2">Excess return</div>
                </div>
              </div>

              {/* Drawdown Chart */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Drawdown Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={drawdownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #4B5563',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#EF4444" 
                      fill="#EF4444" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {selectedTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-green-400 font-mono font-bold">Total Return</h3>
                    <FontAwesomeIcon icon={faChartLine} className="text-green-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getPerformanceColor(performanceMetrics.totalReturn)}`}>
                    {performanceMetrics.totalReturn}%
                  </div>
                  <div className="text-green-400 font-mono text-sm mt-2">Cumulative return</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-blue-400 font-mono font-bold">CAGR</h3>
                    <FontAwesomeIcon icon={faChartLine} className="text-blue-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getPerformanceColor(performanceMetrics.cagr)}`}>
                    {performanceMetrics.cagr}%
                  </div>
                  <div className="text-blue-400 font-mono text-sm mt-2">Compound growth</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-purple-400 font-mono font-bold">Information Ratio</h3>
                    <FontAwesomeIcon icon={faInfoCircle} className="text-purple-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(performanceMetrics.informationRatio, 'positive')}`}>
                    {performanceMetrics.informationRatio}
                  </div>
                  <div className="text-purple-400 font-mono text-sm mt-2">Active return ratio</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-yellow-400 font-mono font-bold">Treynor Ratio</h3>
                    <FontAwesomeIcon icon={faShieldAlt} className="text-yellow-400" />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${getRiskColor(performanceMetrics.treynorRatio, 'positive')}`}>
                    {performanceMetrics.treynorRatio}
                  </div>
                  <div className="text-yellow-400 font-mono text-sm mt-2">Risk-adjusted return</div>
                </div>
              </div>

              {/* Performance Comparison Chart */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Performance vs Benchmark</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan', portfolio: 100, benchmark: 100 },
                    { month: 'Feb', portfolio: 105, benchmark: 102 },
                    { month: 'Mar', portfolio: 108, benchmark: 104 },
                    { month: 'Apr', portfolio: 112, benchmark: 106 },
                    { month: 'May', portfolio: 115, benchmark: 108 },
                    { month: 'Jun', portfolio: 120, benchmark: 110 },
                    { month: 'Jul', portfolio: 125, benchmark: 112 },
                    { month: 'Aug', portfolio: 130, benchmark: 114 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #4B5563',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="portfolio" stroke="#00F2FF" strokeWidth={3} />
                    <Line type="monotone" dataKey="benchmark" stroke="#9CA3AF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {selectedTab === 'correlation' && (
            <motion.div
              key="correlation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Correlation Matrix */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-6">Asset Correlation Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-3 text-cyan-400 font-mono">Asset</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">BTC</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">ETH</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">GOLD</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">SPY</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">QQQ</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">VIX</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correlationData.map((row) => (
                        <tr key={row.asset} className="border-t border-gray-600/30">
                          <td className="p-3 text-white font-mono font-bold">{row.asset}</td>
                          <td className={`text-center p-3 font-mono ${getCorrelationColor(row.btc)}`}>
                            {row.btc.toFixed(2)}
                          </td>
                          <td className={`text-center p-3 font-mono ${getCorrelationColor(row.eth)}`}>
                            {row.eth.toFixed(2)}
                          </td>
                          <td className={`text-center p-3 font-mono ${getCorrelationColor(row.gold)}`}>
                            {row.gold.toFixed(2)}
                          </td>
                          <td className={`text-center p-3 font-mono ${getCorrelationColor(row.spy)}`}>
                            {row.spy.toFixed(2)}
                          </td>
                          <td className={`text-center p-3 font-mono ${getCorrelationColor(row.qqq)}`}>
                            {row.qqq.toFixed(2)}
                          </td>
                          <td className={`text-center p-3 font-mono ${getCorrelationColor(row.vix)}`}>
                            {row.vix.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Correlation Heatmap */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Correlation Heatmap</h3>
                <div className="grid grid-cols-6 gap-2">
                  {correlationData.map((row) => 
                    Object.entries(row).filter(([key]) => key !== 'asset').map(([key, value]) => (
                      <div
                        key={`${row.asset}-${key}`}
                        className={`p-4 rounded-lg text-center font-mono font-bold ${
                          Math.abs(value) > 0.7 
                            ? 'bg-red-500/20 border border-red-400/30 text-red-400'
                            : Math.abs(value) > 0.4
                            ? 'bg-yellow-500/20 border border-yellow-400/30 text-yellow-400'
                            : 'bg-green-500/20 border border-green-400/30 text-green-400'
                        }`}
                      >
                        {value.toFixed(2)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'sector' && (
            <motion.div
              key="sector"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Sector Allocation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white font-mono mb-4">Sector Allocation</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="weight"
                        label={({ sector, weight }) => `${sector} ${weight}%`}
                      >
                        {sectorData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #4B5563',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white font-mono mb-4">Sector Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sectorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="sector" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #4B5563',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="return" fill="#00F2FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sector Details Table */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Sector Analysis Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-3 text-cyan-400 font-mono">Sector</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">Weight (%)</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">Return (%)</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">Volatility (%)</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">Sharpe Ratio</th>
                        <th className="text-center p-3 text-cyan-400 font-mono">Market Cap ($M)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectorData.map((sector) => (
                        <tr key={sector.sector} className="border-t border-gray-600/30">
                          <td className="p-3 text-white font-mono font-bold">{sector.sector}</td>
                          <td className="text-center p-3 text-cyan-400 font-mono">{sector.weight}%</td>
                          <td className={`text-center p-3 font-mono ${getPerformanceColor(sector.return)}`}>
                            {sector.return}%
                          </td>
                          <td className="text-center p-3 text-yellow-400 font-mono">{sector.volatility}%</td>
                          <td className={`text-center p-3 font-mono ${getRiskColor(sector.sharpe, 'positive')}`}>
                            {sector.sharpe}
                          </td>
                          <td className="text-center p-3 text-green-400 font-mono">
                            ${(sector.marketCap / 1000).toFixed(1)}B
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedAnalytics; 