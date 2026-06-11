export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';

/** Vercel demo deploy uses mock data unless a backend URL is configured. */
export const USE_MOCK_API =
  import.meta.env.VITE_USE_MOCK === 'true' ||
  import.meta.env.VITE_USE_MOCK === '1' ||
  !import.meta.env.VITE_API_URL;

export const APP_MODE = (import.meta.env.VITE_APP_MODE || 'paper') as 'demo' | 'paper' | 'live';

export const IS_PRODUCTION = import.meta.env.PROD;
