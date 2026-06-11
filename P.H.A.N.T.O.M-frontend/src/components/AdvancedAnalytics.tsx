import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faBrain, 
  faThermometerHalf,
  faLayerGroup,
  faCog,
  faDownload,
  faExpand,
  faCompress
} from '@fortawesome/free-solid-svg-icons';
import ReactApexChart from 'react-apexcharts';

interface CorrelationData {
  symbol: string;
  btc: number;
  eth: number;
  reliance: number;
  tcs: number;
  gold: number;
  eur: number;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'hold';
  strength: number;
  description: string;
}

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'correlation' | 'indicators' | 'overlays'>('heatmap');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock correlation data
  const correlationData: CorrelationData[] = [
    { symbol: 'BTC/INR', btc: 1.0, eth: 0.85, reliance: 0.12, tcs: 0.08, gold: 0.23, eur: 0.45 },
    { symbol: 'ETH/INR', btc: 0.85, eth: 1.0, reliance: 0.15, tcs: 0.10, gold: 0.28, eur: 0.52 },
    { symbol: 'RELIANCE', btc: 0.12, eth: 0.15, reliance: 1.0, tcs: 0.78, gold: 0.05, eur: 0.18 },
    { symbol: 'TCS', btc: 0.08, eth: 0.10, reliance: 0.78, tcs: 1.0, gold: 0.03, eur: 0.15 },
    { symbol: 'GOLD', btc: 0.23, eth: 0.28, reliance: 0.05, tcs: 0.03, gold: 1.0, eur: 0.35 },
    { symbol: 'EUR/INR', btc: 0.45, eth: 0.52, reliance: 0.18, tcs: 0.15, gold: 0.35, eur: 1.0 }
  ];

  // Mock technical indicators
  const technicalIndicators: TechnicalIndicator[] = [
    { name: 'RSI (14)', value: 65.4, signal: 'hold', strength: 7, description: 'Neutral momentum, no clear signal' },
    { name: 'MACD (12,26,9)', value: 0.023, signal: 'buy', strength: 8, description: 'Bullish crossover detected' },
    { name: 'Bollinger Bands', value: 0.78, signal: 'sell', strength: 6, description: 'Price near upper band' },
    { name: 'Stochastic (14,3)', value: 82.1, signal: 'sell', strength: 7, description: 'Overbought condition' },
    { name: 'Williams %R', value: -18.5, signal: 'buy', strength: 9, description: 'Strong oversold signal' },
    { name: 'CCI (20)', value: 156.7, signal: 'buy', strength: 8, description: 'Strong bullish momentum' },
    { name: 'ADX (14)', value: 28.3, signal: 'hold', strength: 5, description: 'Weak trend strength' },
    { name: 'Ichimoku Cloud', value: 0.45, signal: 'buy', strength: 7, description: 'Price above cloud' }
  ];

  // Heat map chart options
  const heatmapOptions = {
    chart: {
      type: 'heatmap' as const,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#000']
      }
    },
    colors: ['#00f2ff'],
    xaxis: {
      labels: {
        style: {
          colors: '#00f2ff',
          fontFamily: 'monospace'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#00f2ff',
          fontFamily: 'monospace'
        }
      }
    },
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: true,
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: -1, to: 0, color: '#ef4444', name: 'Negative' },
            { from: 0, to: 0.3, color: '#f59e0b', name: 'Low' },
            { from: 0.3, to: 0.7, color: '#10b981', name: 'Medium' },
            { from: 0.7, to: 1, color: '#00f2ff', name: 'High' }
          ]
        }
      }
    }
  };

  const heatmapSeries = correlationData.map(item => ({
    name: item.symbol,
    data: [
      { x: 'BTC/INR', y: item.btc },
      { x: 'ETH/INR', y: item.eth },
      { x: 'RELIANCE', y: item.reliance },
      { x: 'TCS', y: item.tcs },
      { x: 'GOLD', y: item.gold },
      { x: 'EUR/INR', y: item.eur }
    ]
  }));

  // Volatility chart options
  const volatilityOptions = {
    chart: {
      type: 'area' as const,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: ['#00f2ff', '#f59e0b', '#ef4444'],
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      labels: {
        style: {
          colors: '#00f2ff',
          fontFamily: 'monospace'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#00f2ff',
          fontFamily: 'monospace'
        }
      }
    },
    legend: {
      labels: {
        colors: '#00f2ff',
        fontFamily: 'monospace'
      }
    }
  };

  const volatilitySeries = [
    {
      name: 'BTC Volatility',
      data: [2.1, 2.8, 3.2, 2.9, 3.5, 3.1, 2.7]
    },
    {
      name: 'ETH Volatility',
      data: [1.8, 2.3, 2.7, 2.4, 2.9, 2.6, 2.2]
    },
    {
      name: 'Market Volatility',
      data: [1.5, 2.0, 2.4, 2.1, 2.6, 2.3, 1.9]
    }
  ];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-green-400';
      case 'sell': return 'text-red-400';
      case 'hold': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 8) return 'bg-green-500';
    if (strength >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 bg-opacity-20 border border-cyan-400/30">
            <FontAwesomeIcon icon={faBrain} className="text-2xl text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 font-mono">Advanced Analytics</h2>
            <p className="text-cyan-300 font-mono text-sm">AI-Powered Market Analysis & Insights</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="text-cyan-400" />
          </motion.button>
          <motion.button
            className="p-2 rounded-lg bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download report"
          >
            <FontAwesomeIcon icon={faDownload} className="text-cyan-400" />
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { id: 'heatmap', label: 'Correlation Heatmap', icon: faThermometerHalf },
          { id: 'correlation', label: 'Volatility Analysis', icon: faChartLine },
          { id: 'indicators', label: 'Technical Indicators', icon: faCog },
          { id: 'overlays', label: 'Chart Overlays', icon: faLayerGroup }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono font-bold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/50'
                : 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={tab.icon} />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'heatmap' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-cyan-400 font-mono mb-2">Asset Correlation Matrix</h3>
              <p className="text-cyan-300 font-mono text-sm">Heat map showing correlation coefficients between different assets</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-4">
              <ReactApexChart
                options={heatmapOptions}
                series={heatmapSeries}
                type="heatmap"
                height={400}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'correlation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-cyan-400 font-mono mb-2">Volatility Analysis</h3>
              <p className="text-cyan-300 font-mono text-sm">24-hour volatility patterns across different assets</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-4">
              <ReactApexChart
                options={volatilityOptions}
                series={volatilitySeries}
                type="area"
                height={400}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'indicators' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-cyan-400 font-mono mb-2">Technical Indicators</h3>
              <p className="text-cyan-300 font-mono text-sm">Real-time technical analysis signals and strength indicators</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator.name}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-400/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white font-mono">{indicator.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${getSignalColor(indicator.signal)}`}>
                        {indicator.signal.toUpperCase()}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${getStrengthColor(indicator.strength)}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-mono text-sm">Value:</span>
                      <span className="text-white font-mono font-bold">{indicator.value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-mono text-sm">Strength:</span>
                      <span className="text-white font-mono font-bold">{indicator.strength}/10</span>
                    </div>
                    <p className="text-cyan-200 font-mono text-xs mt-2">{indicator.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'overlays' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-cyan-400 font-mono mb-2">Chart Overlays</h3>
              <p className="text-cyan-300 font-mono text-sm">Custom chart overlays and drawing tools</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-400/30">
                <h4 className="font-bold text-cyan-400 font-mono mb-3">Drawing Tools</h4>
                <div className="space-y-2">
                  {['Trend Lines', 'Fibonacci Retracement', 'Support/Resistance', 'Pivot Points'].map((tool) => (
                    <button
                      key={tool}
                      className="w-full p-2 text-left text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all font-mono text-sm"
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-400/30">
                <h4 className="font-bold text-cyan-400 font-mono mb-3">Indicators</h4>
                <div className="space-y-2">
                  {['Moving Averages', 'Bollinger Bands', 'RSI', 'MACD', 'Volume Profile'].map((indicator) => (
                    <button
                      key={indicator}
                      className="w-full p-2 text-left text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all font-mono text-sm"
                    >
                      {indicator}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdvancedAnalytics; 