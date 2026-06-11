import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import IndianStockBrowser from './IndianStockBrowser';
import type { LiveQuote } from '../services/phantomApi';
import { isMarketOpen, getNextMarketOpen } from '../config/indianMarketConfig';

const IndianMarketWatch: React.FC = () => {
  const [indices, setIndices] = useState<LiveQuote[]>([]);
  const [summary, setSummary] = useState<{ totalSymbols: number; nseListed: number; bseListed: number; withLivePrice: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'stocks' | 'indices'>('stocks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [idx, sum] = await Promise.all([
          api.getNseIndices(),
          api.getIndianMarketSummary(),
        ]);
        setIndices(idx as LiveQuote[]);
        setSummary(sum);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const marketOpen = isMarketOpen();

  return (
    <div className="phantom-card p-6">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-main">Indian Market (NSE / BSE)</h2>
          <p className="text-text-secondary text-sm">
            Full symbol universe like a broker terminal — search, filter, and paginate
          </p>
          {summary && (
            <p className="text-xs text-cyan-400 mt-1">
              {summary.nseListed.toLocaleString()} NSE · {summary.bseListed.toLocaleString()} BSE ·{' '}
              {summary.withLivePrice.toLocaleString()} live prices
            </p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            marketOpen ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
          }`}
        >
          {marketOpen ? 'Market open' : `Closed · ${getNextMarketOpen()}`}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('stocks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'stocks' ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-300'
          }`}
        >
          All stocks
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('indices')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'indices' ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-300'
          }`}
        >
          Indices
        </button>
      </div>

      {activeTab === 'stocks' && (
        <IndianStockBrowser className="min-h-[520px]" />
      )}

      {activeTab === 'indices' && (
        <div className="space-y-3">
          {loading && <p className="text-text-secondary">Loading indices…</p>}
          {indices.map((idx) => (
            <div
              key={idx.symbol}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-800/40 border border-gray-700/50"
            >
              <div>
                <div className="font-bold text-white">{idx.symbolName || idx.symbol}</div>
                <div className="text-xs text-gray-400">{idx.symbol}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-white">₹{(idx.price ?? idx.currentPrice ?? 0).toLocaleString('en-IN')}</div>
                <div className={`text-sm ${(idx.changePercent ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(idx.changePercent ?? 0) >= 0 ? '+' : ''}{(idx.changePercent ?? 0).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndianMarketWatch;
