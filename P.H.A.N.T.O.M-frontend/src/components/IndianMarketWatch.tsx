import React, { useState, useEffect } from 'react';
import { indianMarketService } from '../services/indianMarketService';
import type { IndianStockQuote, IndianMarketData, TopGainersLosers } from '../services/indianMarketService';

const IndianMarketWatch: React.FC = () => {
  const [indices, setIndices] = useState<IndianMarketData | null>(null);
  const [popularStocks, setPopularStocks] = useState<IndianStockQuote[]>([]);
  const [gainersLosers, setGainersLosers] = useState<TopGainersLosers | null>(null);
  const [marketStatus, setMarketStatus] = useState<{ isOpen: boolean; nextOpen: string; nextClose: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'indices' | 'stocks' | 'gainers' | 'losers'>('indices');

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(loadMarketData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      const [indicesData, stocksData, gainersData, statusData] = await Promise.all([
        indianMarketService.getIndianIndices(),
        indianMarketService.getPopularIndianStocks(),
        indianMarketService.getTopGainersLosers(),
        indianMarketService.getMarketStatus()
      ]);

      setIndices(indicesData);
      setPopularStocks(stocksData);
      setGainersLosers(gainersData);
      setMarketStatus(statusData);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(2) + ' K';
    return num.toFixed(2);
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  const getChangeIcon = (change: number): string => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  if (loading) {
    return (
      <div className="phantom-card p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-main"></div>
          <span className="ml-3 text-text-secondary">Loading Indian Market Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="phantom-card p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-main">🇮🇳 Indian Market Watch</h2>
          <p className="text-text-secondary">Real-time Indian stock market data</p>
        </div>
        {marketStatus && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            marketStatus.isOpen ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {marketStatus.isOpen ? '🟢 Market Open' : '🔴 Market Closed'}
          </div>
        )}
      </div>

      {/* Market Status */}
      {marketStatus && (
        <div className="mb-6 p-4 bg-surface-secondary rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-text-secondary text-sm">Status</p>
              <p className={`font-semibold ${marketStatus.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                {marketStatus.isOpen ? 'Open' : 'Closed'}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Next Open</p>
              <p className="font-semibold text-text-primary">{marketStatus.nextOpen}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Next Close</p>
              <p className="font-semibold text-text-primary">{marketStatus.nextClose}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-surface-secondary rounded-lg p-1">
        {[
          { id: 'indices', label: 'Indices', count: indices ? Object.keys(indices).length : 0 },
          { id: 'stocks', label: 'Popular Stocks', count: popularStocks.length },
          { id: 'gainers', label: 'Top Gainers', count: gainersLosers?.gainers.length || 0 },
          { id: 'losers', label: 'Top Losers', count: gainersLosers?.losers.length || 0 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-main text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Indices Tab */}
        {activeTab === 'indices' && indices && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(indices).map(([key, index]) => (
              <div key={key} className="p-4 bg-surface-secondary rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-text-primary">{index.name}</h3>
                    <p className="text-sm text-text-secondary">{index.symbol}</p>
                  </div>
                  <span className={`text-lg font-bold ${getChangeColor(index.changePercent)}`}>
                    {getChangeIcon(index.changePercent)}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-text-primary">
                    {index.currentValue.toLocaleString('en-IN')}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className={getChangeColor(index.change)}>
                      {index.change > 0 ? '+' : ''}{index.change.toFixed(2)}
                    </span>
                    <span className={getChangeColor(index.changePercent)}>
                      {index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>H: {index.high.toLocaleString('en-IN')}</span>
                    <span>L: {index.low.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Stocks Tab */}
        {activeTab === 'stocks' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-secondary">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Stock</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Price</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Change</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">%</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Volume</th>
                </tr>
              </thead>
              <tbody>
                {popularStocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-surface-secondary hover:bg-surface-secondary">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-text-primary">{stock.symbol}</p>
                        <p className="text-sm text-text-secondary">{stock.companyName}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium text-text-primary">₹{stock.currentPrice.toFixed(2)}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getChangeColor(stock.change)}>
                        {stock.change > 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getChangeColor(stock.changePercent)}>
                        {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-text-secondary">
                      {formatNumber(stock.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Gainers Tab */}
        {activeTab === 'gainers' && gainersLosers && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-secondary">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Stock</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Price</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Change</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {gainersLosers.gainers.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-surface-secondary hover:bg-surface-secondary">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-text-primary">{stock.symbol}</p>
                        <p className="text-sm text-text-secondary">{stock.companyName}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium text-text-primary">₹{stock.currentPrice.toFixed(2)}</p>
                    </td>
                    <td className="py-3 px-4 text-right text-green-500">
                      +₹{stock.change.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-green-500">
                      +{stock.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Losers Tab */}
        {activeTab === 'losers' && gainersLosers && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-secondary">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Stock</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Price</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">Change</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {gainersLosers.losers.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-surface-secondary hover:bg-surface-secondary">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-text-primary">{stock.symbol}</p>
                        <p className="text-sm text-text-secondary">{stock.companyName}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium text-text-primary">₹{stock.currentPrice.toFixed(2)}</p>
                    </td>
                    <td className="py-3 px-4 text-right text-red-500">
                      ₹{stock.change.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-red-500">
                      {stock.changePercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={loadMarketData}
          className="phantom-button px-6 py-2"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default IndianMarketWatch; 