import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowUp, faArrowDown, faBrain } from '@fortawesome/free-solid-svg-icons';

// Portfolio Performance Chart Component
export const PortfolioPerformanceChart: React.FC = () => {
  const chartData = [
    { time: '00:00', value: 100000 },
    { time: '04:00', value: 105000 },
    { time: '08:00', value: 112000 },
    { time: '12:00', value: 108000 },
    { time: '16:00', value: 115000 },
    { time: '20:00', value: 122000 },
    { time: '24:00', value: 126540 },
  ];

  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          Portfolio Performance (24h)
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-400 font-mono">₹1,26,540</p>
          <p className="text-sm text-green-300 font-mono">+₹26,540 (+26.5%)</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
          />
          <YAxis 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e3a8a',
              border: '1px solid #00f2ff',
              borderRadius: '8px',
              color: '#00f2ff',
              fontFamily: 'monospace'
            }}
            formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#00f2ff" 
            strokeWidth={3}
            fill="url(#portfolioGradient)"
            dot={{ fill: '#00f2ff', strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Real-time Profit/Loss Chart Component
export const ProfitLossChart: React.FC = () => {
  const chartData = [
    { time: '00:00', profit: 0, loss: 0 },
    { time: '04:00', profit: 5000, loss: 1200 },
    { time: '08:00', profit: 12000, loss: 2800 },
    { time: '12:00', profit: 8000, loss: 3500 },
    { time: '16:00', profit: 15000, loss: 4200 },
    { time: '20:00', profit: 22000, loss: 3800 },
    { time: '24:00', profit: 26540, loss: 4500 },
  ];

  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono flex items-center">
          <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
          Profit vs Loss (24h)
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-400 font-mono">₹22,040</p>
          <p className="text-sm text-green-300 font-mono">Net Profit</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
          />
          <YAxis 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e3a8a',
              border: '1px solid #00f2ff',
              borderRadius: '8px',
              color: '#00f2ff',
              fontFamily: 'monospace'
            }}
            formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Trading Volume Chart Component
export const TradingVolumeChart: React.FC = () => {
  const chartData = [
    { time: '00:00', volume: 500000 },
    { time: '04:00', volume: 1200000 },
    { time: '08:00', volume: 2800000 },
    { time: '12:00', volume: 3500000 },
    { time: '16:00', volume: 4200000 },
    { time: '20:00', volume: 3800000 },
    { time: '24:00', volume: 4500000 },
  ];

  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono flex items-center">
          <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
          Trading Volume (24h)
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-400 font-mono">₹4.5M</p>
          <p className="text-sm text-blue-300 font-mono">Total Volume</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
          />
          <YAxis 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
            tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e3a8a',
              border: '1px solid #00f2ff',
              borderRadius: '8px',
              color: '#00f2ff',
              fontFamily: 'monospace'
            }}
            formatter={(value: any) => [`₹${(value / 1000000).toFixed(2)}M`, 'Volume']}
          />
          <Line 
            type="monotone" 
            dataKey="volume" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Portfolio Allocation Pie Chart Component
export const PortfolioAllocationChart: React.FC = () => {
  const data = [
    { name: 'Crypto Trading', value: 45, color: '#00f2ff' },
    { name: 'Stock Market', value: 30, color: '#f0b323' },
    { name: 'Forex Trading', value: 15, color: '#ff4500' },
    { name: 'Commodities', value: 10, color: '#1e90ff' },
  ];

  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono flex items-center">
          <FontAwesomeIcon icon={faBrain} className="mr-2" />
          Portfolio Allocation
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-400 font-mono">₹1.26M</p>
          <p className="text-sm text-cyan-300 font-mono">Total Portfolio</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e3a8a',
              border: '1px solid #00f2ff',
              borderRadius: '8px',
              color: '#00f2ff',
              fontFamily: 'monospace'
            }}
            formatter={(value: any, name: any) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// AI Confidence Chart Component using ApexCharts
export const AIConfidenceChart: React.FC = () => {
  const options = {
    chart: {
      type: 'radar' as const,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    series: [{
      name: 'AI Confidence',
      data: [95, 87, 92, 78, 89, 94]
    }],
    labels: ['BTC/INR', 'ETH/INR', 'RELIANCE', 'TCS', 'EUR/INR', 'GOLD'],
    colors: ['#00f2ff'],
    fill: {
      opacity: 0.3
    },
    stroke: {
      width: 2
    },
    markers: {
      size: 4,
      colors: ['#00f2ff'],
      strokeColors: '#00f2ff',
      strokeWidth: 2
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: '#00f2ff',
          fontFamily: 'monospace'
        }
      }
    },
    xaxis: {
      labels: {
        style: {
          colors: '#00f2ff',
          fontFamily: 'monospace'
        }
      }
    },
    grid: {
      borderColor: '#1e3a8a',
      strokeDashArray: 3
    }
  };

  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono flex items-center">
          <FontAwesomeIcon icon={faBrain} className="mr-2" />
          AI Trading Confidence
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-400 font-mono">89.2%</p>
          <p className="text-sm text-cyan-300 font-mono">Average Confidence</p>
        </div>
      </div>
      <ReactApexChart 
        options={options} 
        series={options.series} 
        type="radar" 
        height={300}
      />
    </div>
  );
};

// Market Sentiment Chart Component
export const MarketSentimentChart: React.FC = () => {
  const sentimentData = [
    { time: '00:00', sentiment: 65 },
    { time: '04:00', sentiment: 72 },
    { time: '08:00', sentiment: 78 },
    { time: '12:00', sentiment: 75 },
    { time: '16:00', sentiment: 82 },
    { time: '20:00', sentiment: 79 },
    { time: '24:00', sentiment: 85 },
  ];

  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono flex items-center">
          <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
          Market Sentiment (24h)
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-400 font-mono">85%</p>
          <p className="text-sm text-green-300 font-mono">Bullish</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={sentimentData}>
          <defs>
            <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
          />
          <YAxis 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e3a8a',
              border: '1px solid #00f2ff',
              borderRadius: '8px',
              color: '#00f2ff',
              fontFamily: 'monospace'
            }}
            formatter={(value: any) => [`${value}%`, 'Sentiment']}
          />
          <Area 
            type="monotone" 
            dataKey="sentiment" 
            stroke="#10b981" 
            strokeWidth={3}
            fill="url(#sentimentGradient)"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Trading Signals Chart Component
export const TradingSignalsChart: React.FC = () => {
  const signalsData = [
    { symbol: 'BTC/INR', buy: 95, sell: 5, hold: 0 },
    { symbol: 'ETH/INR', buy: 78, sell: 12, hold: 10 },
    { symbol: 'RELIANCE', buy: 87, sell: 8, hold: 5 },
    { symbol: 'TCS', buy: 92, sell: 3, hold: 5 },
    { symbol: 'EUR/INR', buy: 83, sell: 15, hold: 2 },
    { symbol: 'GOLD', buy: 89, sell: 6, hold: 5 },
  ];

  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border border-cyan-400/30 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 font-mono flex items-center">
          <FontAwesomeIcon icon={faBrain} className="mr-2" />
          AI Trading Signals
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-400 font-mono">87.3%</p>
          <p className="text-sm text-cyan-300 font-mono">Buy Signals</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={signalsData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.3} />
          <XAxis 
            type="number"
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            type="category"
            dataKey="symbol" 
            stroke="#00f2ff" 
            fontSize={12}
            fontFamily="monospace"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e3a8a',
              border: '1px solid #00f2ff',
              borderRadius: '8px',
              color: '#00f2ff',
              fontFamily: 'monospace'
            }}
            formatter={(value: any) => [`${value}%`, '']}
          />
          <Legend />
          <Bar dataKey="buy" fill="#10b981" radius={[0, 4, 4, 0]} />
          <Bar dataKey="sell" fill="#ef4444" radius={[0, 4, 4, 0]} />
          <Bar dataKey="hold" fill="#f59e0b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 