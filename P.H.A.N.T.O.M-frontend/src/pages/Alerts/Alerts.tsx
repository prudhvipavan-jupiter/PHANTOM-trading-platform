import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';

interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
}

// Mock market data for alert triggering
const mockCurrentPrices: Record<string, number> = {
  RELIANCE: 2500,
  TCS: 3450,
  HDFCBANK: 1600,
  INFY: 1500,
};

const Alerts: React.FC = () => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    targetPrice: '',
    condition: 'above' as 'above' | 'below',
  });

  // Simulate real-time price checks
  useEffect(() => {
    const interval = setInterval(() => {
      alerts.forEach(alert => {
        if (alert.isActive) {
          const currentPrice = mockCurrentPrices[alert.symbol];
          if (currentPrice) {
            let triggered = false;
            if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
              triggered = true;
            } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
              triggered = true;
            }

            if (triggered) {
              showToast({ type: 'info', title: 'Alert Triggered', message: `Alert! ${alert.symbol} is now ${currentPrice} (Target: ${alert.targetPrice} ${alert.condition})` });
              setAlerts((prev: Alert[]) => prev.map(a => a.id === alert.id ? { ...a, isActive: false } : a)); // Deactivate alert after triggering
            }
          }
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [alerts, showToast]);

  const handleAddAlert = () => {
    if (newAlert.symbol && newAlert.targetPrice && newAlert.condition) {
      const alert: Alert = {
        id: Date.now().toString(),
        symbol: newAlert.symbol.toUpperCase(),
        targetPrice: Number(newAlert.targetPrice),
        condition: newAlert.condition,
        isActive: true,
      };
      setAlerts((prev: Alert[]) => [...prev, alert]);
      setNewAlert({ symbol: '', targetPrice: '', condition: 'above' });
      showToast({ type: 'success', title: 'Success', message: 'Alert added successfully!' });
    } else {
      showToast({ type: 'error', title: 'Error', message: 'Please fill all alert details.' });
    }
  };

  const handleToggleAlert = (id: string) => {
    setAlerts((prev: Alert[]) => prev.map(alert =>
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev: Alert[]) => prev.filter(alert => alert.id !== id));
    showToast({ type: 'info', title: 'Info', message: 'Alert deleted.' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-orbitron text-primary">Real-time Alerts</h1>

      {/* Add New Alert Section */}
      <motion.div
        className="phantom-card p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-orbitron mb-4">Create New Alert</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Stock Symbol"
            placeholder="e.g., RELIANCE"
            value={newAlert.symbol}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAlert(prev => ({ ...prev, symbol: e.target.value }))}
          />
          <Input
            label="Target Price"
            type="number"
            placeholder="e.g., 2550"
            value={newAlert.targetPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
          />
          <Select
            value={newAlert.condition}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewAlert(prev => ({ ...prev, condition: e.target.value as 'above' | 'below' }))}
            options={[
              { value: 'above', label: 'Above' },
              { value: 'below', label: 'Below' },
            ]}
          />
        </div>
        <Button onClick={handleAddAlert} className="w-full">
          Add Alert
        </Button>
      </motion.div>

      {/* Existing Alerts List */}
      <motion.div
        className="phantom-card p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-xl font-orbitron mb-4">My Alerts ({alerts.length})</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center">No alerts configured yet.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between bg-[#212121] p-4 rounded-lg border border-[#3a3a3a]">
                <div>
                  <p className="text-lg font-semibold text-white">{alert.symbol}: {alert.condition.toUpperCase()} {alert.targetPrice}</p>
                  <p className="text-sm text-gray-400">Status: {alert.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="space-x-3">
                  <Button
                    onClick={() => handleToggleAlert(alert.id)}
                    className={`phantom-button-sm ${alert.isActive ? 'bg-yellow-600' : 'bg-green-600'}`}
                  >
                    {alert.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    onClick={() => deleteAlert(alert.id)}
                    className="phantom-button-sm bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Alerts; 