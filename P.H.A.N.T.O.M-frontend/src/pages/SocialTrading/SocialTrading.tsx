import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faTrophy, 
  faCopy, 
  faStar, 
  faChartLine, 
  faMedal,
  faCrown,
  faBell,
  faHeart,
  faShare,
  faEye,
  faEyeSlash,
  faSearch,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

interface SocialTradingProps {
  className?: string;
}

interface Trader {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  totalReturn: number;
  followers: number;
  trades: number;
  winRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  isFollowing: boolean;
  isVerified: boolean;
  badges: string[];
  lastActive: string;
  description: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  prize: number;
  participants: number;
  endDate: string;
  status: 'active' | 'upcoming' | 'ended';
  category: string;
}

interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
  isPinned: boolean;
}

const SocialTrading: React.FC<SocialTradingProps> = ({ className = '' }) => {
  const [selectedTab, setSelectedTab] = useState<'community' | 'leaderboard' | 'copy-trading' | 'challenges'>('community');
  const [showDetails, setShowDetails] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Mock Trader Data
  const traders: Trader[] = [
    {
      id: '1',
      name: 'CryptoKing',
      avatar: '👑',
      rank: 1,
      totalReturn: 245.67,
      followers: 15420,
      trades: 156,
      winRate: 87.5,
      riskLevel: 'Medium',
      isFollowing: true,
      isVerified: true,
      badges: ['Top Trader', 'Verified', 'Trending'],
      lastActive: '2 min ago',
      description: 'AI-powered crypto trader with 5+ years experience'
    },
    {
      id: '2',
      name: 'StockMaster',
      avatar: '📈',
      rank: 2,
      totalReturn: 189.34,
      followers: 12340,
      trades: 89,
      winRate: 82.1,
      riskLevel: 'Low',
      isFollowing: false,
      isVerified: true,
      badges: ['Consistent', 'Verified'],
      lastActive: '15 min ago',
      description: 'Conservative stock trader focusing on blue chips'
    },
    {
      id: '3',
      name: 'QuantumTrader',
      avatar: '⚡',
      rank: 3,
      totalReturn: 167.89,
      followers: 9870,
      trades: 234,
      winRate: 76.8,
      riskLevel: 'High',
      isFollowing: true,
      isVerified: true,
      badges: ['High Risk', 'Verified', 'Active'],
      lastActive: '5 min ago',
      description: 'High-frequency trading specialist'
    },
    {
      id: '4',
      name: 'AITraderPro',
      avatar: '🤖',
      rank: 4,
      totalReturn: 145.23,
      followers: 8760,
      trades: 67,
      winRate: 91.2,
      riskLevel: 'Medium',
      isFollowing: false,
      isVerified: true,
      badges: ['AI Expert', 'Verified'],
      lastActive: '1 hour ago',
      description: 'Machine learning trading algorithms'
    },
    {
      id: '5',
      name: 'DayTraderX',
      avatar: '🔥',
      rank: 5,
      totalReturn: 134.56,
      followers: 7650,
      trades: 445,
      winRate: 73.4,
      riskLevel: 'High',
      isFollowing: false,
      isVerified: false,
      badges: ['Day Trader', 'Active'],
      lastActive: '30 min ago',
      description: 'Aggressive day trading strategies'
    }
  ];

  // Mock Challenge Data
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Crypto Trading Championship',
      description: 'Compete in the ultimate crypto trading challenge',
      prize: 50000,
      participants: 1250,
      endDate: '2024-12-31',
      status: 'active',
      category: 'Cryptocurrency'
    },
    {
      id: '2',
      title: 'Stock Market Masters',
      description: 'Prove your stock trading skills',
      prize: 25000,
      participants: 890,
      endDate: '2024-11-30',
      status: 'active',
      category: 'Stocks'
    },
    {
      id: '3',
      title: 'AI Trading Challenge',
      description: 'Build and test AI trading strategies',
      prize: 35000,
      participants: 567,
      endDate: '2024-12-15',
      status: 'upcoming',
      category: 'AI Trading'
    }
  ];

  // Mock Forum Posts
  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: 'CryptoKing',
      title: 'Best AI Trading Strategies for 2024',
      content: 'Sharing my top AI trading strategies that have been working wonders...',
      likes: 234,
      comments: 45,
      timestamp: '2 hours ago',
      category: 'AI Trading',
      isPinned: true
    },
    {
      id: '2',
      author: 'StockMaster',
      title: 'Market Analysis: Tech Stocks Outlook',
      content: 'Detailed analysis of the current tech sector and future predictions...',
      likes: 156,
      comments: 32,
      timestamp: '4 hours ago',
      category: 'Market Analysis',
      isPinned: false
    },
    {
      id: '3',
      author: 'QuantumTrader',
      title: 'High-Frequency Trading Tips',
      content: 'Essential tips for successful HFT strategies...',
      likes: 89,
      comments: 23,
      timestamp: '6 hours ago',
      category: 'Trading Tips',
      isPinned: false
    }
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return faCrown;
    if (rank === 2) return faMedal;
    if (rank === 3) return faTrophy;
    return faStar;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-cyan-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getReturnColor = (returnValue: number) => {
    return returnValue > 100 ? 'text-green-400' : returnValue > 50 ? 'text-yellow-400' : 'text-red-400';
  };

  const tabs = [
    { id: 'community', label: 'Community', icon: faUsers },
    { id: 'leaderboard', label: 'Leaderboard', icon: faTrophy },
    { id: 'copy-trading', label: 'Copy Trading', icon: faCopy },
    { id: 'challenges', label: 'Challenges', icon: faMedal }
  ];

  const filteredTraders = traders.filter(trader => {
    const matchesSearch = trader.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || trader.riskLevel.toLowerCase() === filterRisk;
    return matchesSearch && matchesRisk;
  });

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
              <FontAwesomeIcon icon={faUsers} className="text-black text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                SOCIAL TRADING
              </h1>
              <p className="text-cyan-400 font-mono text-sm">Connect, compete, and copy successful traders</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
              title="Toggle notifications"
              aria-label="Toggle notifications"
            >
              <FontAwesomeIcon icon={faBell} className="text-cyan-400 text-lg" />
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

        {/* Search and Filter */}
        <motion.div
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search traders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-lg text-white font-mono focus:border-cyan-400/50 focus:outline-none"
            />
          </div>
          
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-lg text-cyan-400 font-mono focus:border-cyan-400/50 focus:outline-none"
            aria-label="Filter by risk level"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Community Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-blue-400 font-mono font-bold">Total Traders</h3>
                    <FontAwesomeIcon icon={faUsers} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">12,847</div>
                  <div className="text-blue-400 font-mono text-sm mt-2">+234 this week</div>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-green-400 font-mono font-bold">Active Trades</h3>
                    <FontAwesomeIcon icon={faChartLine} className="text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">45,234</div>
                  <div className="text-green-400 font-mono text-sm mt-2">+1,567 today</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-purple-400 font-mono font-bold">Total Volume</h3>
                    <FontAwesomeIcon icon={faChartLine} className="text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">$2.4B</div>
                  <div className="text-purple-400 font-mono text-sm mt-2">+$156M today</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-yellow-400 font-mono font-bold">Success Rate</h3>
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">78.5%</div>
                  <div className="text-yellow-400 font-mono text-sm mt-2">+2.3% this month</div>
                </div>
              </div>

              {/* Forum Posts */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Community Discussions</h3>
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 hover:border-cyan-400/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {post.isPinned && (
                              <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                            )}
                            <h4 className="text-white font-mono font-bold">{post.title}</h4>
                            <span className="text-cyan-400 font-mono text-xs bg-cyan-400/20 px-2 py-1 rounded">
                              {post.category}
                            </span>
                          </div>
                          <p className="text-gray-300 font-mono text-sm mb-2">{post.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span>By {post.author}</span>
                            <span>{post.timestamp}</span>
                            <span>{post.likes} likes</span>
                            <span>{post.comments} comments</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="Like post"
                            aria-label="Like post"
                          >
                            <FontAwesomeIcon icon={faHeart} className="text-sm" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                            title="Share post"
                            aria-label="Share post"
                          >
                            <FontAwesomeIcon icon={faShare} className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Top Performers */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-6">Top Traders Leaderboard</h3>
                <div className="space-y-4">
                  {filteredTraders.map((trader, index) => (
                    <motion.div
                      key={trader.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/30' 
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30'
                          : index === 2
                          ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30'
                          : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <FontAwesomeIcon 
                              icon={getRankIcon(trader.rank)} 
                              className={`text-lg ${getRankColor(trader.rank)}`} 
                            />
                            <span className="text-white font-mono font-bold">#{trader.rank}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-lg">
                              {trader.avatar}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-white font-mono font-bold">{trader.name}</h4>
                                {trader.isVerified && (
                                  <FontAwesomeIcon icon={faCheck} className="text-blue-400 text-sm" />
                                )}
                              </div>
                              <p className="text-gray-400 font-mono text-xs">{trader.description}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className={`text-lg font-bold font-mono ${getReturnColor(trader.totalReturn)}`}>
                              +{trader.totalReturn}%
                            </div>
                            <div className="text-gray-400 font-mono text-xs">Total Return</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-white font-mono font-bold">{trader.winRate}%</div>
                            <div className="text-gray-400 font-mono text-xs">Win Rate</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-white font-mono font-bold">{trader.followers.toLocaleString()}</div>
                            <div className="text-gray-400 font-mono text-xs">Followers</div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-mono font-bold ${getRiskColor(trader.riskLevel)}`}>
                              {trader.riskLevel}
                            </div>
                            <div className="text-gray-400 font-mono text-xs">Risk</div>
                          </div>
                          
                          <button
                            className={`px-4 py-2 rounded-lg font-mono font-bold transition-all duration-300 ${
                              trader.isFollowing
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black'
                            }`}
                          >
                            {trader.isFollowing ? 'Unfollow' : 'Follow'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {trader.badges.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="text-xs bg-cyan-400/20 text-cyan-400 px-2 py-1 rounded font-mono"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'copy-trading' && (
            <motion.div
              key="copy-trading"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Copy Trading Setup */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-400 font-mono mb-4">Copy Trading Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4">
                    <h4 className="text-white font-mono font-bold mb-2">Allocation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-mono text-sm">Total Budget:</span>
                        <span className="text-white font-mono font-bold">$50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-mono text-sm">Per Trade:</span>
                        <span className="text-white font-mono font-bold">$2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-mono text-sm">Max Risk:</span>
                        <span className="text-white font-mono font-bold">5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4">
                    <h4 className="text-white font-mono font-bold mb-2">Active Copies</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-mono text-sm">Traders:</span>
                        <span className="text-white font-mono font-bold">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-mono text-sm">Total Profit:</span>
                        <span className="text-green-400 font-mono font-bold">+$3,456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-mono text-sm">Success Rate:</span>
                        <span className="text-green-400 font-mono font-bold">82%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4">
                    <h4 className="text-white font-mono font-bold mb-2">Settings</h4>
                    <div className="space-y-2">
                      <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-mono font-bold rounded-lg">
                        Add Trader
                      </button>
                      <button className="w-full py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-mono font-bold rounded-lg">
                        Adjust Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Traders */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Available for Copy Trading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTraders.slice(0, 6).map((trader) => (
                    <motion.div
                      key={trader.id}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 hover:border-cyan-400/30 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                          {trader.avatar}
                        </div>
                        <div>
                          <h4 className="text-white font-mono font-bold">{trader.name}</h4>
                          <p className="text-gray-400 font-mono text-xs">{trader.riskLevel} Risk</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-mono text-xs">Return:</span>
                          <span className={`font-mono font-bold text-xs ${getReturnColor(trader.totalReturn)}`}>
                            +{trader.totalReturn}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-mono text-xs">Win Rate:</span>
                          <span className="text-white font-mono font-bold text-xs">{trader.winRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-mono text-xs">Followers:</span>
                          <span className="text-white font-mono font-bold text-xs">{trader.followers.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-mono font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300">
                        Copy Trades
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Active Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-xl border transition-all duration-300 ${
                      challenge.status === 'active'
                        ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-400/30'
                        : challenge.status === 'upcoming'
                        ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-400/30'
                        : 'bg-gradient-to-br from-gray-900/30 to-gray-800/30 border-gray-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-mono font-bold text-lg">{challenge.title}</h3>
                      <FontAwesomeIcon icon={faMedal} className="text-yellow-400" />
                    </div>
                    
                    <p className="text-gray-300 font-mono text-sm mb-4">{challenge.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-mono text-xs">Prize Pool:</span>
                        <span className="text-white font-mono font-bold">${challenge.prize.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-mono text-xs">Participants:</span>
                        <span className="text-white font-mono font-bold">{challenge.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-mono text-xs">End Date:</span>
                        <span className="text-white font-mono font-bold">{challenge.endDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        challenge.status === 'active'
                          ? 'bg-green-400/20 text-green-400'
                          : challenge.status === 'upcoming'
                          ? 'bg-blue-400/20 text-blue-400'
                          : 'bg-gray-400/20 text-gray-400'
                      }`}>
                        {challenge.status.toUpperCase()}
                      </span>
                      
                      <button className={`px-4 py-2 rounded-lg font-mono font-bold transition-all duration-300 ${
                        challenge.status === 'active'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black'
                          : challenge.status === 'upcoming'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-black'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                      }`}>
                        {challenge.status === 'active' ? 'Join Now' : challenge.status === 'upcoming' ? 'Register' : 'Ended'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialTrading; 