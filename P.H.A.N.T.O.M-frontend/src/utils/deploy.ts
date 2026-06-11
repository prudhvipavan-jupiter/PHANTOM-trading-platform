import { API_BASE_URL } from '../config/env';

export function isVercelHost(): boolean {
  if (typeof window === 'undefined') return import.meta.env.VITE_DEPLOY_TARGET === 'vercel';
  return window.location.hostname.includes('vercel.app');
}

export function hasRemoteBackend(): boolean {
  const base = API_BASE_URL || '';
  return base.startsWith('http') && !base.includes('localhost');
}

/** Live Paytm orders need the Node backend (secrets + OAuth callback). */
export function canUseLiveBrokerTrading(): boolean {
  if (hasRemoteBackend()) return true;
  if (isVercelHost()) return false;
  return true;
}
