import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { canUseLiveBrokerTrading } from '../../utils/deploy';

const PaytmConnect: React.FC = () => {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const liveEnabled = canUseLiveBrokerTrading();

  const saveAndLogin = async () => {
    setBusy(true);
    try {
      if (apiKey && apiSecret) {
        await api.configurePaytm(apiKey, apiSecret);
      }
      const { loginUrl } = await api.getPaytmLoginUrl();
      window.location.href = loginUrl;
    } catch (e) {
      showToast({ type: 'error', title: 'Paytm setup', message: (e as Error).message });
      setBusy(false);
    }
  };

  if (!liveEnabled) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-primary-main mb-4">Live trading on Vercel</h1>
        <p className="text-text-secondary mb-4">
          Paytm Money live orders cannot run on the public Vercel site alone (API secrets and OAuth callback
          must stay on your PC). On Vercel you can use <strong>paper trading</strong> and <strong>market watch</strong> with live NSE/BSE prices.
        </p>
        <div className="phantom-card p-6 space-y-3 text-sm text-text-secondary">
          <p className="text-amber-200 font-medium">To trade real money with Paytm Money:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Run <code>start.ps1</code> on your computer (http://localhost:5000)</li>
            <li>Link Paytm there — redirect URL must be localhost, not Vercel</li>
          </ol>
          <p>
            Or deploy the Node backend (Render/Railway) and set Vercel env{' '}
            <code>VITE_API_URL=https://your-api.com/api</code>
          </p>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to="/paper-trading" className="phantom-button">Paper trading</Link>
          <Link to="/market-watch" className="phantom-button opacity-80">Market watch</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-primary-main mb-2">Connect Paytm Money</h1>
      <p className="text-text-secondary mb-6 text-sm">
        Create a free app at{' '}
        <a href="https://developer.paytmmoney.com/" className="text-cyan-400 underline" target="_blank" rel="noreferrer">
          developer.paytmmoney.com
        </a>
        . Redirect URL for local app:
        <code className="block mt-2 p-2 bg-black/40 rounded text-cyan-200 text-xs">
          http://localhost:5000/api/brokers/paytm/callback
        </code>
      </p>

      <div className="phantom-card p-6 space-y-4">
        <input
          className="phantom-input w-full"
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <input
          className="phantom-input w-full"
          type="password"
          placeholder="API Secret"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
        />
        <button type="button" className="phantom-button w-full" disabled={busy} onClick={saveAndLogin}>
          {busy ? 'Redirecting…' : 'Save & login with Paytm Money'}
        </button>
      </div>

      <div className="mt-6 p-4 border border-amber-500/40 rounded text-amber-100 text-sm">
        Live trading can lose money. Never commit API secrets to GitHub or Vercel env unless you accept the risk.
      </div>
    </div>
  );
};

export default PaytmConnect;
