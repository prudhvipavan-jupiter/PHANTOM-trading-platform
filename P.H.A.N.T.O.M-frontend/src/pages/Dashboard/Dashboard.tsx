import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBrain,
  faRobot,
  faDollarSign,
  faBullseye,
  faCog,
  faBell,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications } from '../../contexts/NotificationContext';
import WalletBalance from '../../components/WalletBalance';
// Removed unused utility imports
import {
  PortfolioPerformanceChart,
  ProfitLossChart,
  TradingVolumeChart,
  PortfolioAllocationChart,
  AIConfidenceChart,
  MarketSentimentChart,
  TradingSignalsChart
} from '../../components/DashboardCharts';
// Notification components removed for production

// Removed unused function

// Removed unused function

// Removed unused mock data

// Removed unused mock data

// Removed unused mock data

// Removed unused mock data

// Removed unused mock data

// Removed unused mock data

const Dashboard = React.memo(() => {
  const [currentMode, setCurrentMode] = useState('autonomous');
  const [showAlerts, setShowAlerts] = useState(false);
  const [totalProfit, setTotalProfit] = useState(626540);
  const [todayProfit, setTodayProfit] = useState(43960);
  const [totalVolume, setTotalVolume] = useState(15341501);
  const { showSuccess } = useToast();
  const { setAlertsEnabled, addNotification } = useNotifications();

  useEffect(() => {
    // Add demo notifications on component mount (only once)
    const hasAddedNotifications = sessionStorage.getItem('demoNotificationsAdded');
    
    if (!hasAddedNotifications) {
      addNotification({
        type: 'success',
        title: 'Trade Executed Successfully',
        message: 'BUY order for BTC/INR executed at ₹45,230.50. Profit: +₹2,450',
        priority: 'high',
        action: {
          label: 'View Trade',
          onClick: () => console.log('View trade details')
        }
      });

      addNotification({
        type: 'warning',
        title: 'Risk Level Elevated',
        message: 'Portfolio risk level has increased to 7.2. Consider rebalancing.',
        priority: 'medium',
        action: {
          label: 'Review Portfolio',
          onClick: () => console.log('Review portfolio')
        }
      });

      addNotification({
        type: 'info',
        title: 'Market Update',
        message: 'BTC showing strong momentum. AI confidence: 94%',
        priority: 'low'
      });

      addNotification({
        type: 'error',
        title: 'Connection Lost',
        message: 'Temporary connection issue with market data feed. Retrying...',
        priority: 'critical',
        action: {
          label: 'Retry Now',
          onClick: () => console.log('Retry connection')
        }
      });

      // Mark that notifications have been added
      sessionStorage.setItem('demoNotificationsAdded', 'true');
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    const interval = setInterval(() => {
      setTodayProfit(prev => prev + Math.floor(Math.random() * 1000) + 200);
      setTotalProfit(prev => prev + Math.floor(Math.random() * 2000) + 500);
      setTotalVolume(prev => prev + Math.floor(Math.random() * 100000) + 50000);
      
      if (showAlerts && Math.random() > 0.8) {
        showSuccess('Profit Update', `Generated ₹${Math.floor(Math.random() * 5000) + 1000} in new trades!`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [showSuccess, showAlerts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* JARVIS-style animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30" />
      </div>

      <div className="relative z-10 p-6 space-y-6 overflow-y-auto">
        {/* JARVIS Header */}
        <div 
          className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src="/phantom-logo.svg" alt="P.H.A.N.T.O.M" className="w-12 h-12" />
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-30 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                P.H.A.N.T.O.M
              </h1>
              <p className="text-cyan-300 font-mono text-sm">Personalized High-Autonomy Neural Trading Operations Manager</p>
              <p className="text-blue-300 font-mono text-xs">AI-Powered Autonomous Wealth Generation System</p>
              <p className="text-cyan-400 font-mono text-xs font-bold">Powered By J.U.P.I.T.E.R AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newMode = currentMode === 'autonomous' ? 'semi-automatic' : currentMode === 'semi-automatic' ? 'manual' : 'autonomous';
                setCurrentMode(newMode);
                showSuccess('Mode Changed', `Switched to ${newMode} mode`);
              }}
              className={`px-6 py-3 rounded-xl font-mono font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                currentMode === 'autonomous'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-green-500/50 animate-pulse'
                  : currentMode === 'semi-automatic'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/50'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
              }`}
            >
              <FontAwesomeIcon icon={faRobot} className="mr-2" />
              {currentMode === 'autonomous' ? 'Autonomous Money Generation Active' : 
               currentMode === 'semi-automatic' ? 'Semi-Automatic Mode Active' : 'Manual Mode Active'}
            </button>
            
            <button
              onClick={() => {
                const newAlertState = !showAlerts;
                setShowAlerts(newAlertState);
                setAlertsEnabled(newAlertState);
                console.log(`🔔 Alerts ${newAlertState ? 'enabled' : 'disabled'}`);
              }}
              className={`px-6 py-3 rounded-xl font-mono font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                showAlerts
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/50'
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60'
              }`}
            >
              <FontAwesomeIcon icon={faBell} className="mr-2" />
              {showAlerts ? 'Hide Alerts' : 'Show Alerts'}
            </button>
          </div>
        </div>

        {/* Wallet Balance Section */}
        <div>
          <WalletBalance />
        </div>

        {/* JARVIS Key Performance Indicators */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'Total Generated',
              value: `₹${totalProfit.toLocaleString()}`,
              change: `+₹${(totalProfit * 0.15).toLocaleString()} this month (+15.2%)`,
              icon: faDollarSign,
              gradient: 'from-blue-500 to-cyan-500',
              color: 'text-blue-400'
            },
            {
              title: "Today's Profit",
              value: `₹${todayProfit.toLocaleString()}`,
              change: `+₹${(todayProfit * 0.08).toLocaleString()} today (+8.3%)`,
              icon: faBullseye,
              gradient: 'from-orange-500 to-red-500',
              color: 'text-orange-400'
            },
            {
              title: 'Active Trades',
              value: '47',
              change: '94.2% success rate, 44 profitable',
              icon: faCog,
              gradient: 'from-pink-500 to-purple-500',
              color: 'text-pink-400'
            },
            {
              title: 'Trading Volume',
              value: `₹${totalVolume.toLocaleString()}`,
              change: `+₹${(totalVolume * 0.05).toLocaleString()} today (+5.2%)`,
                              icon: faArrowUp,
              gradient: 'from-green-500 to-cyan-500',
              color: 'text-green-400'
            }
          ].map((kpi, index) => (
            <div
              key={kpi.title}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-102 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${kpi.gradient} bg-opacity-20 border border-cyan-400/30`}>
                  <FontAwesomeIcon icon={kpi.icon} className={`text-2xl ${kpi.color}`} />
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase">{kpi.title}</h3>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white font-mono">{kpi.value}</p>
                <p className="text-sm text-cyan-200 font-mono">{kpi.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <PortfolioPerformanceChart />
          <ProfitLossChart />
        </div>

        {/* Secondary Charts Grid */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <TradingVolumeChart />
          <PortfolioAllocationChart />
        </div>

        {/* AI Charts Grid */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AIConfidenceChart />
          <MarketSentimentChart />
        </div>

        {/* Trading Signals Chart - Full Width */}
        <div>
          <TradingSignalsChart />
        </div>

        {/* AI Status Panel */}
        <div
          className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
        >
          <h2 className="text-xl font-bold text-cyan-400 font-mono mb-4 flex items-center">
            <FontAwesomeIcon icon={faBrain} className="mr-2" />
            JARVIS AI Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'AI Engine', status: 'OPERATIONAL', color: 'text-green-400' },
              { name: 'Neural Networks', status: 'ACTIVE', color: 'text-green-400' },
              { name: 'Risk Management', status: 'ENABLED', color: 'text-green-400' },
              { name: 'Market Data', status: 'REAL-TIME', color: 'text-green-400' },
              { name: 'Trading Bots', status: 'RUNNING', color: 'text-green-400' },
              { name: 'Compliance', status: 'VERIFIED', color: 'text-green-400' }
            ].map((system) => (
              <div key={system.name} className="p-4 rounded-xl bg-gradient-to-r from-blue-900/10 to-cyan-900/10 border border-cyan-400/20">
                <h3 className="text-sm font-bold text-cyan-300 font-mono mb-2">{system.name}</h3>
                <p className={`text-lg font-bold font-mono ${system.color}`}>{system.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        <div
          className="p-6 rounded-2xl bg-gradient-to-r from-green-900/20 to-emerald-900/20 backdrop-blur-xl border border-green-400/30 shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 font-mono mb-2">🎉 P.H.A.N.T.O.M is Running!</h2>
            <p className="text-green-200 font-mono">Your AI-powered trading system is now operational and generating wealth automatically.</p>
          </div>
        </div>

        {/* Notification system is now integrated in the Header component */}

      </div>
    </div>
  );
});

export default Dashboard;