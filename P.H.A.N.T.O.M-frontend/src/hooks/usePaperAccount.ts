import { useCallback, useEffect, useState } from 'react';
import { api } from '../utils/api';

export interface PaperWallet {
  balance: number;
  currency: string;
  portfolioValue: number;
  totalEquity: number;
  invested: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface PaperHolding {
  symbol: string;
  symbolName?: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  sector?: string;
}

export interface PaperOverview {
  totalValue: number;
  cashBalance: number;
  portfolioValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  numberOfHoldings: number;
  topHoldings: Array<{ symbol: string; value: number; percentage: number }>;
  performance: {
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
  };
}

export interface TradingStats {
  totalTrades: number;
  netProfit: number;
  winningTrades: number;
  losingTrades: number;
  winRate?: number;
  totalVolume?: number;
  totalProfit?: number;
  totalLoss?: number;
}

export function usePaperAccount(autoLoad = true) {
  const [wallet, setWallet] = useState<PaperWallet | null>(null);
  const [overview, setOverview] = useState<PaperOverview | null>(null);
  const [holdings, setHoldings] = useState<PaperHolding[]>([]);
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletData, overviewData, holdingsData, statsData] = await Promise.all([
        api.getWallet(),
        api.getPortfolioOverview(),
        api.getHoldings(),
        api.getTradingStats('1M'),
      ]);
      setWallet(walletData as PaperWallet);
      setOverview(overviewData as PaperOverview);
      setHoldings(holdingsData as PaperHolding[]);
      const statsPayload = statsData as { stats?: TradingStats };
      setStats(statsPayload.stats ?? (statsData as TradingStats));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) refresh();
  }, [autoLoad, refresh]);

  return { wallet, overview, holdings, stats, loading, error, refresh };
}
