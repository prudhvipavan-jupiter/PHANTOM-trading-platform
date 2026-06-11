import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user data
    const storedToken = localStorage.getItem('phantom_token');
    const storedUser = localStorage.getItem('phantom_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.login({ username, password });
      const { token: newToken, user: newUser } = response;

      // Store in localStorage
      localStorage.setItem('phantom_token', newToken);
      localStorage.setItem('phantom_user', JSON.stringify(newUser));

      // Update state
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.logout();

      // Clear localStorage
      localStorage.removeItem('phantom_token');
      localStorage.removeItem('phantom_user');

      // Clear state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  }), [user, token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 