import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBrain,
  faChartPie,
  faShieldAlt,
  faSignOutAlt,
  faChevronUp,
  faChevronDown,
  faDollarSign,
  faBullseye,
  faCog,
  faHistory,
  faNewspaper,
  faWallet,
  faCalculator,
  faUsers,
  faDatabase,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
  children?: NavigationItem[];
}

interface PhantomSidebarProps {
  onLogout: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const PhantomSidebar: React.FC<PhantomSidebarProps> = ({
  onLogout,
  isMobile = false,
  isOpen = true,
  onToggle
}) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    trading: true,
    intelligence: false,
    market: false,
    compliance: false
  });

  const [collapsed, setCollapsed] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: 'trading',
      label: 'Trading & Portfolio',
      icon: faDollarSign,
      path: '/dashboard',
      children: [
        { id: 'dashboard', label: 'Money Generation', icon: faDollarSign, path: '/dashboard' },
        { id: 'portfolio', label: 'Portfolio', icon: faChartLine, path: '/portfolio' },
        { id: 'portfolio-management', label: 'Portfolio Management', icon: faCog, path: '/portfolio-management' },
        { id: 'trade-history', label: 'Trade History', icon: faHistory, path: '/trade-history' },
        { id: 'wallet', label: 'Wallet', icon: faWallet, path: '/wallet' },
        { id: 'advanced-analytics', label: 'Advanced Analytics', icon: faCalculator, path: '/advanced-analytics' },
        { id: 'social-trading', label: 'Social Trading', icon: faUsers, path: '/social-trading' }
      ]
    },
    {
      id: 'intelligence',
      label: 'AI Intelligence',
      icon: faBrain,
      path: '/ai-strategy-builder',
      children: [
        { id: 'ai-strategy-builder', label: 'AI Strategy Builder', icon: faBrain, path: '/ai-strategy-builder' },
        { id: 'ai-trainer', label: 'AI Trainer', icon: faCog, path: '/ai-trainer' },
        { id: 'ai-model-training', label: 'AI Model Training', icon: faDatabase, path: '/ai-model-training' },
        { id: 'backtesting-engine', label: 'Backtesting Engine', icon: faBullseye, path: '/backtesting-engine' }
      ]
    },
    {
      id: 'market',
      label: 'Market Data',
      icon: faChartLine,
      path: '/market-watch',
      children: [
        { id: 'market-watch', label: 'Market Watch', icon: faChartLine, path: '/market-watch' },
        { id: 'news-sentiment', label: 'News & Sentiment', icon: faNewspaper, path: '/news-sentiment' },
        { id: 'daily-opportunities', label: 'Daily Opportunities', icon: faBullseye, path: '/daily-opportunities' }
      ]
    },
    {
      id: 'compliance',
      label: 'Security & Settings',
      icon: faShieldAlt,
      path: '/compliance',
      children: [
        { id: 'compliance', label: 'SEBI Compliance', icon: faShieldAlt, path: '/compliance' },
        { id: 'security-center', label: 'Security Center', icon: faShieldAlt, path: '/security-center' },
        { id: 'settings', label: 'Settings', icon: faCog, path: '/settings' }
      ]
    }
  ];

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isChildActive = (children: NavigationItem[]) => {
    return children.some(child => isActive(child.path));
  };

  const sidebarVariants = {
    open: {
      width: collapsed ? 80 : 280,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    closed: {
      width: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const renderNavItem = (item: NavigationItem, isChild = false) => {
    const active = isActive(item.path);
    const hasActiveChild = item.children ? isChildActive(item.children) : false;
    const isExpanded = openSections[item.id as keyof typeof openSections];

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: isChild ? 0.1 : 0 }}
      >
        {item.children ? (
          <div className="mb-2">
            <button
              onClick={() => toggleSection(item.id as keyof typeof openSections)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                hasActiveChild
                  ? 'bg-phantom-primary/20 text-phantom-primary border border-phantom-primary/30'
                  : 'text-phantom-text-secondary hover:bg-phantom-bg-hover hover:text-phantom-text-primary'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`text-lg transition-all duration-200 ${
                    hasActiveChild ? 'text-phantom-primary' : 'group-hover:text-phantom-primary'
                  }`}
                />
                {!collapsed && (
                  <span className="phantom-caption font-medium">{item.label}</span>
                )}
              </div>
              {!collapsed && (
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  className={`text-sm transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>
            
            <AnimatePresence>
              {isExpanded && !collapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map(child => renderNavItem(child, true))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition-all duration-200 group ${
              active
                ? 'bg-phantom-primary/20 text-phantom-primary border border-phantom-primary/30'
                : 'text-phantom-text-secondary hover:bg-phantom-bg-hover hover:text-phantom-text-primary'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-lg transition-all duration-200 ${
                  active ? 'text-phantom-primary' : 'group-hover:text-phantom-primary'
                }`}
              />
              {!collapsed && (
                <span className="phantom-caption font-medium">{item.label}</span>
              )}
              {item.badge && !collapsed && (
                <span className="ml-auto bg-phantom-accent text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          </Link>
        )}
      </motion.div>
    );
  };

  const sidebarContent = (
    <motion.div
      className="h-full flex flex-col"
      variants={contentVariants}
      initial="closed"
      animate="open"
    >
      {/* Header */}
      <div className="p-6 border-b border-phantom-border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/phantom-logo.svg" alt="P.H.A.N.T.O.M" className="w-8 h-8" />
              <div className="absolute inset-0 bg-phantom-primary rounded-full blur-lg opacity-30 animate-pulse" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="phantom-heading-3 phantom-text-gradient">
                  P.H.A.N.T.O.M
                </h1>
                <p className="phantom-caption text-phantom-text-secondary">
                  Neural Trading Operations
                </p>
              </div>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-phantom-bg-hover transition-colors duration-200"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <FontAwesomeIcon
                icon={collapsed ? faBars : faTimes}
                className="text-phantom-text-secondary hover:text-phantom-primary"
              />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map(item => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-phantom-border-primary">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-phantom-text-secondary hover:bg-phantom-bg-hover hover:text-phantom-accent transition-all duration-200 group"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="text-lg group-hover:text-phantom-accent"
          />
          {!collapsed && (
            <span className="phantom-caption font-medium">Logout</span>
          )}
        </button>
      </div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onToggle}
            />
            
            {/* Sidebar */}
            <motion.aside
              className="absolute left-0 top-0 h-full bg-phantom-bg-secondary border-r border-phantom-border-primary shadow-2xl"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      className="h-full bg-phantom-bg-secondary border-r border-phantom-border-primary shadow-2xl"
      variants={sidebarVariants}
      animate="open"
    >
      {sidebarContent}
    </motion.aside>
  );
};

export default PhantomSidebar; 