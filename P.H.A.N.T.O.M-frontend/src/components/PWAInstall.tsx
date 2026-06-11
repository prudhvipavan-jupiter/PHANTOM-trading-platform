import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTimes, faMobile, faDesktop } from '@fortawesome/free-solid-svg-icons';

interface PWAInstallProps {
  className?: string;
}

const PWAInstall: React.FC<PWAInstallProps> = ({ className = '' }) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!checkIfInstalled()) {
        setShowInstallPrompt(true);
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA installed successfully!');
    };

    // Check if already installed
    if (!checkIfInstalled()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}
        >
          <div className="bg-gradient-to-br from-blue-900/95 via-cyan-900/95 to-blue-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl shadow-2xl p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <FontAwesomeIcon icon={faDownload} className="text-black text-lg" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold font-mono text-sm mb-1">
                  Install P.H.A.N.T.O.M
                </h3>
                <p className="text-cyan-300 font-mono text-xs mb-3">
                  Install our AI trading platform for quick access and offline trading capabilities.
                </p>
                
                <div className="flex items-center space-x-2 text-xs text-gray-400 mb-3">
                  <FontAwesomeIcon icon={faMobile} className="text-xs" />
                  <span>Mobile App Experience</span>
                  <span>•</span>
                  <FontAwesomeIcon icon={faDesktop} className="text-xs" />
                  <span>Offline Trading</span>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    onClick={handleInstallClick}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-mono font-bold text-xs rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Install App
                  </motion.button>
                  
                  <motion.button
                    onClick={handleDismiss}
                    className="px-3 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 font-mono font-bold text-xs rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstall; 