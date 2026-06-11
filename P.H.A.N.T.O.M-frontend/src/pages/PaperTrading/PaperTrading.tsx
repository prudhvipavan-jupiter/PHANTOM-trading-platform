import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../../components/Button';

interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'Filled' | 'Pending' | 'Cancelled';
  timestamp: string;
}

const PaperTrading: React.FC = () => {
  const [isPaperMode, setIsPaperMode] = useState(true);
  const [virtualCapital] = useState(1000000);
  const [virtualPnL] = useState(25000);
  const [simulatedOrders, setSimulatedOrders] = useState<Order[]>([
    { id: 'PT-001', symbol: 'RELIANCE', type: 'BUY', quantity: 50, price: 2500, status: 'Filled', timestamp: '2024-06-14 10:30:00' },
    { id: 'PT-002', symbol: 'TCS', type: 'SELL', quantity: 20, price: 3900, status: 'Filled', timestamp: '2024-06-14 11:00:00' },
    { id: 'PT-003', symbol: 'HDFCBANK', type: 'BUY', quantity: 75, price: 1600, status: 'Pending', timestamp: '2024-06-14 11:45:00' },
  ]);

  const mockPerformanceData = [
    { name: 'Day 1', value: 1000000 },
    { name: 'Day 2', value: 1010000 },
    { name: 'Day 3', value: 1005000 },
    { name: 'Day 4', value: 1025000 },
    { name: 'Day 5', value: 1020000 },
  ];

  const handlePlaceOrder = () => {
    alert('Simulated order placed!');
    setSimulatedOrders((prev) => [
      ...prev,
      { 
        id: `PT-${Math.floor(Math.random() * 1000)}`,
        symbol: 'INFY',
        type: 'BUY',
        quantity: Math.floor(Math.random() * 10) * 10,
        price: Math.floor(Math.random() * 100) + 1400,
        status: 'Filled',
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background-default text-text-primary p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-main">Paper Trading Mode</h1>

      <div className="mb-6 flex justify-end items-center space-x-4">
        <span className="text-text-secondary">Current Mode: {isPaperMode ? 'Paper' : 'Live (Simulated)'}</span>
        <Button
          onClick={() => setIsPaperMode(!isPaperMode)}
          size="md"
        >
          Switch to {isPaperMode ? 'Live Simulation' : 'Paper Mode'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Virtual Capital Card */}
        <div className="phantom-card text-center">
          <p className="text-text-secondary">Virtual Capital</p>
          <p className="text-4xl font-bold text-success-main">₹ {virtualCapital.toLocaleString('en-IN')}</p>
        </div>

        {/* Virtual P&L Card */}
        <div className="phantom-card text-center">
          <p className="text-text-secondary">Virtual P&L</p>
          <p className={`text-4xl font-bold ${virtualPnL >= 0 ? 'text-success-main' : 'text-error-main'}`}>₹ {virtualPnL.toLocaleString('en-IN')}</p>
        </div>

        {/* Place Order Card */}
        <div className="phantom-card flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">Place Simulated Order</h2>
          <Button onClick={handlePlaceOrder}>
            Place New Order
          </Button>
        </div>
      </div>

      {/* Simulated Orders Table */}
      <div className="phantom-card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Simulated Orders</h2>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="phantom-table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {simulatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.symbol}</td>
                  <td className={order.type === 'BUY' ? 'text-success-main' : 'text-error-main'}>
                    {order.type}
                  </td>
                  <td>{order.quantity}</td>
                  <td>₹ {order.price.toLocaleString('en-IN')}</td>
                  <td className={
                      order.status === 'Filled' ? 'text-success-main' :
                      order.status === 'Pending' ? 'text-info-main' :
                      'text-error-main'
                    }>
                    {order.status}
                  </td>
                  <td>{order.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Virtual Portfolio Performance */}
      <div className="phantom-card">
        <h2 className="text-2xl font-semibold mb-4">Virtual Portfolio Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={mockPerformanceData}
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

export default PaperTrading; 