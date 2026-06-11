import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faDollarSign, faChartLine, faSync, faEye, faEyeSlash, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { api } from '../utils/api';

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
  const [error, setError] = useState<string | null>(null);

  const refreshBalances = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const wallet = await api.getWallet() as {
        balance: number;
        currency: string;
        portfolioValue: number;
        totalEquity: number;
        invested: number;
        profitLoss: number;
      };
      setBalances([
        {
          accountId: 'PAPER-001',
          accountType: 'Paper Trading Account',
          balance: wallet.totalEquity,
          currency: wallet.currency || 'INR',
          availableFunds: wallet.balance,
          marginUsed: wallet.invested ?? wallet.portfolioValue,
          unrealizedPnL: wallet.profitLoss ?? 0,
          lastUpdated: new Date(),
          status: 'active',
        },
      ]);
    } catch (e) {
      setError((e as Error).message);
      setBalances([]);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshBalances();
  }, [refreshBalances]);

  const getTotalBalance = () =>
    balances.reduce((total, b) => total + (b.currency === 'INR' ? b.balance : b.balance), 0);

  const getTotalAvailableFunds = () =>
    balances.reduce((total, b) => total + b.availableFunds, 0);

  const getTotalUnrealizedPnL = () =>
    balances.reduce((total, b) => total + b.unrealizedPnL, 0);

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return `${amount.toFixed(2)} ${currency}`;
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900/50 via-blue-900/30 to-gray-900/50 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <FontAwesomeIcon icon={faWallet} className="text-black text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono">Paper Trading Wallet</h2>
            <p className="text-cyan-400 font-mono text-sm">Live prices · virtual funds only</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
            title={showBalances ? 'Hide balances' : 'Show balances'}
          >
            <FontAwesomeIcon icon={showBalances ? faEyeSlash : faEye} className="text-cyan-400 text-lg" />
          </button>
          <button
            onClick={refreshBalances}
            disabled={isRefreshing}
            className={`p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Refresh balances"
          >
            <FontAwesomeIcon icon={faSync} className={`text-cyan-400 text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4 font-mono">Sign in to view wallet · {error}</p>
      )}

      {showBalances && balances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-mono text-sm">Total Equity</span>
              <FontAwesomeIcon icon={faDollarSign} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{formatCurrency(getTotalBalance(), 'INR')}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 font-mono text-sm">Cash Available</span>
              <FontAwesomeIcon icon={faChartLine} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{formatCurrency(getTotalAvailableFunds(), 'INR')}</div>
          </div>
          <div className={`bg-gradient-to-br from-purple-900/30 to-pink-900/30 border rounded-xl p-4 ${
            getTotalUnrealizedPnL() >= 0 ? 'border-green-400/30' : 'border-red-400/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-mono text-sm ${getTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                Unrealized P&amp;L
              </span>
              <FontAwesomeIcon icon={faChartLine} className={getTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'} />
            </div>
            <div className={`text-2xl font-bold font-mono ${getTotalUnrealizedPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(getTotalUnrealizedPnL(), 'INR')}
            </div>
          </div>
        </div>
      )}

      {showBalances && balances.length > 0 && (
        <div className="space-y-4">
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
                <span className="text-green-400 font-mono text-xs">ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-gray-400 font-mono text-xs">Equity</span>
                  <div className="text-white font-bold font-mono">{formatCurrency(balance.balance, balance.currency)}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-mono text-xs">Cash</span>
                  <div className="text-green-400 font-bold font-mono">{formatCurrency(balance.availableFunds, balance.currency)}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-mono text-xs">Invested</span>
                  <div className="text-yellow-400 font-bold font-mono">{formatCurrency(balance.marginUsed, balance.currency)}</div>
                </div>
                <div>
                  <span className="text-gray-400 font-mono text-xs">P&amp;L</span>
                  <div className={`font-bold font-mono ${balance.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(balance.unrealizedPnL, balance.currency)}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-600/30 text-xs text-gray-400 font-mono flex justify-between">
                <span>Last Updated</span>
                <span>{balance.lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
