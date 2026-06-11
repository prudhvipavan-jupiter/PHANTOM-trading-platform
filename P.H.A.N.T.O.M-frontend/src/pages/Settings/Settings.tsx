import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useVoice } from '../../contexts/VoiceContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface NotificationPreferences {
  tradeAlerts: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

interface TelegramSettings {
  botToken: string;
  chatId: string;
}

interface TradingPreferences {
  defaultLeverage: number;
  stopLoss: number;
  exchange: string;
}

interface BrokerAccount {
  id: string;
  broker: string;
  apiKey: string;
  apiSecret: string;
  isConnected: boolean;
  lastSync: string;
}

const Settings = () => {
  const { showToast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Admin',
    email: 'admin@phantom.com',
    phone: '+91 9876543210',
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    tradeAlerts: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>({
    botToken: '', // In a real app, this would be masked/encrypted
    chatId: '',
  });

  const [tradingPreferences, setTradingPreferences] = useState<TradingPreferences>({
    defaultLeverage: 1,
    stopLoss: 2,
    exchange: 'NSE',
  });

  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>([
    {
      id: '1',
      broker: 'Zerodha',
      apiKey: '********',
      apiSecret: '********',
      isConnected: true,
      lastSync: '2024-03-14 15:30:00',
    },
  ]);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAddBroker, setShowAddBroker] = useState(false);
  const [newBroker, setNewBroker] = useState<Partial<BrokerAccount>>({
    broker: '',
    apiKey: '',
    apiSecret: '',
  });
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});

  const { isVoiceModeOn, toggleVoiceMode, voiceStyle, setVoiceStyle } = useVoice();

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile({ ...userProfile, [field]: value });
  };

  const handleNotificationChange = (field: keyof NotificationPreferences) => {
    setNotifications((prev: NotificationPreferences) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTestTelegramConnection = async () => {
    if (telegramSettings.botToken && telegramSettings.chatId) {
      showToast({ type: 'info', title: 'Info', message: 'Simulating Telegram connection test... This is a mock function.' });
      setTimeout(() => {
        showToast({ type: 'success', title: 'Success', message: 'Mock Telegram connection successful! (Backend integration needed for real functionality)' });
      }, 2000);
    } else {
      showToast({ type: 'error', title: 'Error', message: 'Please enter both Telegram Bot Token and Chat ID.' });
    }
  };

  const handleTradingPreferenceChange = (field: keyof TradingPreferences, value: string | number) => {
    setTradingPreferences({ ...tradingPreferences, [field]: value });
  };

  const encryptCredentials = (apiKey: string, apiSecret: string) => {
    console.log("Mock: Encrypting credentials...");
    return {
      encryptedKey: `ENC_${btoa(apiKey)}`,
      encryptedSecret: `ENC_${btoa(apiSecret)}`,
    };
  };

  const handleAddBroker = () => {
    if (newBroker.broker && newBroker.apiKey && newBroker.apiSecret) {
      const encrypted = encryptCredentials(newBroker.apiKey, newBroker.apiSecret);
      const brokerAccount: BrokerAccount = {
        id: Date.now().toString(),
        broker: newBroker.broker,
        apiKey: encrypted.encryptedKey,
        apiSecret: encrypted.encryptedSecret,
        isConnected: false,
        lastSync: 'N/A',
      };
      setBrokerAccounts((prev: BrokerAccount[]) => [...prev, brokerAccount]);
      setNewBroker({ broker: '', apiKey: '', apiSecret: '' });
      setShowAddBroker(false);
      showToast({ type: 'success', title: 'Success', message: 'Broker account added successfully!' });
    } else {
      showToast({ type: 'error', title: 'Error', message: 'Please fill all broker details.' });
    }
  };

  const handleRemoveBroker = async (id: string) => {
    setIsConnecting((prev: Record<string, boolean>) => ({ ...prev, [id]: true }));
    try {
      // Mock response since api.broker doesn't exist
      const response = { success: true };
      if (response.success) {
        setBrokerAccounts((prev: BrokerAccount[]) => prev.filter((account: BrokerAccount) => account.id !== id));
        showToast({ type: 'info', title: 'Info', message: 'Broker account removed.' });
      } else {
        showToast({ type: 'error', title: 'Error', message: 'Failed to remove broker.' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Error removing broker.' });
    } finally {
      setIsConnecting((prev: Record<string, boolean>) => ({ ...prev, [id]: false }));
    }
  };

  const handleConnectBroker = async (id: string) => {
    setIsConnecting((prev: Record<string, boolean>) => ({ ...prev, [id]: true }));
    const accountToConnect = brokerAccounts.find(account => account.id === id);
    if (!accountToConnect) return;

    try {
      // Mock response since api.broker doesn't exist
      const response = { success: true, data: { lastSync: new Date().toISOString() } };

      if (response.success) {
        setBrokerAccounts((accounts: BrokerAccount[]) =>
          accounts.map((account: BrokerAccount) =>
            account.id === id ? { ...account, isConnected: true, lastSync: response.data.lastSync } : account
          )
        );
        showToast({ type: 'success', title: 'Success', message: 'Broker account connected successfully!' });
      } else {
        showToast({ type: 'error', title: 'Error', message: 'Failed to connect to broker.' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Error connecting to broker.' });
    } finally {
      setIsConnecting((prev: Record<string, boolean>) => ({ ...prev, [id]: false }));
    }
  };

  const handleSyncBroker = async (id: string) => {
    setIsConnecting((prev: Record<string, boolean>) => ({ ...prev, [id]: true }));
    try {
      // Mock response since api.broker doesn't exist
      const response = { success: true, data: { lastSync: new Date().toISOString() } };
      if (response.success) {
        setBrokerAccounts((accounts: BrokerAccount[]) =>
          accounts.map((account: BrokerAccount) =>
            account.id === id ? { ...account, lastSync: response.data.lastSync } : account
          )
        );
        showToast({ type: 'success', title: 'Success', message: 'Broker account synced successfully!' });
      } else {
        showToast({ type: 'error', title: 'Error', message: 'Failed to sync broker.' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Error syncing broker.' });
    } finally {
      setIsConnecting((prev: Record<string, boolean>) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron text-primary">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="phantom-card">
          <h2 className="text-xl font-orbitron mb-4">User Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="phantom-input w-full"
                placeholder="Enter your name"
                title="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Email</label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="phantom-input w-full"
                placeholder="Enter your email"
                title="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Phone</label>
              <input
                type="tel"
                value={userProfile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="phantom-input w-full"
                placeholder="Enter your phone number"
                title="Enter your phone number"
              />
            </div>
          </div>
        </div>

        <div className="phantom-card">
          <h2 className="text-xl font-orbitron mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notifications.tradeAlerts}
                onChange={() => handleNotificationChange('tradeAlerts')}
                className="phantom-checkbox"
                title="Enable or disable trade alerts"
                placeholder="Trade Alerts"
              />
              <span>Trade Alerts</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={() => handleNotificationChange('pushNotifications')}
                className="phantom-checkbox"
                title="Enable or disable push notifications"
                placeholder="Push Notifications"
              />
              <span>Push Notifications</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
                className="phantom-checkbox"
                title="Enable or disable email notifications"
                placeholder="Email Notifications"
              />
              <span>Email Notifications</span>
            </label>
          </div>
        </div>

        <div className="phantom-card">
          <h2 className="text-xl font-orbitron mb-4">Telegram Integration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Telegram Bot Token</label>
              <input
                type="password"
                placeholder="Bot Token"
                value={telegramSettings.botToken}
                onChange={(e) => setTelegramSettings(prev => ({ ...prev, botToken: e.target.value }))}
                className="phantom-input"
                aria-label="Telegram bot token"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-2">Telegram Chat ID</label>
              <input
                type="text"
                placeholder="Chat ID"
                value={telegramSettings.chatId}
                onChange={(e) => setTelegramSettings(prev => ({ ...prev, chatId: e.target.value }))}
                className="phantom-input"
                aria-label="Telegram chat ID"
              />
            </div>
            <button
              onClick={handleTestTelegramConnection}
              className="phantom-button w-full mt-4"
            >
              Test Telegram Connection
            </button>
          </div>
        </div>

        <div className="phantom-card">
          <h2 className="text-xl font-orbitron mb-4">Trading Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Default Leverage</label>
              <select
                value={tradingPreferences.defaultLeverage}
                onChange={(e) => handleTradingPreferenceChange('defaultLeverage', Number(e.target.value))}
                className="phantom-input w-full"
                aria-label="Default Leverage"
                title="Default Leverage"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={3}>3x</option>
                <option value={4}>4x</option>
                <option value={5}>5x</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Default Stop Loss (%)</label>
              <input
                type="number"
                value={tradingPreferences.stopLoss}
                onChange={(e) => handleTradingPreferenceChange('stopLoss', Number(e.target.value))}
                className="phantom-input w-full"
                min="0.1"
                max="10"
                step="0.1"
                aria-label="Default stop loss percentage"
                title="Default stop loss percentage"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Preferred Exchange</label>
              <select
                id="preferred-exchange"
                value={tradingPreferences.exchange}
                onChange={(e) => handleTradingPreferenceChange('exchange', e.target.value)}
                className="phantom-input w-full"
                title="Preferred Exchange"
              >
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
              </select>
            </div>
          </div>
        </div>

        <div className="phantom-card">
          <h2 className="text-xl font-orbitron mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-text-secondary">Toggle between dark and light themes</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="sr-only peer"
                aria-label="Toggle dark mode"
              />
              <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        <div className="phantom-card">
          <h2 className="text-xl font-orbitron mb-4">Appearance Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-text-secondary">Toggle between dark and light themes</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="sr-only peer"
                aria-label="Toggle dark mode"
              />
              <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        <div className="phantom-card lg:col-span-2">
          <h2 className="text-xl font-orbitron mb-4">IRIS Voice Assistant</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">IRIS Voice Mode</div>
                <div className="text-sm text-text-secondary">Enable or disable the voice assistant</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVoiceModeOn}
                  onChange={toggleVoiceMode}
                  className="sr-only peer"
                  aria-label="Enable or disable IRIS Voice Mode"
                />
                <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div>
              <label htmlFor="voice-style" className="block text-sm text-text-secondary mb-2">Voice Style</label>
              <select
                id="voice-style"
                value={voiceStyle}
                onChange={(e) => setVoiceStyle(e.target.value as 'JARVIS' | 'Calm' | 'Indian English')}
                className="phantom-input w-full"
                disabled={!isVoiceModeOn}
                title="Select Voice Style"
              >
                <option value="JARVIS">JARVIS</option>
                <option value="Calm">Calm</option>
                <option value="Indian English">Indian English</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            * IRIS voice processing happens locally and never records your conversations.
          </p>
        </div>

        <div className="phantom-card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-orbitron">Broker Connections</h2>
            <button
              onClick={() => setShowAddBroker(!showAddBroker)}
              className="phantom-button"
            >
              {showAddBroker ? 'Cancel' : 'Add Broker'}
            </button>
          </div>

          {showAddBroker && (
            <div className="mb-6 p-4 border border-border-light rounded-lg">
              <h3 className="text-lg font-medium mb-4">Add New Broker</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Broker</label>
                  <select
                    value={newBroker.broker}
                    onChange={(e) => setNewBroker({ ...newBroker, broker: e.target.value })}
                    className="phantom-input w-full"
                    aria-label="Select Broker"
                    title="Select Broker"
                  >
                    <option value="">Select Broker</option>
                    <option value="Zerodha">Zerodha</option>
                    <option value="Upstox">Upstox</option>
                    <option value="Angel One">Angel One</option>
                    <option value="ICICI Direct">ICICI Direct</option>
                    <option value="Paytm Money">Paytm Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">API Key</label>
                  <input
                    type="password"
                    value={newBroker.apiKey}
                    onChange={(e) => setNewBroker({ ...newBroker, apiKey: e.target.value })}
                    className="phantom-input w-full"
                    placeholder="Enter API Key"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">API Secret</label>
                  <input
                    type="password"
                    value={newBroker.apiSecret}
                    onChange={(e) => setNewBroker({ ...newBroker, apiSecret: e.target.value })}
                    className="phantom-input w-full"
                    placeholder="Enter API Secret"
                  />
                </div>
                <button
                  onClick={handleAddBroker}
                  className="phantom-button w-full"
                >
                  Add Broker Account
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {brokerAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border border-border-light rounded-lg"
              >
                <div>
                  <div className="font-medium">{account.broker}</div>
                  <div className="text-sm text-text-secondary">
                    Connection Status: {
                      isConnecting[account.id] ? (
                        <span className="text-yellow-400">Connecting...</span>
                      ) : account.isConnected ? (
                        <span className="text-green-500">Connected</span>
                      ) : (
                        <span className="text-red-500">Disconnected</span>
                      )
                    }
                  </div>
                  <div className="text-sm text-text-secondary">
                    Last Sync: {isConnecting[account.id] && !account.isConnected ? 'Syncing...' : account.lastSync}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!account.isConnected && (
                    <button
                      onClick={() => handleConnectBroker(account.id)}
                      className="phantom-button phantom-button-sm"
                      disabled={isConnecting[account.id]}
                    >
                      {isConnecting[account.id] ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                  {account.isConnected && (
                    <button
                      onClick={() => handleSyncBroker(account.id)}
                      className="phantom-button phantom-button-sm bg-blue-600 hover:bg-blue-700"
                      disabled={isConnecting[account.id]}
                    >
                      {isConnecting[account.id] ? 'Syncing...' : 'Sync'}
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveBroker(account.id)}
                    className="phantom-button phantom-button-sm bg-red-600 hover:bg-red-700"
                    disabled={isConnecting[account.id]}
                  >
                    {isConnecting[account.id] ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;