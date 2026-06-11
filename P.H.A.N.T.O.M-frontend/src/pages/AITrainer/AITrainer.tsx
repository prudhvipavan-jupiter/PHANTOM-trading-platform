import React, { useState } from 'react';
// Removed unused component imports
import { getClosestProgressWidthClass } from '../../utils/progressUtils';

interface StatusBadgeProps {
  status: 'idle' | 'training' | 'completed' | 'error';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass = '';
  let text = '';
  switch (status) {
    case 'idle':
      colorClass = 'bg-gray-700';
      text = 'Idle';
      break;
    case 'training':
      colorClass = 'bg-info-main animate-pulse';
      text = 'Training...';
      break;
    case 'completed':
      colorClass = 'bg-success-main';
      text = 'Completed';
      break;
    case 'error':
      colorClass = 'bg-error-main';
      text = 'Error';
      break;
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {text}
    </span>
  );
};

const AITrainer: React.FC = () => {
  const [dataset, setDataset] = useState('Historical Stock Data (NSE)');
  const [trainingMode, setTrainingMode] = useState('Supervised Learning');
  const [modelAccuracy, setModelAccuracy] = useState(0.85);
  const [learningLogs, setLearningLogs] = useState<string[]>([
    '[09:00:00] Starting training session...',
    '[09:01:23] Epoch 1/10 - Loss: 0.05, Accuracy: 0.78',
    '[09:03:45] Epoch 2/10 - Loss: 0.04, Accuracy: 0.82',
    '[09:06:10] Epoch 3/10 - Loss: 0.03, Accuracy: 0.85',
  ]);
  const [strategyVersion, setStrategyVersion] = useState('1.0.0');
  const [status, setStatus] = useState<'idle' | 'training' | 'completed' | 'error'>('idle');

  const datasets = [
    'Historical Stock Data (NSE)',
    'Real-time Market Data',
    'Commodity Data',
    'Forex Data',
  ];

  const trainingModes = [
    'Supervised Learning',
    'Reinforcement Learning',
    'Unsupervised Learning',
  ];

  const handleTrainNow = () => {
    setStatus('training');
    setLearningLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Training initiated for ${strategyVersion}...`]);
    // Simulate training process
    setTimeout(() => {
      const newAccuracy = (Math.random() * 0.1 + 0.8).toFixed(2);
      const newStatus: 'completed' | 'error' = Math.random() > 0.1 ? 'completed' : 'error';
      setStatus(newStatus);
      setModelAccuracy(parseFloat(newAccuracy));
      setLearningLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Training ${newStatus}. Final Accuracy: ${newAccuracy}`]);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background-default text-text-primary p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-main">C.O.G.N.I.T.A – Neural Training Engine</h1>
      <p className="text-text-secondary mb-6">AI Training and Optimization Engine for Advanced Neural Networks</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Configuration Panel */}
        <div className="phantom-card col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Training Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="dataset" className="block text-text-secondary text-sm font-medium mb-1">Dataset Selector</label>
              <select
                id="dataset"
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="phantom-input w-full"
              >
                {datasets.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="trainingMode" className="block text-text-secondary text-sm font-medium mb-1">Training Mode</label>
              <select
                id="trainingMode"
                value={trainingMode}
                onChange={(e) => setTrainingMode(e.target.value)}
                className="phantom-input w-full"
              >
                {trainingModes.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="strategyVersion" className="block text-text-secondary text-sm font-medium mb-1">Strategy Version</label>
              <input
                id="strategyVersion"
                type="text"
                value={strategyVersion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStrategyVersion(e.target.value)}
                className="phantom-input w-full"
              />
            </div>
          </div>
          <button 
            onClick={handleTrainNow}
            className="phantom-button"
          >
            {status === 'training' ? 'Training Model...' : 'Train Now'}
          </button>
        </div>

        {/* Model Status / Accuracy */}
        <div className="phantom-card flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4">Model Status</h2>
          <StatusBadge status={status} />
          <div className="mt-4 text-center">
            <p className="text-text-secondary">Current Accuracy</p>
            <p className="text-5xl font-bold text-primary-main">{(modelAccuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
            <div
              className={`trainer-progress ${getClosestProgressWidthClass(modelAccuracy * 100)}`}
            ></div>
          </div>
        </div>
      </div>

      {/* Learning Logs */}
      <div className="phantom-card">
        <h2 className="text-2xl font-semibold mb-4">Learning Logs</h2>
        <div className="bg-background-paper p-4 rounded-lg h-64 overflow-y-auto custom-scrollbar text-sm text-text-secondary">
          {learningLogs.map((log, index) => (
            <p key={index} className="mb-1">{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AITrainer; 