/** API base — production uses same-origin `/api` (Vercel proxy) or explicit VITE_API_URL */
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : import.meta.env.PROD
    ? '/api'
    : 'http://localhost:5000/api';

export const APP_MODE = (import.meta.env.VITE_APP_MODE || 'paper') as 'demo' | 'paper' | 'live';

export const IS_PRODUCTION = import.meta.env.PROD;
