import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useToast } from './ToastContext';

interface Portfolio {
  id: string;
  name: string;
  description: string;
  capital: number;
  createdAt: string;
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  activePortfolio: Portfolio | null;
  createPortfolio: (name: string, description?: string) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string) => void;
  updatePortfolioCapital: (id: string, amount: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const initialPortfolios: Portfolio[] = [
  { id: '1', name: 'Main Portfolio', description: 'Primary trading account', capital: 1000000, createdAt: new Date().toISOString() },
  { id: '2', name: 'Swing Trades', description: 'Medium-term positions', capital: 250000, createdAt: new Date().toISOString() },
  { id: '3', name: 'Day Trading', description: 'High-frequency daily trades', capital: 50000, createdAt: new Date().toISOString() },
];

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const savedPortfolios = localStorage.getItem('phantom_portfolios');
    return savedPortfolios ? JSON.parse(savedPortfolios) : initialPortfolios;
  });
  const [activePortfolioId, setActivePortfolioIdInternal] = useState<string>(() => {
    const savedActivePortfolioId = localStorage.getItem('phantom_active_portfolio_id');
    return savedActivePortfolioId || initialPortfolios[0]?.id || '';
  });

  useEffect(() => {
    localStorage.setItem('phantom_portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  useEffect(() => {
    localStorage.setItem('phantom_active_portfolio_id', activePortfolioId);
  }, [activePortfolioId]);

  const createPortfolio = useCallback((name: string, description?: string) => {
    if (portfolios.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      showToast({ type: 'error', title: 'Error', message: 'A portfolio with this name already exists!' });
      return;
    }
    const newPortfolio: Portfolio = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description?.trim() || 'No description provided',
      capital: 0,
      createdAt: new Date().toISOString(),
    };
    setPortfolios(prev => [...prev, newPortfolio]);
    showToast({ type: 'success', title: 'Success', message: `Portfolio '${newPortfolio.name}' created!` });
    if (portfolios.length === 0) {
      setActivePortfolioIdInternal(newPortfolio.id); // Automatically set as active if it's the first one
    }
  }, [portfolios, showToast]);

  const deletePortfolio = useCallback((id: string) => {
    if (portfolios.length === 1) {
      showToast({ type: 'error', title: 'Error', message: 'Cannot delete the last portfolio!' });
      return;
    }
    setPortfolios(prev => prev.filter(p => p.id !== id));
    showToast({ type: 'info', title: 'Info', message: 'Portfolio deleted.' });
    if (activePortfolioId === id) {
      setActivePortfolioIdInternal(portfolios.find(p => p.id !== id)?.id || '');
    }
  }, [portfolios, activePortfolioId, showToast]);

  const setActivePortfolio = useCallback((id: string) => {
    const portfolioExists = portfolios.some(p => p.id === id);
    if (portfolioExists) {
      setActivePortfolioIdInternal(id);
      showToast({ type: 'success', title: 'Success', message: 'Portfolio switched successfully!' });
    } else {
      showToast({ type: 'error', title: 'Error', message: 'Portfolio not found!' });
    }
  }, [portfolios, showToast]);

  const updatePortfolioCapital = useCallback((id: string, amount: number) => {
    setPortfolios(prev =>
      prev.map(p =>
        p.id === id ? { ...p, capital: p.capital + amount } : p
      )
    );
    showToast({ type: 'success', title: 'Success', message: 'Portfolio capital updated!' });
  }, [showToast]);

  const activePortfolio = useMemo(() => {
    return portfolios.find(p => p.id === activePortfolioId) || null;
  }, [portfolios, activePortfolioId]);

  const contextValue = useMemo(() => ({
    portfolios,
    activePortfolio,
    createPortfolio,
    deletePortfolio,
    setActivePortfolio,
    updatePortfolioCapital,
  }), [portfolios, activePortfolio, createPortfolio, deletePortfolio, setActivePortfolio, updatePortfolioCapital]);

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}; 