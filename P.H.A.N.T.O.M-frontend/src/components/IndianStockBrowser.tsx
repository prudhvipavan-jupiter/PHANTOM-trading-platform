import React, { useCallback, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { api } from '../utils/api';
import type { LiveQuote } from '../services/phantomApi';

interface IndianStockBrowserProps {
  onSelect?: (stock: LiveQuote) => void;
  className?: string;
}

const ROW_HEIGHT = 52;

const IndianStockBrowser: React.FC<IndianStockBrowserProps> = ({ onSelect, className = '' }) => {
  const [stocks, setStocks] = useState<LiveQuote[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pricedCount, setPricedCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [exchange, setExchange] = useState<'ALL' | 'NSE' | 'BSE'>('ALL');
  const [sort, setSort] = useState<'volume' | 'change' | 'symbol' | 'name'>('volume');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ totalSymbols: number; withLivePrice: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, exchange, sort]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getIndianStocks({
        page,
        limit: 100,
        search: debouncedSearch,
        exchange,
        sort,
      });
      setStocks(data.items as LiveQuote[]);
      setTotal(data.total);
      setPages(data.pages);
      setPricedCount(data.pricedCount);
    } catch (e) {
      setError((e as Error).message);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, exchange, sort]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    api.getIndianMarketSummary().then(setSummary).catch(() => undefined);
  }, []);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const s = stocks[index];
    if (!s) return null;
    const price = s.price ?? s.currentPrice ?? 0;
    const up = (s.changePercent ?? 0) >= 0;
    return (
      <div
        style={style}
        className="flex items-center px-3 border-b border-gray-700/50 hover:bg-gray-800/60 cursor-pointer text-sm"
        onClick={() => onSelect?.(s)}
      >
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white truncate">{s.symbol}</div>
          <div className="text-xs text-gray-400 truncate">{s.symbolName}</div>
        </div>
        <div className="w-16 text-center text-xs text-cyan-400">{s.exchange || 'NSE'}</div>
        <div className="w-24 text-right text-white font-mono">
          {price > 0 ? `₹${price.toFixed(2)}` : '—'}
        </div>
        <div className={`w-20 text-right font-mono ${up ? 'text-green-400' : 'text-red-400'}`}>
          {price > 0 ? `${up ? '+' : ''}${(s.changePercent ?? 0).toFixed(2)}%` : '—'}
        </div>
        <div className="w-24 text-right text-gray-400 text-xs">
          {s.volume ? s.volume.toLocaleString('en-IN') : '—'}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full min-h-[480px] ${className}`}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search 5,000+ stocks (symbol or name)…"
          className="flex-1 min-w-[200px] phantom-input"
        />
        <select
          className="phantom-input"
          value={exchange}
          onChange={(e) => setExchange(e.target.value as 'ALL' | 'NSE' | 'BSE')}
          title="Exchange filter"
        >
          <option value="ALL">All exchanges</option>
          <option value="NSE">NSE only</option>
          <option value="BSE">BSE only</option>
        </select>
        <select
          className="phantom-input"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          title="Sort order"
        >
          <option value="volume">Sort: Volume</option>
          <option value="change">Sort: % Change</option>
          <option value="symbol">Sort: Symbol</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {summary && (
        <p className="text-xs text-gray-400 mb-2">
          Universe: {summary.totalSymbols.toLocaleString()} symbols · {summary.withLivePrice.toLocaleString()} with live NSE prices
        </p>
      )}

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>
          Showing {stocks.length} of {total.toLocaleString()} matches · {pricedCount.toLocaleString()} priced
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 rounded bg-gray-800 disabled:opacity-40"
          >
            Prev
          </button>
          <span>Page {page} / {pages}</span>
          <button
            type="button"
            disabled={page >= pages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 rounded bg-gray-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] border border-gray-700/50 rounded-lg overflow-hidden">
        {loading && stocks.length === 0 ? (
          <p className="p-4 text-gray-400">Loading stocks…</p>
        ) : (
          <>
            <div className="flex items-center px-3 py-2 bg-gray-900/80 text-xs font-bold text-gray-300 border-b border-gray-700">
              <div className="flex-1">Symbol</div>
              <div className="w-16 text-center">Exch</div>
              <div className="w-24 text-right">LTP</div>
              <div className="w-20 text-right">Change</div>
              <div className="w-24 text-right">Volume</div>
            </div>
            <div className="h-[calc(100%-36px)]">
              <AutoSizer>
                {({ height, width }) => (
                  <List height={height} width={width} itemCount={stocks.length} itemSize={ROW_HEIGHT}>
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IndianStockBrowser;
