import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faChartLine, faSync, faEye, faEyeSlash, faPlus, faMinus, faHistory, faUniversity, faExchangeAlt, faArrowUp, faArrowDown, faQrcode, faCopy } from '@fortawesome/free-solid-svg-icons';
import WalletBalance from '../../components/WalletBalance';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'trade' | 'fee';
  amount: number;
  currency: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

interface WalletPageProps {
  className?: string;
}

const Wallet: React.FC<WalletPageProps> = ({ className = '' }) => {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'deposit' | 'withdraw'>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'deposit',
      amount: 50000,
      currency: 'INR',
      description: 'Bank transfer from HDFC Bank',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'completed',
      reference: 'REF123456789'
    },
    {
      id: 'TXN002',
      type: 'trade',
      amount: -2500,
      currency: 'INR',
      description: 'BTC/INR trade - SELL 0.05 BTC',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'completed',
      reference: 'TRADE987654321'
    },
    {
      id: 'TXN003',
      type: 'withdrawal',
      amount: -10000,
      currency: 'INR',
      description: 'Withdrawal to ICICI Bank',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'pending',
      reference: 'WTH456789123'
    },
    {
      id: 'TXN004',
      type: 'trade',
      amount: 1500,
      currency: 'INR',
      description: 'ETH/INR trade - BUY 0.5 ETH',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'completed',
      reference: 'TRADE321654987'
    },
    {
      id: 'TXN005',
      type: 'fee',
      amount: -25,
      currency: 'INR',
      description: 'Trading fee for BTC/INR trade',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'completed',
      reference: 'FEE789123456'
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return faArrowDown;
      case 'withdrawal':
        return faArrowUp;
      case 'transfer':
        return faExchangeAlt;
      case 'trade':
        return faChartLine;
      case 'fee':
        return faMinus;
      default:
        return faWallet;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-400';
      case 'withdrawal':
        return 'text-red-400';
      case 'transfer':
        return 'text-blue-400';
      case 'trade':
        return 'text-cyan-400';
      case 'fee':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } else if (currency === 'BTC') {
      return `${amount.toFixed(8)} BTC`;
    }
    return `${amount.toFixed(2)} ${currency}`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: faWallet },
    { id: 'transactions', label: 'Transactions', icon: faHistory },
    { id: 'deposit', label: 'Deposit', icon: faPlus },
    { id: 'withdraw', label: 'Withdraw', icon: faMinus }
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faWallet} className="text-black text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                WALLET MANAGEMENT
              </h1>
              <p className="text-cyan-400 font-mono text-sm">Manage your broker account balances and transactions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
              title={showBalances ? "Hide balances" : "Show balances"}
            >
              <FontAwesomeIcon 
                icon={showBalances ? faEyeSlash : faEye} 
                className="text-cyan-400 text-lg" 
              />
            </button>
            
            <button
              className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
              title="Refresh wallet"
            >
              <FontAwesomeIcon icon={faSync} className="text-cyan-400 text-lg" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Wallet Balance Section */}
        <AnimatePresence>
          {showBalances && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WalletBalance />
            </motion.div>
          )}
        </AnimatePresence>

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
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-green-400 font-mono font-bold">Total Deposits</h3>
                    <FontAwesomeIcon icon={faArrowDown} className="text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">$175,000.00</div>
                  <div className="text-green-400 font-mono text-sm mt-2">+$25,000 this month</div>
                </div>

                <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-red-400 font-mono font-bold">Total Withdrawals</h3>
                    <FontAwesomeIcon icon={faArrowUp} className="text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">$45,000.00</div>
                  <div className="text-red-400 font-mono text-sm mt-2">-$5,000 this month</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-blue-400 font-mono font-bold">Net Balance</h3>
                    <FontAwesomeIcon icon={faWallet} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">$130,000.00</div>
                  <div className="text-blue-400 font-mono text-sm mt-2">+$20,000 this month</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white font-mono mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center`}>
                          <FontAwesomeIcon icon={getTransactionIcon(transaction.type)} className={`text-sm ${getTransactionColor(transaction.type)}`} />
                        </div>
                        <div>
                          <p className="text-white font-mono text-sm">{transaction.description}</p>
                          <p className="text-gray-400 font-mono text-xs">{transaction.timestamp.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold font-mono ${getTransactionColor(transaction.type)}`}>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <p className={`text-xs font-mono ${getStatusColor(transaction.status)}`}>
                          {transaction.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white font-mono">Transaction History</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-400 font-mono text-sm">
                      Export
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-500/30 text-gray-300 font-mono text-sm">
                      Filter
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 hover:border-cyan-400/30 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center`}>
                          <FontAwesomeIcon icon={getTransactionIcon(transaction.type)} className={`text-lg ${getTransactionColor(transaction.type)}`} />
                        </div>
                        <div>
                          <p className="text-white font-mono font-bold">{transaction.description}</p>
                          <p className="text-gray-400 font-mono text-sm">Ref: {transaction.reference}</p>
                          <p className="text-gray-500 font-mono text-xs">{transaction.timestamp.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold font-mono ${getTransactionColor(transaction.type)}`}>
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <p className={`text-sm font-mono ${getStatusColor(transaction.status)}`}>
                          {transaction.status.toUpperCase()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'deposit' && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Transfer */}
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FontAwesomeIcon icon={faUniversity} className="text-green-400 text-xl" />
                    <h3 className="text-green-400 font-mono font-bold text-lg">Bank Transfer</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300 font-mono text-sm mb-2">Account Number</p>
                      <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <span className="text-white font-mono font-bold">1234567890</span>
                        <button 
                          className="text-cyan-400 hover:text-cyan-300"
                          title="Copy account number"
                          aria-label="Copy account number"
                        >
                          <FontAwesomeIcon icon={faCopy} className="text-sm" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-300 font-mono text-sm mb-2">IFSC Code</p>
                      <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <span className="text-white font-mono font-bold">HDFC0001234</span>
                        <button 
                          className="text-cyan-400 hover:text-cyan-300"
                          title="Copy IFSC code"
                          aria-label="Copy IFSC code"
                        >
                          <FontAwesomeIcon icon={faCopy} className="text-sm" />
                        </button>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-mono font-bold rounded-lg hover:from-green-400 hover:to-emerald-400 transition-all duration-300">
                      Copy Details
                    </button>
                  </div>
                </div>

                {/* UPI Payment */}
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FontAwesomeIcon icon={faQrcode} className="text-blue-400 text-xl" />
                    <h3 className="text-blue-400 font-mono font-bold text-lg">UPI Payment</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300 font-mono text-sm mb-2">UPI ID</p>
                      <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg border border-gray-600/30">
                        <span className="text-white font-mono font-bold">phantom@hdfc</span>
                        <button 
                          className="text-cyan-400 hover:text-cyan-300"
                          title="Copy UPI ID"
                          aria-label="Copy UPI ID"
                        >
                          <FontAwesomeIcon icon={faCopy} className="text-sm" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faQrcode} className="text-black text-4xl" />
                      </div>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-mono font-bold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all duration-300">
                      Scan QR Code
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'withdraw' && (
            <motion.div
              key="withdraw"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-400/30 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faArrowUp} className="text-red-400 text-xl" />
                  <h3 className="text-red-400 font-mono font-bold text-lg">Withdraw Funds</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 font-mono text-sm mb-2 block">Amount (INR)</label>
                    <input
                      type="number"
                      placeholder="Enter amount to withdraw"
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600/30 text-white font-mono focus:border-red-400/50 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-gray-300 font-mono text-sm mb-2 block">Bank Account</label>
                    <select 
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600/30 text-white font-mono focus:border-red-400/50 focus:outline-none"
                      aria-label="Select bank account for withdrawal"
                      title="Select bank account"
                    >
                      <option>HDFC Bank - ****7890</option>
                      <option>ICICI Bank - ****4567</option>
                      <option>Add New Account</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-gray-300 font-mono text-sm mb-2 block">Purpose</label>
                    <input
                      type="text"
                      placeholder="Purpose of withdrawal"
                      className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-600/30 text-white font-mono focus:border-red-400/50 focus:outline-none"
                    />
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-mono font-bold rounded-lg hover:from-red-400 hover:to-pink-400 transition-all duration-300">
                    Request Withdrawal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wallet; 