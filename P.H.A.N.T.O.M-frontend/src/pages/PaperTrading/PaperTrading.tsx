import React, { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../../components/Button';
import { api } from '../../utils/api';

interface OrderForm {
  symbol: string;
  tradeType: 'BUY' | 'SELL';
  quantity: number;
}

const PaperTrading: React.FC = () => {
  const [wallet, setWallet] = useState<Record<string, number> | null>(null);
  const [orders, setOrders] = useState<unknown[]>([]);
  const [form, setForm] = useState<OrderForm>({
    symbol: 'RELIANCE.NS',
    tradeType: 'BUY',
    quantity: 1,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletData, orderData] = await Promise.all([
        api.getWallet(),
        api.getOrders(25),
      ]);
      setWallet(walletData as Record<string, number>);
      setOrders((orderData as { trades: unknown[] }).trades || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const result = await api.placePaperOrder({
        symbol: form.symbol.trim(),
        tradeType: form.tradeType,
        quantity: form.quantity,
        orderType: 'MARKET',
        market: form.symbol.includes('.NS') ? 'indian_stocks' : 'us_stocks',
      });
      const trade = (result as { trade?: { symbol: string; price: number } }).trade;
      setMessage(`Executed ${form.tradeType} ${trade?.symbol} @ live price ₹${trade?.price?.toFixed(2)}`);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const equity = wallet?.totalEquity ?? 0;
  const pnl = wallet?.profitLoss ?? 0;

  return (
    <div className="min-h-screen bg-background-default text-text-primary p-6">
      <h1 className="text-3xl font-bold mb-2 text-primary-main">Paper Trading</h1>
      <p className="text-text-secondary mb-6 text-sm">
        Orders execute at live Yahoo Finance prices. Virtual money only — no real trades.
      </p>

      {error && <div className="mb-4 p-3 rounded bg-red-900/40 text-red-200 text-sm">{error}</div>}
      {message && <div className="mb-4 p-3 rounded bg-green-900/40 text-green-200 text-sm">{message}</div>}

      {loading ? (
        <p className="text-text-secondary">Loading paper account…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="phantom-card text-center">
              <p className="text-text-secondary">Total equity</p>
              <p className="text-4xl font-bold text-success-main">
                ₹ {equity.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="phantom-card text-center">
              <p className="text-text-secondary">Cash balance</p>
              <p className="text-4xl font-bold">₹ {(wallet?.balance ?? 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="phantom-card text-center">
              <p className="text-text-secondary">Portfolio P&amp;L</p>
              <p className={`text-4xl font-bold ${pnl >= 0 ? 'text-success-main' : 'text-error-main'}`}>
                ₹ {pnl.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="phantom-card mb-6">
            <h2 className="text-xl font-semibold mb-4">Place order (live price)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-sm text-text-secondary">Symbol</label>
                <input
                  className="phantom-input w-full mt-1"
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                  placeholder="RELIANCE.NS or AAPL"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary">Side</label>
                <select
                  className="phantom-input w-full mt-1"
                  value={form.tradeType}
                  onChange={(e) => setForm({ ...form, tradeType: e.target.value as 'BUY' | 'SELL' })}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-text-secondary">Quantity</label>
                <input
                  type="number"
                  min={1}
                  className="phantom-input w-full mt-1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                />
              </div>
              <Button onClick={handlePlaceOrder} disabled={submitting}>
                {submitting ? 'Executing…' : 'Execute at market'}
              </Button>
            </div>
            <p className="text-xs text-text-secondary mt-3">
              Indian stocks: use suffix .NS (e.g. TCS.NS). US: AAPL, MSFT. Crypto: BTC-USD.
            </p>
          </div>

          <div className="phantom-card">
            <h2 className="text-xl font-semibold mb-4">Recent orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-secondary border-b border-gray-700">
                    <th className="py-2">Symbol</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: Record<string, unknown>, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-2">{String(o.symbol)}</td>
                      <td className="py-2">{String(o.tradeType)}</td>
                      <td className="py-2">{String(o.quantity)}</td>
                      <td className="py-2">₹ {Number(o.price).toFixed(2)}</td>
                      <td className="py-2">{String(o.status)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={5} className="py-4 text-text-secondary">No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="phantom-card mt-6 h-64">
            <h2 className="text-lg font-semibold mb-2">Equity snapshot</h2>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={[{ name: 'Now', value: equity }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#00f2ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default PaperTrading;
