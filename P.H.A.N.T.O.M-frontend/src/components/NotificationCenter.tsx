import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faTimes, 
  faCheckCircle, 
  faExclamationTriangle, 
  faInfoCircle,
  faTrash,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'trade' | 'system' | 'security' | 'market'>('all');
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    soundEnabled: true,
    tradeAlerts: true,
    systemAlerts: true,
    securityAlerts: true,
    marketAlerts: true
  });

  // Production-ready notification center

  // Enhanced interaction handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't close if clicking on the bell button or inside the notification panel
      if (isOpen && 
          !target.closest('.notification-center') && 
          !target.closest('[data-notification-panel]')) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Use mousedown for better responsiveness
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Note: Demo notifications are now added in the Dashboard component
  // This component just displays notifications from the context

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    // For now, filter by type since context doesn't have category
    return notifications.filter(n => n.type === filter);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return faCheckCircle;
      case 'warning': return faExclamationTriangle;
      case 'error': return faExclamationTriangle;
      case 'info': return faInfoCircle;
      case 'trade': return faCheckCircle;
      case 'alert': return faExclamationTriangle;
      default: return faInfoCircle;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 border-green-400/30 bg-green-900/20';
      case 'warning': return 'text-yellow-400 border-yellow-400/30 bg-yellow-900/20';
      case 'error': return 'text-red-400 border-red-400/30 bg-red-900/20';
      case 'info': return 'text-blue-400 border-blue-400/30 bg-blue-900/20';
      case 'trade': return 'text-green-400 border-green-400/30 bg-green-900/20';
      case 'alert': return 'text-red-400 border-red-400/30 bg-red-900/20';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <div className="relative notification-center">
        {/* Notification Bell */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 backdrop-blur-xl border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle notifications"
          title="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-2xl text-cyan-400" />
          {unreadCount > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Notification Panel - Rendered as Portal */}
      <AnimatePresence>
        {isOpen && createPortal(
          <motion.div
            data-notification-panel
            className="fixed top-20 right-4 w-96 max-h-96 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl z-[99999] overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-cyan-400/30 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-cyan-400 font-mono">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-cyan-300 hover:text-cyan-400 transition-colors font-mono"
                      title="Mark all notifications as read"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-cyan-300 hover:text-cyan-400 transition-colors"
                    title="Close notifications"
                    aria-label="Close notifications"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex space-x-2 mt-3">
                {(['all', 'unread', 'trade', 'system', 'security', 'market'] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      filter === filterType
                        ? 'bg-cyan-500 text-black'
                        : 'text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/20'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              <AnimatePresence>
                {getFilteredNotifications().length === 0 ? (
                  <motion.div
                    className="p-8 text-center text-cyan-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FontAwesomeIcon icon={faBell} className="text-4xl mb-4 opacity-50" />
                    <p className="font-mono">No notifications</p>
                  </motion.div>
                ) : (
                  getFilteredNotifications().map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-4 border-b border-cyan-400/20 hover:bg-cyan-400/5 transition-all ${
                        !notification.read ? 'bg-cyan-400/10' : ''
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg border ${getNotificationColor(notification.type)}`}>
                          <FontAwesomeIcon icon={getNotificationIcon(notification.type)} className="text-lg" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-white font-mono text-sm truncate">
                              {notification.title}
                            </h4>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            )}
                          </div>
                          
                          <p className="text-cyan-200 text-sm mb-2 font-mono">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-cyan-400 font-mono">
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              {notification.action && (
                                <button
                                  onClick={notification.action.onClick}
                                  className="text-xs text-cyan-300 hover:text-cyan-400 transition-colors"
                                >
                                  {notification.action.label}
                                </button>
                              )}
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                title="Delete notification"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cyan-400/30 bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors font-mono"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setSettings({ ...settings, pushEnabled: !settings.pushEnabled })}
                  className="text-xs text-cyan-300 hover:text-cyan-400 transition-colors font-mono flex items-center space-x-1"
                >
                  <FontAwesomeIcon icon={settings.pushEnabled ? faEye : faEyeSlash} />
                  <span>{settings.pushEnabled ? 'Disable' : 'Enable'} Notifications</span>
                </button>
              </div>
            </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter; 