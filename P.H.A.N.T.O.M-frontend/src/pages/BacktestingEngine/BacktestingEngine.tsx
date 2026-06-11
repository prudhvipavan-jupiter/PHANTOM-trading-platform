import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface BacktestMetricCardProps {
  title: string;
  value: string;
  colorClass: string;
}

const BacktestMetricCard: React.FC<BacktestMetricCardProps> = ({ title, value, colorClass }) => (
  <div className="phantom-card text-center p-4">
    <p className="text-text-secondary text-sm">{title}</p>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

const BacktestingEngine: React.FC = () => {
  const [strategy, setStrategy] = useState('Momentum');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [initialCapital, setInitialCapital] = useState(1000000);
  const [isRunning, setIsRunning] = useState(false);
  const [results] = useState({
    totalReturn: '+25.3%',
    maxDrawdown: '-8.1%',
    sharpeRatio: '1.25',
    simulationData: [
      { name: 'Jan', value: 1000000 },
      { name: 'Feb', value: 1050000 },
      { name: 'Mar', value: 1020000 },
      { name: 'Apr', value: 1100000 },
      { name: 'May', value: 1080000 },
      { name: 'Jun', value: 1150000 },
      { name: 'Jul', value: 1180000 },
      { name: 'Aug', value: 1120000 },
      { name: 'Sep', value: 1200000 },
      { name: 'Oct', value: 1250000 },
      { name: 'Nov', value: 1230000 },
      { name: 'Dec', value: 1253000 },
    ],
  });

  const handleRunBacktest = () => {
    setIsRunning(true);
    // Simulate API call for backtesting
    setTimeout(() => {
      console.log('Running backtest with:', { strategy, startDate, endDate, initialCapital });
      // In a real app, you'd fetch results here
      setIsRunning(false);
      alert('Backtest Completed!');
    }, 2000);
  };

  const strategies = [
    'Momentum',
    'Trend Following',
    'Mean Reversion',
    'Arbitrage',
  ];

  return (
    <div className="min-h-screen bg-background-default text-text-primary p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-main">Backtesting Engine</h1>

      <div className="phantom-card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Backtest Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="strategy" className="block text-text-secondary text-sm font-medium mb-1">Select Strategy</label>
            <select
              id="strategy"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="phantom-input w-full"
            >
              {strategies.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <Input
            label="Initial Capital"
            type="number"
            value={initialCapital}
            onChange={(e) => setInitialCapital(Number(e.target.value))}
            fullWidth
          />
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
        </div>
        <Button onClick={handleRunBacktest} disabled={isRunning}>
          {isRunning ? 'Running Backtest...' : 'Run Backtest'}
        </Button>
      </div>

      <div className="phantom-card">
        <h2 className="text-2xl font-semibold mb-4">Backtest Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <BacktestMetricCard title="Total Return" value={results.totalReturn} colorClass="text-success-main" />
          <BacktestMetricCard title="Max Drawdown" value={results.maxDrawdown} colorClass="text-error-main" />
          <BacktestMetricCard title="Sharpe Ratio" value={results.sharpeRatio} colorClass="text-info-main" />
        </div>

        <h3 className="text-xl font-semibold mb-3">Equity Curve Simulation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={results.simulationData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#00F5FF" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BacktestingEngine; 