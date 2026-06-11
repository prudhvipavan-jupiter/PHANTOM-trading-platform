import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import TradingDisclaimer from '../../components/TradingDisclaimer';
import { canUseLiveBrokerTrading, isVercelHost } from '../../utils/deploy';

const Login: React.FC = () => {
  const { showToast } = useToast();
  const { login, startDemoSession } = useAuth();
  const navigate = useNavigate();
  const onVercel = isVercelHost();
  const liveBroker = canUseLiveBrokerTrading();
  const [credentials, setCredentials] = useState({ email: 'admin@phantom.com', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountLogin, setShowAccountLogin] = useState(!onVercel);

  const handlePaperStart = () => {
    startDemoSession();
    showToast({
      type: 'success',
      title: 'Ready',
      message: '₹10L virtual wallet — works on Vercel with live market prices',
    });
    navigate('/market-watch');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(credentials.email, credentials.password);
      showToast({ type: 'success', title: 'Signed in', message: 'Welcome back' });
      navigate(liveBroker ? '/paytm-connect' : '/dashboard');
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Sign in failed',
        message: onVercel
          ? 'Use Start Paper Trading on Vercel, or set VITE_API_URL to your hosted backend.'
          : (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/phantom-logo.svg" alt="P.H.A.N.T.O.M" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-main mb-2">P.H.A.N.T.O.M</h1>
          <p className="text-text-secondary">
            {onVercel ? 'Market data + paper trading on Vercel' : 'Paytm Money live trading on your PC'}
          </p>
        </div>

        <div className="phantom-card p-8 rounded-lg space-y-6">
          <button type="button" onClick={handlePaperStart} className="phantom-button w-full text-lg py-3">
            Start Paper Trading
          </button>
          <p className="text-center text-text-secondary text-sm">
            No signup. ₹10L virtual wallet. Live NSE/BSE prices{onVercel ? ' — works here on Vercel' : ''}.
          </p>

          <div className="border-t border-[#3a3a3a] pt-4">
            {!showAccountLogin ? (
              <button
                type="button"
                onClick={() => setShowAccountLogin(true)}
                className="w-full text-sm text-[#1e90ff] hover:underline"
              >
                Sign in with server account {liveBroker ? '(live Paytm)' : '(needs backend)'}
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="email"
                  type="text"
                  required
                  className="phantom-input w-full"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
                <input
                  name="password"
                  type="password"
                  required
                  className="phantom-input w-full"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <button type="submit" disabled={isLoading} className="phantom-button w-full">
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            )}
          </div>
        </div>

        {onVercel && (
          <div className="mt-6 phantom-card p-4 text-sm text-text-secondary">
            <p className="text-cyan-300 font-medium mb-1">On Vercel now</p>
            <p>Market Watch, search 5,000+ stocks, paper portfolio. Live Paytm orders: run <code>start.ps1</code> locally.</p>
          </div>
        )}

        <TradingDisclaimer />
      </div>
    </div>
  );
};

export default Login;
