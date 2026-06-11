import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

const DEMO_USER: User = {
  _id: 'local_demo',
  name: 'Paper Trader',
  email: 'demo@phantom.local',
  role: 'user',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLocalMode: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  startDemoSession: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('phantom_token');
    const storedUser = localStorage.getItem('phantom_user');

    if (storedToken?.startsWith('local_demo_') && !localStorage.getItem('phantom_auth_mode')) {
      localStorage.setItem('phantom_auth_mode', 'local');
    }

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const startDemoSession = useCallback(() => {
    const newToken = `local_demo_${Date.now()}`;
    localStorage.setItem('phantom_token', newToken);
    localStorage.setItem('phantom_user', JSON.stringify(DEMO_USER));
    localStorage.setItem('phantom_auth_mode', 'local');
    setToken(newToken);
    setUser(DEMO_USER);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.login({ username, password });
      const { token: newToken, user: newUser } = response;

      localStorage.setItem('phantom_token', newToken);
      localStorage.setItem('phantom_user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await api.logout();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    isLocalMode: Boolean(token?.startsWith('local_demo_')),
    isLoading,
    login,
    startDemoSession,
    logout,
  }), [user, token, isLoading, login, startDemoSession, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
