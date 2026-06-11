import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { canUseLiveBrokerTrading } from '../../utils/deploy';

interface OrderForm {
  symbol: string;
  tradeType: 'BUY' | 'SELL';
  quantity: number;
  orderType: 'MKT' | 'LIMIT';
  price: number;
}

const LiveTrading: React.FC = () => {
  const { showToast } = useToast();
  const [params] = useSearchParams();
  const liveEnabled = canUseLiveBrokerTrading();
  const [connected, setConnected] = useState(false);
  const [funds, setFunds] = useState<Record<string, unknown> | null>(null);
  const [holdings, setHoldings] = useState<unknown[]>([]);
  const [orders, setOrders] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmLive, setConfirmLive] = useState(false);
  const [form, setForm] = useState<OrderForm>({
    symbol: 'RELIANCE',
    tradeType: 'BUY',
    quantity: 1,
    orderType: 'MKT',
    price: 0,
  });

  const refresh = useCallback(async () => {
    if (!liveEnabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const status = await api.getPaytmStatus();
      setConnected(Boolean(status?.connected));
      if (status?.connected) {
        const [fundsData, holdingsData, ordersData] = await Promise.all([
          api.getPaytmFunds(),
          api.getPaytmHoldings(),
          api.getPaytmOrders(),
        ]);
        setFunds(fundsData as Record<string, unknown>);
        const h = holdingsData as { data?: unknown[] };
        setHoldings(Array.isArray(holdingsData) ? holdingsData as unknown[] : h.data || []);
        const o = ordersData as { data?: unknown[] };
        setOrders(Array.isArray(ordersData) ? ordersData as unknown[] : o.data || []);
      }
    } catch (e) {
      showToast({ type: 'error', title: 'Error', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, [liveEnabled, showToast]);

  useEffect(() => {
    refresh();
    if (params.get('paytm') === 'connected') {
      showToast({ type: 'success', title: 'Paytm Money', message: 'Account linked for live trading' });
    }
  }, [refresh, params, showToast]);

  const handleOrder = async () => {
    if (!confirmLive) {
      showToast({ type: 'error', title: 'Confirm', message: 'Check the box to confirm this is a REAL money order' });
      return;
    }
    setSubmitting(true);
    try {
      await api.placeLiveOrder({
        symbol: form.symbol.trim(),
        tradeType: form.tradeType,
        quantity: form.quantity,
        orderType: form.orderType,
        price: form.orderType === 'LIMIT' ? form.price : 0,
        confirmLive: true,
      });
      showToast({ type: 'success', title: 'Order sent', message: `Live ${form.tradeType} sent to Paytm Money` });
      await refresh();
    } catch (e) {
      showToast({ type: 'error', title: 'Order failed', message: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!liveEnabled) {
    return (
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold text-primary-main mb-4">Live Trading</h1>
        <p className="text-text-secondary mb-4">
          Not available on this Vercel deployment. Use paper trading here, or run the merged app locally for Paytm Money.
        </p>
        <Link to="/paper-trading" className="phantom-button inline-block">Paper trading</Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-text-secondary">Loading live trading…</p>;
  }

  if (!connected) {
    return (
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold text-primary-main mb-4">Live Trading</h1>
        <p className="text-text-secondary mb-4">Link your Paytm Money account first.</p>
        <Link to="/paytm-connect" className="phantom-button inline-block">Connect Paytm Money</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-main mb-2">Live Trading (Paytm Money)</h1>
      <p className="text-red-300 text-sm mb-6">Real money — losses are possible.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="phantom-card p-4">
          <p className="text-text-secondary text-sm">Funds</p>
          <pre className="text-xs mt-2 overflow-auto max-h-32">{JSON.stringify(funds, null, 2)}</pre>
        </div>
        <div className="phantom-card p-4">
          <p className="text-text-secondary text-sm">Holdings ({holdings.length})</p>
          <pre className="text-xs mt-2 overflow-auto max-h-32">{JSON.stringify(holdings, null, 2)}</pre>
        </div>
        <div className="phantom-card p-4">
          <p className="text-text-secondary text-sm">Orders</p>
          <pre className="text-xs mt-2 overflow-auto max-h-32">{JSON.stringify(orders, null, 2)}</pre>
        </div>
      </div>

      <div className="phantom-card p-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Place order</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="phantom-input"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            placeholder="RELIANCE"
          />
          <select
            className="phantom-input"
            value={form.tradeType}
            onChange={(e) => setForm({ ...form, tradeType: e.target.value as 'BUY' | 'SELL' })}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <input
            type="number"
            className="phantom-input"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />
          <select
            className="phantom-input"
            value={form.orderType}
            onChange={(e) => setForm({ ...form, orderType: e.target.value as 'MKT' | 'LIMIT' })}
          >
            <option value="MKT">Market</option>
            <option value="LIMIT">Limit</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-red-200 mb-4">
          <input type="checkbox" checked={confirmLive} onChange={(e) => setConfirmLive(e.target.checked)} />
          I confirm this uses real money from my Paytm Money account
        </label>
        <button type="button" className="phantom-button" disabled={submitting} onClick={handleOrder}>
          {submitting ? 'Sending…' : 'Send live order'}
        </button>
      </div>
    </div>
  );
};

export default LiveTrading;
