import { API_BASE_URL } from '../config/env';
import type { LoginCredentials, LoginResponse, User } from '../utils/api';

type BackendUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
};

function mapUser(user: BackendUser): User {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  return {
    _id: user._id,
    name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt || new Date().toISOString(),
    lastLogin: user.lastLogin || new Date().toISOString(),
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error || body.message || `Request failed (${response.status})`);
  }

  return body as T;
}

class RealApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('phantom_token');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const base = API_BASE_URL.replace(/\/api$/, '');
      const res = await fetch(`${base}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const result = await request<{
      success: boolean;
      data?: { token: string; user: BackendUser };
      message?: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.username, password: credentials.password }),
    });

    const token = result.data?.token;
    const user = result.data?.user;
    if (!token || !user) {
      throw new Error('Invalid login response from server');
    }

    this.token = token;
    localStorage.setItem('phantom_token', token);
    localStorage.setItem('phantom_user', JSON.stringify(mapUser(user)));

    return {
      token,
      user: mapUser(user),
      message: result.message || 'Login successful',
    };
  }

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' }, this.token);
    } catch {
      // ignore — clear local session regardless
    }
    this.token = null;
    localStorage.removeItem('phantom_token');
    localStorage.removeItem('phantom_user');
  }

  async getProfile(): Promise<User> {
    const result = await request<{ success: boolean; data?: { user?: BackendUser } | BackendUser }>(
      '/auth/profile',
      { method: 'GET' },
      this.token,
    );
    const raw = result.data;
    const user = (raw && 'user' in raw ? raw.user : raw) as BackendUser | undefined;
    if (!user) throw new Error('Profile not found');
    return mapUser(user);
  }

  async getPortfolio(): Promise<unknown> {
    const result = await request<{ success: boolean; data?: unknown }>(
      '/portfolio/overview',
      { method: 'GET' },
      this.token,
    );
    return result.data;
  }

  async getMarketData(): Promise<unknown[]> {
    const result = await request<{ success: boolean; data?: unknown[] }>(
      '/market-data/gainers',
      { method: 'GET' },
      this.token,
    );
    return result.data || [];
  }

  async getSystemStatus(): Promise<{ status: string; uptime: number }> {
    const base = API_BASE_URL.replace(/\/api$/, '');
    const res = await fetch(`${base}/health`);
    if (!res.ok) throw new Error('Backend unavailable');
    return { status: 'online', uptime: 99.9 };
  }
}

export const realApi = new RealApiClient();
