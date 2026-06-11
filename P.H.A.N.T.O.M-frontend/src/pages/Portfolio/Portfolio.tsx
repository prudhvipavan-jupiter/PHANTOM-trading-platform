import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useVoice } from '../../contexts/VoiceContext';

const mockHoldings = [
  { symbol: 'RELIANCE', qty: 100, avgPrice: 2450, cmp: 2520, pnl: 2.86, marketValue: 252000 },
  { symbol: 'TCS', qty: 50, avgPrice: 3800, cmp: 3950, pnl: 3.95, marketValue: 197500 },
  { symbol: 'HDFCBANK', qty: 75, avgPrice: 1650, cmp: 1680, pnl: 1.82, marketValue: 126000 },
  { symbol: 'INFY', qty: 200, avgPrice: 1450, cmp: 1420, pnl: -2.07, marketValue: 284000 },
  { symbol: 'ICICIBANK', qty: 150, avgPrice: 950, cmp: 980, pnl: 3.16, marketValue: 147000 },
];

const sectorAllocation = [
  { name: 'IT', value: 35 },
  { name: 'Banking', value: 25 },
  { name: 'Energy', value: 20 },
  { name: 'Pharma', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#00f2ff', '#00c4cc', '#ffb800', '#00ff9d', '#ff3d3d'];

const Portfolio = () => {
  const [isPaperTrading, setIsPaperTrading] = useState(false);

  const buttonVariants = {
    live: { backgroundColor: '#00f2ff', color: '#0a0a0a', boxShadow: '0 0 15px rgba(0, 242, 255, 0.4)' },
    paper: { backgroundColor: '#ffb800', color: '#0a0a0a', boxShadow: '0 0 15px rgba(255, 184, 0, 0.4)' },
  };

  const { irisSpeak, isVoiceModeOn } = useVoice();

  const [isHoldingsExpanded, setIsHoldingsExpanded] = useState(true);
  const [isSectorExpanded, setIsSectorExpanded] = useState(true);
  const [isAIStrategyExpanded, setIsAIStrategyExpanded] = useState(true);

  const handleSpeakPortfolio = () => {
    if (isVoiceModeOn) {
      const totalHoldings = mockHoldings.length;
      const totalMarketValue = mockHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);
      const totalPNL = mockHoldings.reduce((sum, holding) => sum + holding.pnl, 0);
      const message = `You currently have ${totalHoldings} holdings with a total market value of ₹${totalMarketValue.toLocaleString()}. Your overall profit and loss is ${totalPNL.toFixed(2)} percent.`;
      irisSpeak(message);
    } else {
      irisSpeak("IRIS voice mode is currently off. Please enable it in Settings to hear your portfolio summary.");
    }
  };

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
            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.95 }}
            className="font-orbitron px-6 py-2 rounded-lg transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!isVoiceModeOn}
          >
            <i className="fas fa-volume-up mr-2"></i> Speak Portfolio Summary
          </motion.button>
          <motion.button
            onClick={() => setIsPaperTrading(!isPaperTrading)}
            variants={buttonVariants}
            animate={isPaperTrading ? 'paper' : 'live'}
            whileHover={{ scale: 1.05, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.95 }}
            className="font-orbitron px-6 py-2 rounded-lg transition-all duration-300"
            style={{ outline: 'none' }}
          >
            {isPaperTrading ? 'Paper Trading' : 'Live Trading'}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="phantom-card lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between cursor-pointer mb-4"
               onClick={() => setIsHoldingsExpanded(!isHoldingsExpanded)}>
            <h2 className="phantom-subtitle text-2xl">Holdings</h2>
            <span className="text-gray-400 text-xl">
              {isHoldingsExpanded ? '▲' : '▼'}
            </span>
          </div>
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{
              maxHeight: isHoldingsExpanded ? 1000 : 0,
              opacity: isHoldingsExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
          >
            {isHoldingsExpanded && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-transparent border-collapse">
                  <thead>
                    <tr className="border-b border-phantom-blue/20">
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm tracking-wider">Symbol</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm tracking-wider">Qty</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm tracking-wider">Avg Price</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm tracking-wider">CMP</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm tracking-wider">P&L %</th>
                      <th className="text-left text-phantom-blue font-medium py-3 px-4 uppercase text-sm tracking-wider">Market Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHoldings.map((holding) => (
                      <tr
                        key={holding.symbol}
                        className="border-b border-phantom-gray/50 hover:bg-phantom-gray/30 transition-colors duration-200 cursor-pointer group"
                      >
                        <td className="font-bold text-white py-3 px-4 group-hover:text-phantom-blue transition-colors duration-200">{holding.symbol}</td>
                        <td className="text-gray-300 py-3 px-4">{holding.qty}</td>
                        <td className="text-gray-300 py-3 px-4">₹{holding.avgPrice}</td>
                        <td className="text-gray-300 py-3 px-4">₹{holding.cmp}</td>
                        <td className={`font-semibold py-3 px-4 ${
                          holding.pnl >= 0 ? 'text-accent-success' : 'text-accent-danger'
                        }`}>
                          {holding.pnl >= 0 ? '+' : ''}{holding.pnl}%
                        </td>
                        <td className="text-white font-medium py-3 px-4">₹{holding.marketValue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            className="phantom-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-between cursor-pointer mb-4"
                 onClick={() => setIsSectorExpanded(!isSectorExpanded)}>
              <h2 className="phantom-subtitle text-2xl">Sector Allocation</h2>
              <span className="text-gray-400 text-xl">
                {isSectorExpanded ? '▲' : '▼'}
              </span>
            </div>
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{
                maxHeight: isSectorExpanded ? 1000 : 0,
                opacity: isSectorExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: 'hidden' }}
            >
              {isSectorExpanded && (
                <>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorAllocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          animationBegin={800}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        >
                          {sectorAllocation.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #00f2ff',
                            borderRadius: '8px',
                            boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)',
                            color: '#fff',
                          }}
                          labelStyle={{ color: '#00f2ff' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 mt-6 text-sm">
                    {sectorAllocation.map((sector, index) => (
                      <div key={sector.name} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-lg"
                          style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}` }}
                        />
                        <span className="text-gray-300 font-medium">{sector.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="phantom-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center justify-between cursor-pointer mb-4"
                 onClick={() => setIsAIStrategyExpanded(!isAIStrategyExpanded)}>
              <h2 className="phantom-subtitle text-2xl">AI Strategy Insight</h2>
              <span className="text-gray-400 text-xl">
                {isAIStrategyExpanded ? '▲' : '▼'}
              </span>
            </div>
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{
                maxHeight: isAIStrategyExpanded ? 1000 : 0,
                opacity: isAIStrategyExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: 'hidden' }}
            >
              {isAIStrategyExpanded && (
                <div className="space-y-4">
                  <div className="p-4 bg-phantom-dark rounded-lg border border-phantom-blue/20 shadow-lg">
                    <div className="text-text-secondary text-sm font-medium mb-1">Strategy Used</div>
                    <div className="text-primary font-bold text-lg font-orbitron">Momentum Trading</div>
                  </div>
                  <div className="p-4 bg-phantom-dark rounded-lg border border-phantom-blue/20 shadow-lg">
                    <div className="text-text-secondary text-sm font-medium mb-1">Predicted Move</div>
                    <div className="text-accent-success font-bold text-lg font-orbitron">Buy</div>
                  </div>
                  <div className="p-4 bg-phantom-dark rounded-lg border border-phantom-blue/20 shadow-lg">
                    <div className="text-text-secondary text-sm font-medium mb-1">Confidence Score</div>
                    <div className="text-primary font-bold text-lg font-orbitron">87%</div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="phantom-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="phantom-subtitle text-2xl mb-4">Monthly Target Tracker</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-orbitron">
            <span className="text-text-secondary">Target: ₹ 15,000</span>
            <span className="text-text-secondary">Achieved: ₹ 12,450</span>
          </div>
          <div className="w-full bg-phantom-gray rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full progress-glow"
              style={{ width: '83%' }}
            />
          </div>
          <div className="text-right text-sm text-text-secondary font-orbitron">
            Remaining: ₹ 2,550
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Portfolio; 