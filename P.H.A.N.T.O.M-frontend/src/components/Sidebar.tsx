import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBrain,
  faChartPie,
  faShieldAlt,
  faSignOutAlt,
  faChevronUp,
  faChevronDown,
  faDollarSign,
  faBullseye,
  faCog,
  faHistory,
  faNewspaper,
  faCog as faSettings,
  faShieldAlt as faCompliance,
  faWallet,
  faCalculator,
  faUsers,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [openSections, setOpenSections] = useState({
    trading: true,
    intelligence: false,
    market: false,
    compliance: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = () => {
    onLogout();
  };

  const tradingItems = [
    { path: '/dashboard', name: 'Money Generation', icon: faDollarSign },
    { path: '/advanced-trading', name: '🚀 Advanced Trading', icon: faChartLine },
    { path: '/portfolio', name: 'Portfolio', icon: faChartLine },
    { path: '/portfolio-management', name: 'Portfolio Management', icon: faCog },
    { path: '/trade-history', name: 'Trade History', icon: faHistory },
    { path: '/wallet', name: 'Wallet', icon: faWallet },
    { path: '/advanced-analytics', name: 'Advanced Analytics', icon: faCalculator },
    { path: '/social-trading', name: 'Social Trading', icon: faUsers }
  ];

  const intelligenceItems = [
    { path: '/ai-strategy-builder', name: 'AI Strategy Builder', icon: faBrain },
    { path: '/ai-trainer', name: 'AI Trainer', icon: faCog },
    { path: '/ai-model-training', name: 'AI Model Training', icon: faDatabase },
    { path: '/backtesting-engine', name: 'Backtesting Engine', icon: faBullseye }
  ];

  const marketItems = [
    { path: '/market-watch', name: 'Market Watch', icon: faChartLine },
    { path: '/news-sentiment', name: 'News & Sentiment', icon: faNewspaper },
    { path: '/daily-opportunities', name: 'Daily Opportunities', icon: faBullseye }
  ];

  const complianceItems = [
    { path: '/compliance', name: 'SEBI Compliance', icon: faCompliance },
    { path: '/security-center', name: 'Security Center', icon: faShieldAlt },
    { path: '/settings', name: 'Settings', icon: faSettings }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 border-r border-cyan-400/30 shadow-2xl shadow-cyan-500/20 flex flex-col">
      {/* JARVIS Header */}
      <div className="p-6 border-b border-cyan-400/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img src="/phantom-logo.svg" alt="P.H.A.N.T.O.M" className="w-16 h-16" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-30 animate-pulse" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-mono">
              P.H.A.N.T.O.M
            </h1>
            <p className="text-cyan-300 font-mono text-xs mt-1">Neural Trading Operations</p>
            <p className="text-cyan-400 font-mono text-xs font-bold mt-1">Powered By J.U.P.I.T.E.R AI</p>
          </div>
        </div>
        </div>

      {/* JARVIS Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Trading & Portfolio Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('trading')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faChartLine} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-cyan-300 font-mono font-bold group-hover:text-white transition-colors">Trading & Portfolio</span>
            </div>
            <FontAwesomeIcon 
              icon={openSections.trading ? faChevronUp : faChevronDown} 
              className="text-cyan-400 group-hover:text-cyan-300 transition-colors" 
            />
          </button>
          
          {openSections.trading && (
            <div className="mt-2 ml-4 space-y-2">
              {tradingItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-900/10 via-cyan-900/10 to-blue-900/10 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:via-blue-900/20 hover:to-cyan-900/20 transition-all duration-300 group"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="text-cyan-200 font-mono group-hover:text-white transition-colors">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* AI & Intelligence Section */}
        <div className="mb-6">
              <button
            onClick={() => toggleSection('intelligence')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faBrain} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-cyan-300 font-mono font-bold group-hover:text-white transition-colors">AI & Intelligence</span>
            </div>
            <FontAwesomeIcon 
              icon={openSections.intelligence ? faChevronUp : faChevronDown} 
              className="text-cyan-400 group-hover:text-cyan-300 transition-colors" 
            />
              </button>

          {openSections.intelligence && (
            <div className="mt-2 ml-4 space-y-2">
              {intelligenceItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-900/10 via-cyan-900/10 to-blue-900/10 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:via-blue-900/20 hover:to-cyan-900/20 transition-all duration-300 group"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="text-cyan-200 font-mono group-hover:text-white transition-colors">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Market Intelligence Section */}
        <div className="mb-6">
                    <button
            onClick={() => toggleSection('market')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faChartPie} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-cyan-300 font-mono font-bold group-hover:text-white transition-colors">Market Intelligence</span>
            </div>
            <FontAwesomeIcon 
              icon={openSections.market ? faChevronUp : faChevronDown} 
              className="text-cyan-400 group-hover:text-cyan-300 transition-colors" 
            />
          </button>
          
          {openSections.market && (
            <div className="mt-2 ml-4 space-y-2">
              {marketItems.map((item) => (
                <Link
                      key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-900/10 via-cyan-900/10 to-blue-900/10 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:via-blue-900/20 hover:to-cyan-900/20 transition-all duration-300 group"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="text-cyan-200 font-mono group-hover:text-white transition-colors">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Compliance & Settings Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('compliance')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faShieldAlt} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="text-cyan-300 font-mono font-bold group-hover:text-white transition-colors">Compliance & Settings</span>
            </div>
            <FontAwesomeIcon 
              icon={openSections.compliance ? faChevronUp : faChevronDown} 
              className="text-cyan-400 group-hover:text-cyan-300 transition-colors" 
            />
                    </button>
          
          {openSections.compliance && (
            <div className="mt-2 ml-4 space-y-2">
              {complianceItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-900/10 via-cyan-900/10 to-blue-900/10 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:via-blue-900/20 hover:to-cyan-900/20 transition-all duration-300 group"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="text-cyan-200 font-mono group-hover:text-white transition-colors">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        </nav>

      {/* JARVIS Footer */}
      <div className="p-4 border-t border-cyan-400/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-900/20 via-red-800/20 to-red-900/20 backdrop-blur-sm border border-red-400/30 hover:border-red-400/60 hover:bg-gradient-to-r hover:from-red-800/30 hover:via-red-700/30 hover:to-red-800/30 transition-all duration-300 group"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-red-400 group-hover:text-red-300 transition-colors" />
          <span className="text-red-300 font-mono font-bold group-hover:text-white transition-colors">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 