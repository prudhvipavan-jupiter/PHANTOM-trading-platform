import React, { useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { motion } from 'framer-motion';
import { useVoice } from '../../contexts/VoiceContext';

interface Trade {
  id: string;
  date: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  pnl: number;
  executionMode: 'AUTO' | 'SEMI' | 'MANUAL';
  strategy?: string; // New field for strategy
}

// Generate a larger set of mock trades for demonstration
const generateMockTrades = (count: number): Trade[] => {
  const trades: Trade[] = [];
  const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BHARTIARTL', 'SBIN', 'MARUTI', 'LT', 'AXISBANK'];
  const types = ['BUY', 'SELL'];
  const modes = ['AUTO', 'SEMI', 'MANUAL'];
  const strategies = ['Momentum', 'Value Investing', 'Scalping', 'Swing Trading', 'Arbitrage'];

  for (let i = 0; i < count; i++) {
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + Math.floor(Math.random() * 90)); // Trades over 3 months
    date.setHours(9 + Math.floor(Math.random() * 7)); // Trading hours
    date.setMinutes(Math.floor(Math.random() * 60));

    const quantity = Math.floor(Math.random() * 500) + 10;
    const price = parseFloat((Math.random() * 3000 + 500).toFixed(2));
    const type = types[Math.floor(Math.random() * types.length)] as 'BUY' | 'SELL';
    const pnl = type === 'SELL' ? parseFloat((Math.random() * 5000 - 2000).toFixed(2)) : 0;
    const totalValue = quantity * price;

    trades.push({
      id: `trade-${i}`,
      date: date.toISOString().slice(0, 19).replace('T', ' '),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      type,
      quantity,
      price,
      totalValue,
      pnl,
      executionMode: modes[Math.floor(Math.random() * modes.length)] as 'AUTO' | 'SEMI' | 'MANUAL',
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
    });
  }
  return trades;
};

const mockTrades = generateMockTrades(1000); // Generate 1000 mock trades

interface TradeFilters {
  startDate: string;
  endDate: string;
  symbol: string;
  type: '' | 'BUY' | 'SELL';
  mode: '' | 'AUTO' | 'SEMI' | 'MANUAL';
  strategy: string;
  minPnl: string;
  maxPnl: string;
  searchQuery: string;
}

const initialFilters: TradeFilters = {
  startDate: '',
  endDate: '',
  symbol: '',
  type: '',
  mode: '',
  strategy: '',
  minPnl: '',
  maxPnl: '',
  searchQuery: '',
};

const TradeHistory: React.FC = () => {
  const [filters, setFilters] = useState<TradeFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<'date' | 'symbol' | 'pnl' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { irisSpeak, isVoiceModeOn } = useVoice();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (column: 'date' | 'symbol' | 'pnl' | 'price') => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc'); // Default sort order for new column
    }
  };

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = mockTrades.filter((trade) => {
      const matchesDate = (!filters.startDate || trade.date >= filters.startDate) &&
                        (!filters.endDate || trade.date <= filters.endDate);
      const matchesSymbol = !filters.symbol || trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase());
      const matchesType = !filters.type || trade.type === filters.type;
      const matchesMode = !filters.mode || trade.executionMode === filters.mode;
      const matchesStrategy = !filters.strategy || trade.strategy?.toLowerCase().includes(filters.strategy.toLowerCase());
      const matchesMinPnl = filters.minPnl === '' || trade.pnl >= parseFloat(filters.minPnl);
      const matchesMaxPnl = filters.maxPnl === '' || trade.pnl <= parseFloat(filters.maxPnl);
      const matchesSearch = !filters.searchQuery ||
        trade.symbol.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        trade.executionMode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        trade.strategy?.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesDate && matchesSymbol && matchesType && matchesMode && matchesStrategy && matchesMinPnl && matchesMaxPnl && matchesSearch;
    });

    // Apply search query as a final filter on top of existing filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(trade => 
        trade.symbol.toLowerCase().includes(query) ||
        trade.type.toLowerCase().includes(query) ||
        trade.executionMode.toLowerCase().includes(query) ||
        trade.strategy?.toLowerCase().includes(query) ||
        trade.date.toLowerCase().includes(query) ||
        trade.pnl.toLocaleString().includes(query) ||
        trade.price.toLocaleString().includes(query) ||
        trade.quantity.toLocaleString().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      let compare = 0;
      if (sortBy === 'date') {
        compare = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'symbol') {
        compare = a.symbol.localeCompare(b.symbol);
      } else if (sortBy === 'pnl') {
        compare = a.pnl - b.pnl;
      } else if (sortBy === 'price') {
        compare = a.price - b.price;
      }
      return sortOrder === 'asc' ? compare : -compare;
    });
  }, [filters, sortBy, sortOrder]);

  const handleExport = () => {
    // Basic CSV export for demonstration
    const headers = ['ID', 'Date', 'Symbol', 'Type', 'Quantity', 'Price', 'Total Value', 'P&L', 'Execution Mode', 'Strategy'];
    const rows = filteredAndSortedTrades.map(trade => [
      trade.id,
      `"${trade.date}"`,
      trade.symbol,
      trade.type,
      trade.quantity,
      trade.price,
      trade.totalValue,
      trade.pnl,
      trade.executionMode,
      `"${trade.strategy || ''}"`,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'trade_history.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSpeakTradeSummary = () => {
    if (isVoiceModeOn) {
      const totalTrades = filteredAndSortedTrades.length;
      const totalPNL = filteredAndSortedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      const lastTrade = filteredAndSortedTrades[0]; // Assuming sorted by date desc

      let message = `You have ${totalTrades} trades in your history with a total profit and loss of ₹${totalPNL.toLocaleString()}.`;

      if (lastTrade) {
        message += ` Your most recent trade was a ${lastTrade.type} of ${lastTrade.quantity} shares of ${lastTrade.symbol} at ₹${lastTrade.price.toLocaleString()}.`;
        if (lastTrade.pnl !== 0) {
          message += ` This trade resulted in a ${lastTrade.pnl >= 0 ? 'profit' : 'loss'} of ₹${Math.abs(lastTrade.pnl).toLocaleString()}.`;
        }
      } else {
        message += ` There are no trades to summarize.`;
      }
      irisSpeak(message);
    } else {
      irisSpeak("IRIS voice mode is currently off. Please enable it in Settings to hear your trade summary.");
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const trade = filteredAndSortedTrades[index];

    const pnlColorClass = trade.pnl >= 0 ? 'text-[#00f2ff]' : 'text-[#ff4500]';
    const typeColorClass = trade.type === 'BUY'
      ? 'bg-[#00f2ff] bg-opacity-10 text-[#00f2ff]'
      : 'bg-[#ff4500] bg-opacity-10 text-[#ff4500]';

    return (
      <motion.div
        style={style}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.02 }}
        className="flex items-center p-4 border-b border-[#3a3a3a] last:border-b-0 hover:bg-[#2a2a2a]"
      >
        <div className="w-1/12 text-sm text-gray-400">{trade.date.split(' ')[0]}<br/>{trade.date.split(' ')[1]}</div>
        <div className="w-1/12 font-medium text-white">{trade.symbol}</div>
        <div className="w-1/12">
          <span className={`px-2 py-1 rounded text-xs font-medium ${typeColorClass}`}>
            {trade.type}
          </span>
        </div>
        <div className="w-1/12 text-gray-300">{trade.quantity}</div>
        <div className="w-1/12 text-gray-300">₹{trade.price.toLocaleString()}</div>
        <div className="w-2/12 text-gray-300">₹{trade.totalValue.toLocaleString()}</div>
        <div className={`w-1/12 font-bold ${pnlColorClass}`}>
          {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
        </div>
        <div className="w-2/12 text-gray-300">{trade.executionMode}</div>
        <div className="w-2/12 text-gray-300">{trade.strategy}</div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-[#1a1a1a] min-h-screen text-white">
      {/* Header Section */}
      <motion.h1
        className="phantom-title text-4xl mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Trade History
      </motion.h1>

      {/* Filters and Export */}
      <motion.div
        className="phantom-card p-6 rounded-lg mb-6 flex flex-col"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2">Filter & Export Trades</h2>
        <div className="flex flex-wrap items-end gap-4 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow">
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">Start Date</span>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="phantom-input"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">End Date</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="phantom-input"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">Symbol</span>
              <input
                type="text"
                name="symbol"
                value={filters.symbol}
                onChange={handleFilterChange}
                placeholder="e.g., RELIANCE"
                className="phantom-input"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">Trade Type</span>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="phantom-input"
              >
                <option value="">All</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">Execution Mode</span>
              <select
                name="mode"
                value={filters.mode}
                onChange={handleFilterChange}
                className="phantom-input"
              >
                <option value="">All</option>
                <option value="AUTO">AUTO</option>
                <option value="SEMI">SEMI</option>
                <option value="MANUAL">MANUAL</option>
              </select>
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">Strategy</span>
              <input
                type="text"
                name="strategy"
                value={filters.strategy}
                onChange={handleFilterChange}
                placeholder="e.g., Momentum"
                className="phantom-input"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">Min P&L</span>
              <input
                type="number"
                name="minPnl"
                value={filters.minPnl}
                onChange={handleFilterChange}
                className="phantom-input"
                placeholder="e.g., -1000"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-400 mb-1">Max P&L</span>
              <input
                type="number"
                name="maxPnl"
                value={filters.maxPnl}
                onChange={handleFilterChange}
                className="phantom-input"
                placeholder="e.g., 5000"
              />
            </label>
          </div>
          <div className="flex-grow flex justify-end gap-4 mt-4 md:mt-0">
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery}
              onChange={handleFilterChange}
              className="phantom-input w-full md:w-auto flex-grow"
              placeholder="Search all trades..."
            />
            <motion.button
              onClick={handleSpeakTradeSummary}
              whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.95 }}
              className="phantom-button bg-purple-600 hover:bg-purple-700"
              disabled={!isVoiceModeOn}
            >
              <i className="fas fa-volume-up mr-2"></i> Speak Trade Summary
            </motion.button>
            <motion.button
              onClick={handleExport}
              whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.95 }}
              className="phantom-button bg-blue-600 hover:bg-blue-700"
            >
              <i className="fas fa-file-export mr-2"></i> Export CSV
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trade List Table */}
      <motion.div
        className="phantom-card p-6 rounded-lg flex flex-col flex-grow min-h-[500px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2">Transactions ({filteredAndSortedTrades.length})</h2>
        <div className="flex flex-col flex-grow overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center p-4 border-b-2 border-phantom-blue/40 font-bold text-white uppercase text-sm mb-2">
            <div className="w-1/12 cursor-pointer" onClick={() => handleSortChange('date')}>Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}</div>
            <div className="w-1/12 cursor-pointer" onClick={() => handleSortChange('symbol')}>Symbol {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}</div>
            <div className="w-1/12">Type</div>
            <div className="w-1/12">Qty</div>
            <div className="w-1/12">Price</div>
            <div className="w-2/12">Total Value</div>
            <div className="w-1/12 cursor-pointer" onClick={() => handleSortChange('pnl')}>P&L {sortBy === 'pnl' && (sortOrder === 'asc' ? '↑' : '↓')}</div>
            <div className="w-2/12">Mode</div>
            <div className="w-2/12">Strategy</div>
          </div>

          {/* Trade List with Virtualization */}
          <div className="flex-grow overflow-auto">
            {filteredAndSortedTrades.length > 0 ? (
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    itemCount={filteredAndSortedTrades.length}
                    itemSize={70} // Approximate height of each trade row
                    width={width}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            ) : (
              <div className="text-center text-gray-500 py-10">
                No trades found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TradeHistory; 