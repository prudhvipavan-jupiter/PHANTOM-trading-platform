import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import TradingDisclaimer from '../../components/TradingDisclaimer';

const Login: React.FC = () => {
  const { showToast } = useToast();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials.email, credentials.password);
      showToast({ type: 'success', title: 'Success', message: 'Login successful!' });
      window.location.assign('/dashboard');
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: `Login failed. ${(error as Error).message || 'Please try again.'}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4">
      <div className="w-full max-w-md">
        {/* HUD-like Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/phantom-logo.svg" alt="P.H.A.N.T.O.M Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-primary-main mb-2">P.H.A.N.T.O.M</h1>
          <p className="text-text-secondary text-lg">Personalized High-Autonomy Neural Trading Operations Manager</p>
          <p className="text-text-secondary text-sm mt-2">AI-Powered Autonomous Wealth Generation System</p>
          <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
            <p className="text-[#00f2ff] text-sm font-semibold">Powered By J.U.P.I.T.E.R AI</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="phantom-card p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#f0b323] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  className="phantom-input w-full"
                  placeholder="admin@phantom.com"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#f0b323] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="phantom-input w-full"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="phantom-button w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Initializing...
                </span>
              ) : (
                'Access System'
              )}
            </button>
          </form>
        </div>

        {/* HUD-like Footer */}
        <div className="mt-8 text-center">
          <div className="text-[#1e90ff] text-sm">
            <span className="phantom-pulse inline-block w-2 h-2 rounded-full mr-2"></span>
            Demo login: admin@phantom.com / Honey@!2!6
          </div>
          <div className="text-[#f0b323] text-xs mt-2">
            © 2025 J.U.P.I.T.E.R Industries. All rights reserved.
          </div>
        </div>

        <TradingDisclaimer />
      </div>
    </div>
  );
};

export default Login; 