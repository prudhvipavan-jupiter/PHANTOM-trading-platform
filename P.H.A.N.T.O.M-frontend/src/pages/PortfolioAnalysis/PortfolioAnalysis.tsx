import React, { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
// Test comment for edit functionality

const COLORS = ['#00f2ff', '#f0b323', '#1e90ff', '#ff4500', '#a0a0b0', '#ffffff'];

interface HoldingTypeData {
  name: string;
  value: number;
}

interface EquityData {
  name: string;
  value: number;
}

const PortfolioAnalysis: React.FC = () => {
  const [isRealMode, setIsRealMode] = useState(true);
  const [isHoldingTypeExpanded, setIsHoldingTypeExpanded] = useState(true);
  const [isSectorAllocationExpanded, setIsSectorAllocationExpanded] = useState(true);
  const [isEquityPerformanceExpanded, setIsEquityPerformanceExpanded] = useState(true);

  const holdingTypeData: HoldingTypeData[] = [
    { name: 'Long-Term', value: 70 },
    { name: 'Short-Term', value: 30 },
  ];

  const sectorAllocationData = [
    { name: 'IT', value: 400 },
    { name: 'Finance', value: 300 },
    { name: 'Pharma', value: 200 },
    { name: 'Energy', value: 100 },
    { name: 'FMCG', value: 50 },
  ];

  const equityPerformanceData: EquityData[] = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];

  return (
    <div className="p-6 space-y-8 bg-[#1a1a1a] min-h-screen text-white">
      <motion.h1
        className="phantom-title text-4xl mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Portfolio Analysis
      </motion.h1>

      <motion.div
        className="mb-6 flex justify-end"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <button
          onClick={() => setIsRealMode(!isRealMode)}
          className={`phantom-button ${isRealMode ? 'bg-gradient-to-r from-[#00f2ff] to-[#1e90ff]' : 'bg-gradient-to-r from-[#f0b323] to-[#ff4500]'}`}
        >
          Switch to {isRealMode ? 'Paper' : 'Real'} Mode
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Holding Type Allocation */}
        <motion.div
          className="phantom-card p-6 rounded-lg flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between cursor-pointer mb-4"
               onClick={() => setIsHoldingTypeExpanded(!isHoldingTypeExpanded)}>
            <h2 className="phantom-subtitle text-2xl border-b border-[#3a3a3a] pb-2">Holding Type Allocation</h2>
            <span className="text-gray-400 text-xl">
              {isHoldingTypeExpanded ? '▲' : '▼'}
            </span>
          </div>
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{
              maxHeight: isHoldingTypeExpanded ? 500 : 0,
              opacity: isHoldingTypeExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
            className="flex-shrink-0"
          >
            {isHoldingTypeExpanded && (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={holdingTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {holdingTypeData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{ outline: 'none' }}
                    contentStyle={{
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #00f2ff',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Legend wrapperStyle={{ color: '#ffffff' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.div>

        {/* Sector Allocation */}
        <motion.div
          className="phantom-card p-6 rounded-lg flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between cursor-pointer mb-4"
               onClick={() => setIsSectorAllocationExpanded(!isSectorAllocationExpanded)}>
            <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2">Sector Allocation</h2>
            <span className="text-gray-400 text-xl">
              {isSectorAllocationExpanded ? '▲' : '▼'}
            </span>
          </div>
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{
              maxHeight: isSectorAllocationExpanded ? 500 : 0,
              opacity: isSectorAllocationExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: 'hidden' }}
            className="flex-shrink-0"
          >
            {isSectorAllocationExpanded && (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={sectorAllocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {sectorAllocationData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{ outline: 'none' }}
                    contentStyle={{
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #00f2ff',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Legend wrapperStyle={{ color: '#ffffff' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Equity Performance Chart */}
      <motion.div
        className="phantom-card p-6 rounded-lg flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-between cursor-pointer mb-4"
             onClick={() => setIsEquityPerformanceExpanded(!isEquityPerformanceExpanded)}>
          <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2">Equity Performance Over Time</h2>
          <span className="text-gray-400 text-xl">
            {isEquityPerformanceExpanded ? '▲' : '▼'}
          </span>
        </div>
        <motion.div
          initial={{ maxHeight: 0, opacity: 0 }}
          animate={{
            maxHeight: isEquityPerformanceExpanded ? 500 : 0,
            opacity: isEquityPerformanceExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: 'hidden' }}
          className="flex-shrink-0"
        >
          {isEquityPerformanceExpanded && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={equityPerformanceData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis dataKey="name" stroke="#a0a0b0" tick={{ fill: '#a0a0b0' }} />
                <YAxis stroke="#a0a0b0" tick={{ fill: '#a0a0b0' }} />
                <Tooltip
                  wrapperStyle={{ outline: 'none' }}
                  contentStyle={{
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #00f2ff',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Legend wrapperStyle={{ color: '#ffffff' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00f2ff"
                  strokeWidth={3}
                  dot={{ stroke: '#f0b323', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#f0b323', stroke: '#00f2ff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PortfolioAnalysis; 