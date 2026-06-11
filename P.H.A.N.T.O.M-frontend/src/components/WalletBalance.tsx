import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faDollarSign, faChartLine, faSync, faEye, faEyeSlash, faPlus, faMinus, faHistory, faShieldAlt, faCreditCard, faUniversity } from '@fortawesome/free-solid-svg-icons';

interface WalletBalanceProps {
  className?: string;
}

interface BalanceData {
  accountId: string;
  accountType: string;
  balance: number;
  currency: string;
  availableFunds: number;
  marginUsed: number;
  unrealizedPnL: number;
  lastUpdated: Date;
  status: 'active' | 'suspended' | 'pending';
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ className = '' }) => {
  const [balances, setBalances] = useState<BalanceData[]>([]);
  const [showBalances, setShowBalances] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Mock data - replace with actual broker API calls
  const mockBalances: BalanceData[] = [
    {
      accountId: 'ACC001',
      accountType: 'Trading Account',
      balance: 125000.50,
      currency: 'INR',
      availableFunds: 118750.25,
      marginUsed: 6250.25,
      unrealizedPnL: 2450.75,
      lastUpdated: new Date(),
      status: 'active'
    },
    {
      accountId: 'ACC002',
      accountType: 'Margin Account',
      balance: 75000.00,
      currency: 'INR',
      availableFunds: 67500.00,
      marginUsed: 7500.00,
      unrealizedPnL: 1250.50,
      lastUpdated: new Date(),
      status: 'active'
    },
    {
      accountId: 'ACC003',
      accountType: 'Crypto Wallet',
      balance: 0.85,
      currency: 'BTC',
      availableFunds: 0.85,
      marginUsed: 0,
      unrealizedPnL: 1250.00,
      lastUpdated: new Date(),
      status: 'active'
    }
  ];

  useEffect(() => {
    setBalances(mockBalances);
  }, []);

  const refreshBalances = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setBalances(mockBalances.map(balance => ({
      ...balance,
      lastUpdated: new Date()
    })));
    setIsRefreshing(false);
  };

  const getTotalBalance = () => {
    return balances.reduce((total, balance) => {
      if (balance.currency === 'INR') {
        return total + balance.balance;
      } else if (balance.currency === 'BTC') {
        // Convert BTC to INR (mock rate: 1 BTC = 3,750,000 INR)
        return total + (balance.balance * 3750000);
      }
      return total;
    }, 0);
  };

  const getTotalAvailableFunds = () => {
    return balances.reduce((total, balance) => {
      if (balance.currency === 'INR') {
        return total + balance.availableFunds;
      } else if (balance.currency === 'BTC') {
        return total + (balance.availableFunds * 3750000);
      }
      return total;
    }, 0);
  };

  const getTotalUnrealizedPnL = () => {
    return balances.reduce((total, balance) => {
      if (balance.currency === 'INR') {
        return total + balance.unrealizedPnL;
      } else if (balance.currency === 'BTC') {
        return total + (balance.unrealizedPnL * 3750000);
      }
      return total;
    }, 0);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'suspended':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return faShieldAlt;
      case 'suspended':
        return faMinus;
      case 'pending':
        return faSync;
      default:
        return faShieldAlt;
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900/50 via-blue-900/30 to-gray-900/50 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <FontAwesomeIcon icon={faWallet} className="text-black text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono">Broker Wallet Balance</h2>
            <p className="text-cyan-400 font-mono text-sm">Real-time account balances</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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
            onClick={refreshBalances}
            disabled={isRefreshing}
            className={`p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh balances"
          >
            <FontAwesomeIcon 
              icon={faSync} 
              className={`text-cyan-400 text-lg ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
      </div>

      {/* Total Balance Summary */}
      {showBalances && (
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-mono text-sm">Total Balance</span>
                <FontAwesomeIcon icon={faDollarSign} className="text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {formatCurrency(getTotalBalance(), 'INR')}
              </div>
              <div className="text-green-400 font-mono text-xs mt-1">
                Across all accounts
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-mono text-sm">Available Funds</span>
                <FontAwesomeIcon icon={faCreditCard} className="text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {formatCurrency(getTotalAvailableFunds(), 'INR')}
              </div>
              <div className="text-blue-400 font-mono text-xs mt-1">
                Ready for trading
              </div>
            </div>

            <div className={`bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-xl p-4 ${
              getTotalUnrealizedPnL() >= 0 ? 'border-green-400/30' : 'border-red-400/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-sm ${getTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  Unrealized P&L
                </span>
                <FontAwesomeIcon 
                  icon={faChartLine} 
                  className={getTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'} 
                />
              </div>
              <div className={`text-2xl font-bold font-mono ${getTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(getTotalUnrealizedPnL(), 'INR')}
              </div>
              <div className={`font-mono text-xs mt-1 ${getTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {getTotalUnrealizedPnL() >= 0 ? 'Profits' : 'Losses'}
              </div>
            </div>
          </div>
        )}

      {/* Account Details */}
      {showBalances && (
        <div
          className="space-y-4"
        >
            <h3 className="text-lg font-bold text-white font-mono mb-4">Account Details</h3>
            
            {balances.map((balance) => (
              <div
                key={balance.accountId}
                className={`bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-102 ${
                  selectedAccount === balance.accountId ? 'border-cyan-400/60 bg-gradient-to-br from-cyan-900/20 to-blue-900/20' : 'hover:border-cyan-400/30'
                }`}
                onClick={() => setSelectedAccount(selectedAccount === balance.accountId ? null : balance.accountId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <FontAwesomeIcon icon={faUniversity} className="text-black text-sm" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold font-mono">{balance.accountType}</h4>
                      <p className="text-gray-400 font-mono text-xs">ID: {balance.accountId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon 
                      icon={getStatusIcon(balance.status)} 
                      className={`text-sm ${getStatusColor(balance.status)}`} 
                    />
                    <span className={`font-mono text-xs ${getStatusColor(balance.status)}`}>
                      {balance.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-gray-400 font-mono text-xs">Balance</span>
                    <div className="text-white font-bold font-mono">
                      {formatCurrency(balance.balance, balance.currency)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 font-mono text-xs">Available</span>
                    <div className="text-green-400 font-bold font-mono">
                      {formatCurrency(balance.availableFunds, balance.currency)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 font-mono text-xs">Margin Used</span>
                    <div className="text-yellow-400 font-bold font-mono">
                      {formatCurrency(balance.marginUsed, balance.currency)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400 font-mono text-xs">P&L</span>
                    <div className={`font-bold font-mono ${balance.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(balance.unrealizedPnL, balance.currency)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-600/30">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono">Last Updated</span>
                    <span className="font-mono">{balance.lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Quick Actions */}
      {showBalances && (
        <div
          className="mt-6 pt-6 border-t border-gray-600/30"
        >
            <h3 className="text-lg font-bold text-white font-mono mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 hover:border-green-400/60 transition-all duration-300">
                <FontAwesomeIcon icon={faPlus} className="text-green-400 mb-2" />
                <div className="text-green-400 font-mono text-sm font-bold">Deposit</div>
              </button>
              
              <button className="p-3 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 hover:border-red-400/60 transition-all duration-300">
                <FontAwesomeIcon icon={faMinus} className="text-red-400 mb-2" />
                <div className="text-red-400 font-mono text-sm font-bold">Withdraw</div>
              </button>
              
              <button className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300">
                <FontAwesomeIcon icon={faHistory} className="text-blue-400 mb-2" />
                <div className="text-blue-400 font-mono text-sm font-bold">History</div>
              </button>
              
              <button className="p-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300">
                <FontAwesomeIcon icon={faShieldAlt} className="text-purple-400 mb-2" />
                <div className="text-purple-400 font-mono text-sm font-bold">Security</div>
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default WalletBalance; 