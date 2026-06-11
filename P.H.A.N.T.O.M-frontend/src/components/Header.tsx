import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faMicrophone, faBars, faTimes, faShieldAlt, faSignOutAlt, faUser, faHome, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useVoice } from '../contexts/VoiceContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isListening, startListening, stopListening } = useVoice();
  const { } = useNotifications();
  const [showSecurityMenu, setShowSecurityMenu] = useState(false);
  // Removed unused state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  const securityMenuRef = useRef<HTMLDivElement>(null);
  // Removed unused ref
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check for PWA install prompt
  useEffect(() => {
    const checkInstallPrompt = () => {
      if ('serviceWorker' in navigator && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(true);
      }
    };
    
    checkInstallPrompt();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (securityMenuRef.current && !securityMenuRef.current.contains(event.target as Node)) {
        setShowSecurityMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      console.log('🎤 IRIS Voice Assistant stopped');
    } else {
      startListening();
      console.log('🎤 IRIS Voice Assistant activated - "How may I help you?"');
    }
  };

  const handleSettingsClick = () => {
    console.log('⚙️ Opening Settings...');
    navigate('/settings');
  };

  const handleHomeClick = () => {
    console.log('🏠 Going to Home...');
    navigate('/dashboard');
  };

  const handleInstallClick = () => {
    console.log('📱 Installing PWA...');
    if ((window as any).installPWA) {
      (window as any).installPWA();
    }
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    console.log('👤 Opening Profile...');
    navigate('/dashboard');
  };

  // Removed unused notification functions - now handled by NotificationCenter component

  return (
    <header className="bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-xl border-b border-cyan-400/30 shadow-xl p-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon 
            icon={isSidebarOpen ? faTimes : faBars} 
            className="text-cyan-400 text-lg" 
          />
        </button>

        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img src="/phantom-logo.svg" alt="P.H.A.N.T.O.M" className="w-10 h-10 blur-sm opacity-30 animate-pulse" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                P.H.A.N.T.O.M
              </h1>
              <p className="text-cyan-400 font-mono text-xs font-bold">Powered By J.U.P.I.T.E.R AI</p>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* PWA Install Button */}
          {showInstallPrompt && (
            <button
              onClick={handleInstallClick}
              className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 hover:border-green-400/60 transition-all duration-300"
              aria-label="Install PWA"
              title="Install P.H.A.N.T.O.M App"
            >
              <FontAwesomeIcon icon={faDownload} className="text-green-400 text-lg" />
            </button>
          )}

          {/* Home Button */}
          <button
            onClick={handleHomeClick}
            className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
            aria-label="Go to Home"
            title="Go to Home"
          >
            <FontAwesomeIcon icon={faHome} className="text-cyan-400 text-lg" />
          </button>

          {/* Security Status */}
          <div className="relative">
            <button
              onClick={() => setShowSecurityMenu(!showSecurityMenu)}
              className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 hover:border-green-400/60 transition-all duration-300"
              aria-label="Security status"
            >
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-400 text-lg" />
            </button>
            
            {showSecurityMenu && (
              <div ref={securityMenuRef} className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-gray-900 to-black border border-cyan-400/30 rounded-lg shadow-2xl p-4 z-50">
                <h3 className="text-cyan-400 font-mono font-bold mb-3">Security Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">2FA Status:</span>
                    <span className="text-green-400 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Encryption:</span>
                    <span className="text-green-400 font-bold">AES-256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Last Login:</span>
                    <span className="text-cyan-400">2 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Session:</span>
                    <span className="text-green-400 font-bold">SECURE</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <NotificationCenter />

          {/* Voice Assistant */}
          <button
            onClick={handleVoiceToggle}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60'
            }`}
            aria-label="Activate IRIS Voice Assistant"
            title={isListening ? "Stop IRIS Voice Assistant" : "Start IRIS Voice Assistant"}
          >
            <FontAwesomeIcon 
              icon={faMicrophone} 
              className={`text-lg ${isListening ? 'text-red-400' : 'text-cyan-400'}`} 
            />
          </button>

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
            aria-label="Open settings"
            title="Open Settings"
          >
            <FontAwesomeIcon icon={faCog} className="text-cyan-400 text-lg" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
              aria-label="User profile"
              title="User Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm font-mono">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-cyan-400 font-mono text-sm hidden md:block">
                {user?.name || 'User'}
              </span>
            </button>
            
            {showUserMenu && (
              <div ref={userMenuRef} className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black border border-cyan-400/30 rounded-lg shadow-2xl p-2 z-50">
                <div className="space-y-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-3 py-2 rounded text-sm text-cyan-300 hover:bg-cyan-500/20 transition-colors flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-sm" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-left px-3 py-2 rounded text-sm text-cyan-300 hover:bg-cyan-500/20 transition-colors flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faHome} className="text-sm" />
                    <span>Dashboard</span>
                  </button>
                  <hr className="border-cyan-400/20 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 