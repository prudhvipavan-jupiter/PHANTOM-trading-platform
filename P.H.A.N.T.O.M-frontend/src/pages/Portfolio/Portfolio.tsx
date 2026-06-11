import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useVoice } from '../../contexts/VoiceContext';
import { usePaperAccount } from '../../hooks/usePaperAccount';

const COLORS = ['#00f2ff', '#00c4cc', '#ffb800', '#00ff9d', '#ff3d3d', '#a855f7', '#f97316'];

const Portfolio = () => {
  const { holdings, overview, wallet, loading, error, refresh } = usePaperAccount();
  const { irisSpeak, isVoiceModeOn } = useVoice();

  const [isHoldingsExpanded, setIsHoldingsExpanded] = useState(true);
  const [isSectorExpanded, setIsSectorExpanded] = useState(true);
  const [isAIStrategyExpanded, setIsAIStrategyExpanded] = useState(true);

  const sectorAllocation = useMemo(() => {
    const totals: Record<string, number> = {};
    holdings.forEach((h) => {
      const sector = h.sector || 'Other';
      totals[sector] = (totals[sector] || 0) + h.marketValue;
    });
    const total = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
    }));
  }, [holdings]);

  const handleSpeakPortfolio = () => {
    if (!isVoiceModeOn) {
      irisSpeak('IRIS voice mode is off. Enable it in Settings to hear your portfolio summary.');
      return;
    }
    const totalHoldings = holdings.length;
    const totalMarketValue = overview?.portfolioValue ?? 0;
    const totalPNL = overview?.totalProfitLossPercentage ?? 0;
    irisSpeak(
      `You have ${totalHoldings} paper holdings worth ₹${totalMarketValue.toLocaleString()}. Overall P and L is ${totalPNL.toFixed(2)} percent.`,
    );
  };

  const monthlyTarget = 15000;
  const monthlyAchieved = Math.max(0, overview?.totalProfitLoss ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="phantom-title text-4xl">Portfolio Overview</h1>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleSpeakPortfolio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-orbitron px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!isVoiceModeOn}
          >
            <i className="fas fa-volume-up mr-2"></i> Speak Portfolio Summary
          </motion.button>
          <motion.button
            onClick={() => refresh()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-orbitron px-6 py-2 rounded-lg bg-phantom-blue text-black"
          >
            Refresh live prices
          </motion.button>
          <span className="font-orbitron px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            Paper Trading
          </span>
        </div>
      </div>

      {error && <div className="p-3 rounded bg-red-900/40 text-red-200 text-sm">{error}</div>}
      {loading && <p className="text-text-secondary">Loading portfolio with live prices…</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="phantom-card">
            <p className="text-text-secondary text-sm">Total equity</p>
            <p className="text-2xl font-bold">₹{(wallet?.totalEquity ?? 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="phantom-card">
            <p className="text-text-secondary text-sm">Cash</p>
            <p className="text-2xl font-bold">₹{(wallet?.balance ?? 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="phantom-card">
            <p className="text-text-secondary text-sm">Holdings value</p>
            <p className="text-2xl font-bold">₹{(overview?.portfolioValue ?? 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="phantom-card">
            <p className="text-text-secondary text-sm">Total P&amp;L</p>
            <p className={`text-2xl font-bold ${(overview?.totalProfitLoss ?? 0) >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
              ₹{(overview?.totalProfitLoss ?? 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="phantom-card lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center justify-between cursor-pointer mb-4" onClick={() => setIsHoldingsExpanded(!isHoldingsExpanded)}>
            <h2 className="phantom-subtitle text-2xl">Holdings</h2>
            <span className="text-gray-400 text-xl">{isHoldingsExpanded ? '▲' : '▼'}</span>
          </div>
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: isHoldingsExpanded ? 1000 : 0, opacity: isHoldingsExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            {holdings.length === 0 ? (
              <p className="text-gray-400 py-4">No holdings yet. Place a paper trade to build your portfolio.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-transparent border-collapse">
                  <thead>
                    <tr className="border-b border-phantom-blue/20">
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm">Symbol</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm">Qty</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm">Avg</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm">LTP</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm">P&amp;L %</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => (
                      <tr key={holding.symbol} className="border-b border-phantom-gray/50 hover:bg-phantom-gray/30">
                        <td className="font-bold text-white py-3 px-4">{holding.symbol}</td>
                        <td className="text-gray-300 py-3 px-4">{holding.quantity}</td>
                        <td className="text-gray-300 py-3 px-4">₹{holding.averagePrice.toFixed(2)}</td>
                        <td className="text-gray-300 py-3 px-4">₹{holding.currentPrice.toFixed(2)}</td>
                        <td className={`font-semibold py-3 px-4 ${holding.profitLossPercentage >= 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                          {holding.profitLossPercentage >= 0 ? '+' : ''}{holding.profitLossPercentage.toFixed(2)}%
                        </td>
                        <td className="text-white font-medium py-3 px-4">₹{holding.marketValue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>

        <div className="space-y-8">
          <motion.div className="phantom-card">
            <div className="flex items-center justify-between cursor-pointer mb-4" onClick={() => setIsSectorExpanded(!isSectorExpanded)}>
              <h2 className="phantom-subtitle text-2xl">Sector Allocation</h2>
              <span className="text-gray-400 text-xl">{isSectorExpanded ? '▲' : '▼'}</span>
            </div>
            <motion.div
              animate={{ maxHeight: isSectorExpanded ? 1000 : 0, opacity: isSectorExpanded ? 1 : 0 }}
              style={{ overflow: 'hidden' }}
            >
              {sectorAllocation.length === 0 ? (
                <p className="text-gray-400 text-sm">No sector data until you hold positions.</p>
              ) : (
                <>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sectorAllocation} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={3}>
                          {sectorAllocation.map((_e, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00f2ff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 mt-6 text-sm">
                    {sectorAllocation.map((sector, index) => (
                      <div key={sector.name} className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-gray-300">{sector.name} ({sector.value}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div className="phantom-card">
            <div className="flex items-center justify-between cursor-pointer mb-4" onClick={() => setIsAIStrategyExpanded(!isAIStrategyExpanded)}>
              <h2 className="phantom-subtitle text-2xl">Paper Account Insight</h2>
              <span className="text-gray-400 text-xl">{isAIStrategyExpanded ? '▲' : '▼'}</span>
            </div>
            <motion.div animate={{ maxHeight: isAIStrategyExpanded ? 400 : 0, opacity: isAIStrategyExpanded ? 1 : 0 }} style={{ overflow: 'hidden' }}>
              <div className="space-y-4 text-sm text-gray-300">
                <p>Orders execute at live Yahoo Finance prices. No real money is used.</p>
                <p>Monthly return (paper): {(overview?.performance?.monthlyReturn ?? 0).toFixed(2)}%</p>
                <p>Win rate depends on your trades — not simulated AI accuracy.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div className="phantom-card">
        <h2 className="phantom-subtitle text-2xl mb-4">Monthly P&amp;L Tracker (paper)</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-orbitron">
            <span className="text-text-secondary">Target: ₹ {monthlyTarget.toLocaleString()}</span>
            <span className="text-text-secondary">Achieved: ₹ {monthlyAchieved.toLocaleString()}</span>
          </div>
          <div className="w-full bg-phantom-gray rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full progress-glow"
              style={{ width: `${Math.min(100, (monthlyAchieved / monthlyTarget) * 100)}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Portfolio;
