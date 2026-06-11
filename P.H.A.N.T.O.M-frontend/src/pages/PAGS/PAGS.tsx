import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getClosestProgressWidthClass } from '../../utils/progressUtils';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'vacation' | 'gadget' | 'investment' | 'other';
}

interface Milestone {
  id: string;
  name: string;
  achievedOn: string;
  rewardType: 'badge' | 'voice' | 'both';
  description: string;
}

const PAGS: React.FC = () => {
  // Monthly Profit State
  const [totalProfit, setTotalProfit] = useState<number>(150000);
  const [isEditingProfit, setIsEditingProfit] = useState(false);
  const [tempProfit, setTempProfit] = useState(totalProfit);

  // Allocation State
  const [allocations, setAllocations] = useState({
    reinvest: 60,
    savings: 25,
    buffer: 15,
  });

  // Savings Configuration
  const [savingsConfig, setSavingsConfig] = useState({
    method: 'FD' as 'FD' | 'Mutual Fund' | 'Savings Account',
    lockPeriod: 12,
    autoRenew: true,
  });

  // Goals State
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Vacation Fund',
      targetAmount: 200000,
      currentAmount: 75000,
      deadline: '2024-12-31',
      category: 'vacation',
    },
    {
      id: '2',
      name: 'New Trading Setup',
      targetAmount: 150000,
      currentAmount: 45000,
      deadline: '2024-09-30',
      category: 'gadget',
    },
  ]);

  // Milestones State
  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      name: 'First ₹1L Saved',
      achievedOn: '2024-02-15',
      rewardType: 'badge',
      description: 'Consistent savings milestone achieved!',
    },
    {
      id: '2',
      name: '3 Months Discipline',
      achievedOn: '2024-03-01',
      rewardType: 'both',
      description: 'Maintained allocation discipline for 3 months',
    },
  ]);

  // Smart Auto Mode
  const [isSmartMode, setIsSmartMode] = useState(true);

  // Calculate derived values
  const calculatedAmounts = {
    reinvest: (totalProfit * allocations.reinvest) / 100,
    savings: (totalProfit * allocations.savings) / 100,
    buffer: (totalProfit * allocations.buffer) / 100,
  };

  // Handle profit edit
  const handleProfitSave = () => {
    setTotalProfit(tempProfit);
    setIsEditingProfit(false);
  };

  // Handle allocation changes
  const handleAllocationChange = (category: keyof typeof allocations, value: number) => {
    setAllocations(prev => {
      const newAllocations = { ...prev, [category]: value };
      const total = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
      
      // Normalize if total exceeds 100%
      if (total > 100) {
        const factor = 100 / total;
        Object.keys(newAllocations).forEach(key => {
          newAllocations[key as keyof typeof allocations] = Math.round(newAllocations[key as keyof typeof allocations] * factor);
        });
      }
      
      return newAllocations;
    });
  };

  return (
    <div className="p-6 space-y-8 bg-[#1a1a1a] min-h-screen text-white">
      <h1 className="phantom-title text-4xl mb-6">P.A.G.S – Neural Goal Strategy</h1>
      <p className="text-text-secondary mb-6">Profit Allocation and Goal Strategy for Intelligent Wealth Management</p>

      {/* Monthly Profit Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="phantom-card p-6 rounded-lg"
      >
        <h2 className="phantom-subtitle text-2xl mb-4">Monthly Profit Summary</h2>
        <div className="flex items-center justify-between">
          {isEditingProfit ? (
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={tempProfit}
                onChange={(e) => setTempProfit(Number(e.target.value))}
                className="phantom-input w-48"
                aria-label="Edit monthly profit"
              />
              <button onClick={handleProfitSave} className="phantom-button" aria-label="Save monthly profit">
                Save
              </button>
              <button onClick={() => setIsEditingProfit(false)} className="phantom-button bg-gray-600" aria-label="Cancel monthly profit edit">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#00f2ff]">₹{totalProfit.toLocaleString()}</span>
              <button onClick={() => setIsEditingProfit(true)} className="phantom-button" aria-label="Edit monthly profit">
                Edit
              </button>
            </div>
          )}
          <div className="text-sm text-gray-400">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </motion.div>

      {/* Allocation Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="phantom-card p-6 rounded-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="phantom-subtitle text-2xl">Profit Allocation</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isSmartMode}
                onChange={(e) => setIsSmartMode(e.target.checked)}
                className="phantom-checkbox"
                aria-label="Toggle smart auto mode"
              />
              <span>Smart Auto Mode</span>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          {/* Reinvestment Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[#f0b323]">Reinvestment</label>
              <span className="text-[#00f2ff]">₹{calculatedAmounts.reinvest.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={allocations.reinvest}
              onChange={(e) => handleAllocationChange('reinvest', Number(e.target.value))}
              className="phantom-slider"
              disabled={isSmartMode}
              aria-label="Reinvestment allocation slider"
            />
            <div className="text-right text-sm text-gray-400">{allocations.reinvest}%</div>
          </div>

          {/* Savings Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[#f0b323]">Auto-Savings</label>
              <span className="text-[#00f2ff]">₹{calculatedAmounts.savings.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={allocations.savings}
              onChange={(e) => handleAllocationChange('savings', Number(e.target.value))}
              className="phantom-slider"
              disabled={isSmartMode}
              aria-label="Auto-savings allocation slider"
            />
            <div className="text-right text-sm text-gray-400">{allocations.savings}%</div>
          </div>

          {/* Buffer Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[#f0b323]">Lifestyle Buffer</label>
              <span className="text-[#00f2ff]">₹{calculatedAmounts.buffer.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={allocations.buffer}
              onChange={(e) => handleAllocationChange('buffer', Number(e.target.value))}
              className="phantom-slider"
              disabled={isSmartMode}
              aria-label="Lifestyle buffer allocation slider"
            />
            <div className="text-right text-sm text-gray-400">{allocations.buffer}%</div>
          </div>
        </div>
      </motion.div>

      {/* Savings Configuration */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="phantom-card p-6 rounded-lg"
      >
        <h2 className="phantom-subtitle text-2xl mb-4">Savings Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[#f0b323] mb-2">Savings Method</label>
            <select
              value={savingsConfig.method}
              onChange={(e) => setSavingsConfig(prev => ({ ...prev, method: e.target.value as any }))}
              className="phantom-input w-full"
              aria-label="Savings method"
            >
              <option value="FD">Fixed Deposit</option>
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="Savings Account">Savings Account</option>
            </select>
          </div>
          <div>
            <label className="block text-[#f0b323] mb-2">Lock Period (months)</label>
            <input
              type="number"
              value={savingsConfig.lockPeriod}
              onChange={(e) => setSavingsConfig(prev => ({ ...prev, lockPeriod: Number(e.target.value) }))}
              className="phantom-input w-full"
              aria-label="Savings lock period"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={savingsConfig.autoRenew}
                onChange={(e) => setSavingsConfig(prev => ({ ...prev, autoRenew: e.target.checked }))}
                className="phantom-checkbox"
                aria-label="Auto-renew on maturity"
              />
              <span>Auto-renew on maturity</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Goals Tracker */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="phantom-card p-6 rounded-lg"
      >
        <h2 className="phantom-subtitle text-2xl mb-4">Custom Goals Tracker</h2>
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="p-4 border border-[#3a3a3a] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">{goal.name}</h3>
                <span className="text-sm text-gray-400">Target: ₹{goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 mb-2">
                <div className={`pags-slider ${getClosestProgressWidthClass((goal.currentAmount / goal.targetAmount) * 100)}`}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#00f2ff]">₹{goal.currentAmount.toLocaleString()}</span>
                <span className="text-gray-400">Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="phantom-card p-6 rounded-lg"
      >
        <h2 className="phantom-subtitle text-2xl mb-4">Achievement Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map(milestone => (
            <div key={milestone.id} className="p-4 border border-[#3a3a3a] rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.rewardType === 'badge' ? 'bg-[#00f2ff]' :
                  milestone.rewardType === 'voice' ? 'bg-[#f0b323]' :
                  'bg-gradient-to-r from-[#00f2ff] to-[#f0b323]'
                }`}>
                  {milestone.rewardType === 'badge' ? '🏆' :
                   milestone.rewardType === 'voice' ? '🎤' : '🌟'}
                </div>
                <h3 className="text-lg font-medium">{milestone.name}</h3>
              </div>
              <p className="text-gray-400 text-sm">{milestone.description}</p>
              <div className="text-sm text-[#00f2ff] mt-2">
                Achieved on {new Date(milestone.achievedOn).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PAGS; 