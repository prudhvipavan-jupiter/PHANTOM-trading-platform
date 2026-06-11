import React, { useState } from 'react';
import { getClosestProgressWidthClass } from '../../utils/progressUtils';

interface AchievementBadgeProps {
  name: string;
  achieved: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ name, achieved }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${achieved ? 'bg-success-main text-black' : 'bg-gray-700 text-text-secondary'}`}>
    {name}
  </div>
);

const MonthlyTarget: React.FC = () => {
  const [targetAmount, setTargetAmount] = useState(50000);
  const [achievedAmount, setAchievedAmount] = useState(35000);
  const [goals] = useState([
    { id: 1, name: 'Hit 25% Monthly P&L', achieved: true },
    { id: 2, name: 'Trade 20 days', achieved: true },
    { id: 3, name: 'Zero Loss Day', achieved: false },
    { id: 4, name: 'High Volume Trade', achieved: false },
  ]);

  const progress = (achievedAmount / targetAmount) * 100;
  const progressClass = getClosestProgressWidthClass(progress);

  return (
    <div className="min-h-screen bg-background-default text-text-primary p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-main">Monthly Target Tracker</h1>

      <div className="phantom-card mb-6">
        <h2 className="text-2xl font-semibold mb-4">Current Month's Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <p className="text-text-secondary">Target Amount</p>
            <p className="text-3xl font-bold text-success-main">₹ {targetAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-text-secondary">Achieved Amount</p>
            <p className="text-3xl font-bold text-info-main">₹ {achievedAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-text-secondary mb-2">Progress Bar</p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className={`target-progress ${progressClass}`}
            ></div>
          </div>
          <p className="text-sm text-text-secondary mt-2 text-right">{progress.toFixed(2)}% Achieved</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Achievement Badges</h3>
          <div className="flex flex-wrap gap-3">
            {goals.map((goal) => (
              <AchievementBadge key={goal.id} name={goal.name} achieved={goal.achieved} />
            ))}
          </div>
        </div>
      </div>

      <div className="phantom-card">
        <h2 className="text-2xl font-semibold mb-4">Set Your Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="targetAmount" className="block text-text-secondary text-sm font-medium mb-1">Set Target Amount</label>
            <input
              type="number"
              id="targetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="phantom-input"
            />
          </div>
          <div>
            <label htmlFor="achievedAmount" className="block text-text-secondary text-sm font-medium mb-1">Update Achieved Amount</label>
            <input
              type="number"
              id="achievedAmount"
              value={achievedAmount}
              onChange={(e) => setAchievedAmount(Number(e.target.value))}
              className="phantom-input"
            />
          </div>
        </div>
        <button onClick={() => alert('Goals Updated!')} className="phantom-button">
          Update Goals
        </button>
      </div>
    </div>
  );
};

export default MonthlyTarget; 