import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

const Login = lazy(() => import('./pages/Login/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Portfolio = lazy(() => import('./pages/Portfolio/Portfolio'));
const PortfolioManagement = lazy(() => import('./pages/PortfolioManagement/PortfolioManagement'));
const TradeHistory = lazy(() => import('./pages/TradeHistory/TradeHistory'));
const MonthlyTarget = lazy(() => import('./pages/MonthlyTarget/MonthlyTarget'));
const PortfolioAnalysis = lazy(() => import('./pages/PortfolioAnalysis/PortfolioAnalysis'));
const AIStrategyBuilder = lazy(() => import('./pages/AIStrategyBuilder/AIStrategyBuilder'));
const BacktestingEngine = lazy(() => import('./pages/BacktestingEngine/BacktestingEngine'));
const AITrainer = lazy(() => import('./pages/AITrainer/AITrainer'));
const AIModelTraining = lazy(() => import('./pages/AIModelTraining/AIModelTraining'));
const PaperTrading = lazy(() => import('./pages/PaperTrading/PaperTrading'));
const LiveTrading = lazy(() => import('./pages/LiveTrading/LiveTrading'));
const PaytmConnect = lazy(() => import('./pages/PaytmConnect/PaytmConnect'));
const PAGS = lazy(() => import('./pages/PAGS/PAGS'));
const MarketWatch = lazy(() => import('./pages/MarketWatch/MarketWatch'));
const NewsSentimentPanel = lazy(() => import('./pages/Market/NewsSentimentPanel'));
const SecurityCenter = lazy(() => import('./pages/SecurityCenter/SecurityCenter'));
const SEBICompliance = lazy(() => import('./pages/Compliance/SEBICompliance'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Alerts = lazy(() => import('./pages/Alerts/Alerts'));
const Wallet = lazy(() => import('./pages/Wallet/Wallet'));
const AdvancedAnalytics = lazy(() => import('./pages/AdvancedAnalytics/AdvancedAnalytics'));
const SocialTrading = lazy(() => import('./pages/SocialTrading/SocialTrading'));
const AdvancedTradingDashboard = lazy(() => import('./components/AdvancedTrading/AdvancedTradingDashboard'));

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="portfolio-management" element={<PortfolioManagement />} />
      <Route path="trade-history" element={<TradeHistory />} />
      <Route path="monthly-target" element={<MonthlyTarget />} />
      <Route path="portfolio-analysis" element={<PortfolioAnalysis />} />
      <Route path="ai-strategy-builder" element={<AIStrategyBuilder />} />
      <Route path="backtesting-engine" element={<BacktestingEngine />} />
      <Route path="ai-trainer" element={<AITrainer />} />
      <Route path="ai-model-training" element={<AIModelTraining />} />
      <Route path="paper-trading" element={<PaperTrading />} />
      <Route path="live-trading" element={<LiveTrading />} />
      <Route path="paytm-connect" element={<PaytmConnect />} />
      <Route path="pags" element={<PAGS />} />
      <Route path="market-watch" element={<MarketWatch />} />
      <Route path="news-sentiment" element={<NewsSentimentPanel />} />
      <Route path="security-center" element={<SecurityCenter />} />
      <Route path="compliance" element={<SEBICompliance />} />
      <Route path="settings" element={<Settings />} />
      <Route path="alerts" element={<Alerts />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="advanced-analytics" element={<AdvancedAnalytics />} />
      <Route path="social-trading" element={<SocialTrading />} />
      <Route path="advanced-trading" element={<AdvancedTradingDashboard />} />
    </Route>
  </Routes>
);
