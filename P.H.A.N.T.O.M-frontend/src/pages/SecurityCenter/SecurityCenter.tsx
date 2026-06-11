import React, { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';

const SecurityCenter: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [ipWhitelistingEnabled, setIpWhitelistingEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [currentIp] = useState('192.168.1.100'); // Mock current IP
  const [whitelistedIps, setWhitelistedIps] = useState<string[]>([
    '192.168.1.1',
    '10.0.0.5',
  ]);
  const [newIp, setNewIp] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddIp = () => {
    if (newIp && !whitelistedIps.includes(newIp)) {
      setWhitelistedIps((prev) => [...prev, newIp]);
      setNewIp('');
      alert('IP added!');
    } else if (whitelistedIps.includes(newIp)) {
      alert('IP already whitelisted.');
    }
  };

  const handleRemoveIp = (ipToRemove: string) => {
    setWhitelistedIps((prev) => prev.filter((ip) => ip !== ipToRemove));
    alert('IP removed!');
  };

  const handleDeleteAccount = () => {
    alert('Account deletion initiated!');
    setIsDeleteModalOpen(false);
    // In a real app, this would trigger an API call and likely log the user out
  };

  return (
    <div className="min-h-screen bg-background-default text-text-primary p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-main">Security Center</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Two-Factor Authentication */}
        <div className="phantom-card">
          <h2 className="text-2xl font-semibold mb-4">Two-Factor Authentication (2FA)</h2>
          <div className="flex items-center justify-between mb-4">
            <p className="text-text-secondary">Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
            <Button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              size="sm"
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
          <p className="text-text-muted text-sm">
            Add an extra layer of security to your account with 2FA.
          </p>
        </div>

        {/* IP Whitelisting */}
        <div className="phantom-card">
          <h2 className="text-2xl font-semibold mb-4">IP Whitelisting</h2>
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-secondary">Current IP: <span className="text-primary-main">{currentIp}</span></p>
            <Button
              onClick={() => setIpWhitelistingEnabled(!ipWhitelistingEnabled)}
              size="sm"
            >
              {ipWhitelistingEnabled ? 'Disable Whitelisting' : 'Enable Whitelisting'}
            </Button>
          </div>
          <ul className="mb-4 max-h-24 overflow-y-auto custom-scrollbar bg-background-elevated p-2 rounded">
            {whitelistedIps.map((ip) => (
              <li key={ip} className="flex justify-between items-center text-sm text-text-primary py-1">
                <span>{ip}</span>
                <Button onClick={() => handleRemoveIp(ip)} size="sm">
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter new IP address"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddIp}>
              Add IP
            </Button>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="phantom-card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Session Management</h2>
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="sessionTimeout" className="text-text-secondary text-sm font-medium">
            Session Timeout (minutes):
          </label>
          <Input
            id="sessionTimeout"
            type="number"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            className="w-24"
            min={5}
            max={120}
          />
        </div>
        <p className="text-text-muted text-sm">
          Automatically log out after a period of inactivity.
        </p>
      </div>

      {/* Account Deletion */}
      <div className="phantom-card bg-error-main bg-opacity-10 border-error-main">
        <h2 className="text-2xl font-semibold mb-4 text-error-main">Danger Zone</h2>
        <p className="text-text-secondary mb-4">
          Permanently delete your P.H.A.N.T.O.M account and all associated data.
          This action cannot be undone.
        </p>
        <Button onClick={() => setIsDeleteModalOpen(true)}>
          Delete Account
        </Button>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        size="sm"
      >
        <div className="text-text-secondary mb-4">
          Are you sure you want to delete your P.H.A.N.T.O.M account? This action is irreversible.
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SecurityCenter; 