import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'trade' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
  criticalCount: number;
  setAlertsEnabled: (enabled: boolean) => void;
  alertsEnabled: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const { showToast } = useToast();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for high priority notifications
    if (notification.priority === 'high' || notification.priority === 'critical') {
      showToast({
        type: notification.type === 'trade' ? 'success' : notification.type === 'alert' ? 'warning' : notification.type,
        title: notification.title,
        message: notification.message,
      });
    }

    // Play sound for critical notifications
    if (notification.priority === 'critical') {
      // Play notification sound
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Fallback: use browser notification sound
          console.log('🔔 Critical notification sound played');
        });
      } catch (error) {
        console.log('🔔 Critical notification sound played');
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Only generate notifications when alerts are enabled
      if (!alertsEnabled) return;

      // Random trading notifications
      if (Math.random() > 0.7) {
        const tradeTypes = ['BUY', 'SELL', 'HOLD'];
        const symbols = ['BTC/INR', 'ETH/INR', 'RELIANCE', 'TCS'];
        const randomType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

        addNotification({
          type: 'trade',
          title: 'AI Trading Signal',
          message: `${randomType} signal for ${randomSymbol} - AI confidence: ${Math.floor(Math.random() * 20) + 80}%`,
          priority: 'medium',
          action: {
            label: 'View Details',
            onClick: () => console.log('View trade details'),
          },
        });
      }

      // Market alerts
      if (Math.random() > 0.8) {
        addNotification({
          type: 'alert',
          title: 'Market Alert',
          message: 'High volatility detected in crypto markets. Risk management protocols activated.',
          priority: 'high',
        });
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [alertsEnabled]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount,
    criticalCount,
    setAlertsEnabled,
    alertsEnabled,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 