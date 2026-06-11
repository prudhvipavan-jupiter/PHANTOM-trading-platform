// P.H.A.N.T.O.M Advanced Trading Dashboard
// World-class trading interface for profit generation

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Users, 
  BarChart3, 
  Target,
  Shield,
  Zap,
  Activity,
  DollarSign,
  PieChart,
  LineChart
} from 'lucide-react';
import PhantomCard from '../common/PhantomCard';
import PhantomButton from '../common/PhantomButton';
import PhantomLoading from '../common/PhantomLoading';

interface MarketData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  technicalIndicators: {
    rsi: number;
    macd: { value: number; signal: number; histogram: number };
    bollingerBands: { upper: number; middle: number; lower: number };
  };
  sentiment: {
    overall: number;
    news: number;
    social: number;
  };
}

interface AIPrediction {
  symbol: string;
  prediction: {
    direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    strength: number;
    targetPrice: number;
    stopLoss: number;
  };
  confidence: number;
  riskMetrics: {
    volatility: number;
    maxDrawdown: number;
    sharpeRatio: number;
    riskLevel: string;
  };
  tradingSignals: Array<{
    type: string;
    direction?: string;
    confidence?: number;
    urgency?: string;
  }>;
}

interface TradingAnalytics {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  netPnL: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  aiTrades: number;
  aiWinRate: number;
  averageConfidence: number;
}

const AdvancedTradingDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [aiPredictions, setAiPredictions] = useState<AIPrediction[]>([]);
  const [analytics, setAnalytics] = useState<TradingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock market data
      const mockMarketData: MarketData[] = [
        {
          symbol: 'RELIANCE',
          currentPrice: 2450.50,
          change: 45.20,
          changePercent: 1.88,
          volume: 2500000,
          technicalIndicators: {
            rsi: 65.4,
            macd: { value: 12.5, signal: 8.2, histogram: 4.3 },
            bollingerBands: { upper: 2480, middle: 2450, lower: 2420 }
          },
          sentiment: { overall: 0.7, news: 0.8, social: 0.6 }
        },
        {
          symbol: 'TCS',
          currentPrice: 3520.75,
          change: -25.30,
          changePercent: -0.71,
          volume: 1800000,
          technicalIndicators: {
            rsi: 42.1,
            macd: { value: -5.2, signal: -2.1, histogram: -3.1 },
            bollingerBands: { upper: 3550, middle: 3520, lower: 3490 }
          },
          sentiment: { overall: -0.3, news: -0.2, social: -0.4 }
        },
        {
          symbol: 'HDFC',
          currentPrice: 1620.90,
          change: 18.45,
          changePercent: 1.15,
          volume: 3200000,
          technicalIndicators: {
            rsi: 58.7,
            macd: { value: 8.9, signal: 6.4, histogram: 2.5 },
            bollingerBands: { upper: 1640, middle: 1620, lower: 1600 }
          },
          sentiment: { overall: 0.5, news: 0.6, social: 0.4 }
        }
      ];

      // Mock AI predictions
      const mockAiPredictions: AIPrediction[] = [
        {
          symbol: 'RELIANCE',
          prediction: {
            direction: 'BULLISH',
            strength: 0.85,
            targetPrice: 2520,
            stopLoss: 2400
          },
          confidence: 87,
          riskMetrics: {
            volatility: 0.12,
            maxDrawdown: 0.08,
            sharpeRatio: 1.8,
            riskLevel: 'MEDIUM'
          },
          tradingSignals: [
            { type: 'ENTRY', direction: 'BULLISH', confidence: 87 },
            { type: 'RISK_MANAGEMENT', action: 'SET_STOP_LOSS', urgency: 'MEDIUM' }
          ]
        },
        {
          symbol: 'TCS',
          prediction: {
            direction: 'BEARISH',
            strength: 0.72,
            targetPrice: 3450,
            stopLoss: 3580
          },
          confidence: 78,
          riskMetrics: {
            volatility: 0.15,
            maxDrawdown: 0.12,
            sharpeRatio: 1.2,
            riskLevel: 'HIGH'
          },
          tradingSignals: [
            { type: 'EXIT', reason: 'HIGH_RISK', urgency: 'HIGH' }
          ]
        }
      ];

      // Mock analytics
      const mockAnalytics: TradingAnalytics = {
        totalTrades: 156,
        winRate: 68.5,
        totalPnL: 125000,
        netPnL: 118500,
        maxDrawdown: 8.5,
        sharpeRatio: 1.75,
        profitFactor: 2.1,
        aiTrades: 89,
        aiWinRate: 72.3,
        averageConfidence: 81.2
      };

      setMarketData(mockMarketData);
      setAiPredictions(mockAiPredictions);
      setAnalytics(mockAnalytics);
      setLoading(false);
    };

    loadData();
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HIGH': return 'text-orange-500';
      case 'VERY_HIGH': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return 'text-green-500';
    if (sentiment < -0.5) return 'text-red-500';
    return 'text-yellow-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PhantomLoading size="large" text="Loading Advanced Trading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-phantom-bg-primary via-phantom-bg-secondary to-phantom-bg-primary p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-phantom-text-primary mb-2">
            🚀 Advanced Trading Dashboard
          </h1>
          <p className="text-phantom-text-secondary text-lg">
            World-class trading platform with AI-powered insights
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'ai-trading', label: 'AI Trading', icon: Brain },
            { id: 'market-data', label: 'Market Data', icon: Activity },
            { id: 'analytics', label: 'Analytics', icon: PieChart },
            { id: 'copy-trading', label: 'Copy Trading', icon: Users },
            { id: 'risk-management', label: 'Risk Management', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <PhantomButton
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'secondary'}
                size="medium"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </PhantomButton>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PhantomCard className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-phantom-text-primary">
                  ₹{analytics?.netPnL.toLocaleString()}
                </h3>
                <p className="text-phantom-text-secondary">Net P&L</p>
              </PhantomCard>

              <PhantomCard className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-phantom-text-primary">
                  {analytics?.winRate}%
                </h3>
                <p className="text-phantom-text-secondary">Win Rate</p>
              </PhantomCard>

              <PhantomCard className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-phantom-text-primary">
                  {analytics?.aiWinRate}%
                </h3>
                <p className="text-phantom-text-secondary">AI Win Rate</p>
              </PhantomCard>

              <PhantomCard className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-phantom-text-primary">
                  {analytics?.sharpeRatio.toFixed(2)}
                </h3>
                <p className="text-phantom-text-secondary">Sharpe Ratio</p>
              </PhantomCard>
            </div>

            {/* AI Predictions Overview */}
            <PhantomCard>
              <h2 className="text-2xl font-bold text-phantom-text-primary mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                AI Trading Signals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiPredictions.map((prediction) => (
                  <div
                    key={prediction.symbol}
                    className="p-4 rounded-lg border border-phantom-border bg-phantom-bg-secondary"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-phantom-text-primary">
                        {prediction.symbol}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        prediction.prediction.direction === 'BULLISH' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {prediction.prediction.direction}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-phantom-text-secondary">Confidence:</span>
                        <span className="font-semibold text-phantom-text-primary">
                          {prediction.confidence}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-phantom-text-secondary">Target:</span>
                        <span className="font-semibold text-phantom-text-primary">
                          ₹{prediction.prediction.targetPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-phantom-text-secondary">Stop Loss:</span>
                        <span className="font-semibold text-phantom-text-primary">
                          ₹{prediction.prediction.stopLoss}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PhantomCard>
          </motion.div>
        )}

        {/* AI Trading Tab */}
        {activeTab === 'ai-trading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <PhantomCard>
              <h2 className="text-2xl font-bold text-phantom-text-primary mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                Advanced AI Predictions
              </h2>
              <div className="space-y-4">
                {aiPredictions.map((prediction) => (
                  <div
                    key={prediction.symbol}
                    className="p-6 rounded-lg border border-phantom-border bg-phantom-bg-secondary"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Prediction Details */}
                      <div>
                        <h3 className="text-xl font-bold text-phantom-text-primary mb-4">
                          {prediction.symbol} - AI Analysis
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-phantom-text-secondary">Direction:</span>
                            <span className={`font-semibold ${
                              prediction.prediction.direction === 'BULLISH' 
                                ? 'text-green-500' 
                                : 'text-red-500'
                            }`}>
                              {prediction.prediction.direction}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-phantom-text-secondary">Confidence:</span>
                            <span className="font-semibold text-phantom-text-primary">
                              {prediction.confidence}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-phantom-text-secondary">Strength:</span>
                            <span className="font-semibold text-phantom-text-primary">
                              {(prediction.prediction.strength * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Risk Metrics */}
                      <div>
                        <h4 className="font-semibold text-phantom-text-primary mb-3">
                          Risk Analysis
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-phantom-text-secondary">Volatility:</span>
                            <span className="font-semibold text-phantom-text-primary">
                              {(prediction.riskMetrics.volatility * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-phantom-text-secondary">Max Drawdown:</span>
                            <span className="font-semibold text-phantom-text-primary">
                              {(prediction.riskMetrics.maxDrawdown * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-phantom-text-secondary">Sharpe Ratio:</span>
                            <span className="font-semibold text-phantom-text-primary">
                              {prediction.riskMetrics.sharpeRatio.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-phantom-text-secondary">Risk Level:</span>
                            <span className={`font-semibold ${getRiskLevelColor(prediction.riskMetrics.riskLevel)}`}>
                              {prediction.riskMetrics.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Trading Signals */}
                      <div>
                        <h4 className="font-semibold text-phantom-text-primary mb-3">
                          Trading Signals
                        </h4>
                        <div className="space-y-2">
                          {prediction.tradingSignals.map((signal, index) => (
                            <div
                              key={index}
                              className="p-2 rounded bg-phantom-bg-primary border border-phantom-border"
                            >
                              <div className="text-sm font-medium text-phantom-text-primary">
                                {signal.type}
                              </div>
                              {signal.direction && (
                                <div className="text-xs text-phantom-text-secondary">
                                  Direction: {signal.direction}
                                </div>
                              )}
                              {signal.confidence && (
                                <div className="text-xs text-phantom-text-secondary">
                                  Confidence: {signal.confidence}%
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-6">
                      <PhantomButton variant="primary" size="medium">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Place Buy Order
                      </PhantomButton>
                      <PhantomButton variant="secondary" size="medium">
                        <Target className="w-4 h-4 mr-2" />
                        Set Alerts
                      </PhantomButton>
                      <PhantomButton variant="outline" size="medium">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analysis
                      </PhantomButton>
                    </div>
                  </div>
                ))}
              </div>
            </PhantomCard>
          </motion.div>
        )}

        {/* Market Data Tab */}
        {activeTab === 'market-data' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <PhantomCard>
              <h2 className="text-2xl font-bold text-phantom-text-primary mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2" />
                Real-Time Market Data
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-phantom-border">
                      <th className="text-left p-3 text-phantom-text-secondary">Symbol</th>
                      <th className="text-right p-3 text-phantom-text-secondary">Price</th>
                      <th className="text-right p-3 text-phantom-text-secondary">Change</th>
                      <th className="text-right p-3 text-phantom-text-secondary">Volume</th>
                      <th className="text-right p-3 text-phantom-text-secondary">RSI</th>
                      <th className="text-right p-3 text-phantom-text-secondary">Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((stock) => (
                      <tr key={stock.symbol} className="border-b border-phantom-border hover:bg-phantom-bg-secondary">
                        <td className="p-3 font-semibold text-phantom-text-primary">
                          {stock.symbol}
                        </td>
                        <td className="p-3 text-right font-semibold text-phantom-text-primary">
                          ₹{stock.currentPrice.toFixed(2)}
                        </td>
                        <td className={`p-3 text-right font-semibold ${
                          stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </td>
                        <td className="p-3 text-right text-phantom-text-secondary">
                          {(stock.volume / 1000000).toFixed(1)}M
                        </td>
                        <td className="p-3 text-right text-phantom-text-secondary">
                          {stock.technicalIndicators.rsi.toFixed(1)}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-semibold ${getSentimentColor(stock.sentiment.overall)}`}>
                            {(stock.sentiment.overall * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PhantomCard>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PhantomCard>
                <h2 className="text-2xl font-bold text-phantom-text-primary mb-6 flex items-center">
                  <PieChart className="w-6 h-6 mr-2" />
                  Trading Performance
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Total Trades:</span>
                    <span className="font-semibold text-phantom-text-primary">{analytics.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Win Rate:</span>
                    <span className="font-semibold text-green-500">{analytics.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Total P&L:</span>
                    <span className="font-semibold text-phantom-text-primary">₹{analytics.totalPnL.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Net P&L:</span>
                    <span className="font-semibold text-green-500">₹{analytics.netPnL.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Max Drawdown:</span>
                    <span className="font-semibold text-red-500">{analytics.maxDrawdown}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Sharpe Ratio:</span>
                    <span className="font-semibold text-phantom-text-primary">{analytics.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Profit Factor:</span>
                    <span className="font-semibold text-green-500">{analytics.profitFactor.toFixed(2)}</span>
                  </div>
                </div>
              </PhantomCard>

              <PhantomCard>
                <h2 className="text-2xl font-bold text-phantom-text-primary mb-6 flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  AI Performance
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">AI Trades:</span>
                    <span className="font-semibold text-phantom-text-primary">{analytics.aiTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">AI Win Rate:</span>
                    <span className="font-semibold text-green-500">{analytics.aiWinRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">Average Confidence:</span>
                    <span className="font-semibold text-phantom-text-primary">{analytics.averageConfidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-phantom-text-secondary">AI vs Manual:</span>
                    <span className="font-semibold text-green-500">
                      +{(analytics.aiWinRate - analytics.winRate).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </PhantomCard>
            </div>
          </motion.div>
        )}

        {/* Copy Trading Tab */}
        {activeTab === 'copy-trading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <PhantomCard>
              <h2 className="text-2xl font-bold text-phantom-text-primary mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Copy Trading
              </h2>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-phantom-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-phantom-text-primary mb-2">
                  Copy Trading Coming Soon
                </h3>
                <p className="text-phantom-text-secondary mb-6">
                  Follow successful traders and automatically copy their trades
                </p>
                <PhantomButton variant="primary" size="large">
                  <Users className="w-5 h-5 mr-2" />
                  Get Notified
                </PhantomButton>
              </div>
            </PhantomCard>
          </motion.div>
        )}

        {/* Risk Management Tab */}
        {activeTab === 'risk-management' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <PhantomCard>
              <h2 className="text-2xl font-bold text-phantom-text-primary mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Risk Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-phantom-text-primary">Current Limits</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Max Position Size:</span>
                      <span className="font-semibold text-phantom-text-primary">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Daily Loss Limit:</span>
                      <span className="font-semibold text-phantom-text-primary">5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Max Drawdown:</span>
                      <span className="font-semibold text-phantom-text-primary">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Max Open Positions:</span>
                      <span className="font-semibold text-phantom-text-primary">10</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-phantom-text-primary">Risk Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Current Risk Level:</span>
                      <span className="font-semibold text-green-500">LOW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Portfolio Exposure:</span>
                      <span className="font-semibold text-phantom-text-primary">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Daily P&L:</span>
                      <span className="font-semibold text-green-500">+₹12,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-phantom-text-secondary">Risk Score:</span>
                      <span className="font-semibold text-green-500">2.3/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </PhantomCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AdvancedTradingDashboard; 