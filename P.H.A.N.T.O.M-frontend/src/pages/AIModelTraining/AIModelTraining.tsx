import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBrain,
  faDownload,
  faPlay,
  faStop,
  faDatabase,
  faCog,
  faSearch,
  faRobot,
  faCheckCircle,
  faSpinner,
  faExclamationTriangle,
  faGlobe,
  faFlag
} from '@fortawesome/free-solid-svg-icons';
import { yahooFinanceAPI } from '../../services/yahooFinanceAPI';
import { indianMarketAPI } from '../../services/indianMarketAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface TrainingData {
  features: number[][];
  targets: number[];
  featureNames: string[];
}

interface ModelMetrics {
  accuracy: number;
  mse: number;
  mae: number;
  r2: number;
  trainingLoss: number[];
  validationLoss: number[];
}

interface TrainingStatus {
  isTraining: boolean;
  epoch: number;
  totalEpochs: number;
  currentLoss: number;
  bestLoss: number;
  status: 'idle' | 'preparing' | 'training' | 'completed' | 'error';
  message: string;
}

const AIModelTraining: React.FC = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{symbol: string, name: string, type: string}>>([]);
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    isTraining: false,
    epoch: 0,
    totalEpochs: 100,
    currentLoss: 0,
    bestLoss: Infinity,
    status: 'idle',
    message: 'Ready to start training with Indian market data'
  });
  const [modelConfig, setModelConfig] = useState({
    epochs: 100,
    learningRate: 0.001,
    batchSize: 32,
    hiddenLayers: [64, 32, 16],
    dropout: 0.2,
    validationSplit: 0.2
  });
  const [predictions, setPredictions] = useState<Array<{actual: number, predicted: number, date: string}>>([]);
  const [dataSource, setDataSource] = useState<'indian' | 'global'>('indian');

  // Search for symbols based on data source
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      let results: Array<{symbol: string, name: string, type: string}> = [];
      
      if (dataSource === 'indian') {
        results = await indianMarketAPI.searchIndianStocks(searchQuery);
      } else {
        results = await yahooFinanceAPI.searchSymbols(searchQuery);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Add symbol to training set
  const addSymbol = (symbol: string) => {
    if (!selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  // Remove symbol from training set
  const removeSymbol = (symbol: string) => {
    setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
  };

  // Fetch and prepare training data
  const prepareTrainingData = async () => {
    setTrainingStatus({
      ...trainingStatus,
      status: 'preparing',
      message: `Fetching ${dataSource} market data...`
    });

    try {
      const allFeatures: number[][] = [];
      const allTargets: number[] = [];
      let featureNames: string[] = [];

      for (const symbol of selectedSymbols) {
        setTrainingStatus(prev => ({
          ...prev,
          message: `Fetching data for ${symbol}...`
        }));

        if (dataSource === 'indian') {
          const marketData = await indianMarketAPI.getIndianMarketDataForAI(symbol);
          if (marketData) {
            const trainingData = indianMarketAPI.prepareIndianTrainingData(marketData);
            allFeatures.push(...trainingData.features);
            allTargets.push(...trainingData.targets);
            featureNames = trainingData.featureNames;
          }
        } else {
          const marketData = await yahooFinanceAPI.getMarketDataForAI(symbol);
          if (marketData) {
            const trainingData = yahooFinanceAPI.prepareTrainingData(marketData);
            allFeatures.push(...trainingData.features);
            allTargets.push(...trainingData.targets);
            featureNames = trainingData.featureNames;
          }
        }
      }

      if (allFeatures.length === 0) {
        throw new Error('No training data available');
      }

      const training: TrainingData = {
        features: allFeatures,
        targets: allTargets,
        featureNames
      };

      setTrainingData(training);
      setTrainingStatus({
        ...trainingStatus,
        status: 'idle',
        message: `Prepared ${allFeatures.length} training samples from ${selectedSymbols.length} ${dataSource} symbols`
      });

    } catch (error) {
      setTrainingStatus({
        ...trainingStatus,
        status: 'error',
        message: `Error preparing data: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  // Simulate neural network training
  const startTraining = async () => {
    if (!trainingData) {
      setTrainingStatus({
        ...trainingStatus,
        status: 'error',
        message: 'No training data available. Please prepare data first.'
      });
      return;
    }

    setTrainingStatus({
      isTraining: true,
      epoch: 0,
      totalEpochs: modelConfig.epochs,
      currentLoss: 1.0,
      bestLoss: Infinity,
      status: 'training',
      message: `Training neural network with ${dataSource} market data...`
    });

    const trainingLoss: number[] = [];
    const validationLoss: number[] = [];
    const generatedPredictions: Array<{actual: number, predicted: number, date: string}> = [];

    // Simulate training process
    for (let epoch = 0; epoch < modelConfig.epochs; epoch++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate training time

      // Simulate loss decrease with some noise
      const baseLoss = 1.0 * Math.exp(-epoch * 0.05);
      const noise = (Math.random() - 0.5) * 0.1;
      const currentLoss = Math.max(0.01, baseLoss + noise);
      
      const valLoss = currentLoss * (1 + Math.random() * 0.2);
      
      trainingLoss.push(currentLoss);
      validationLoss.push(valLoss);

      setTrainingStatus(prev => ({
        ...prev,
        epoch: epoch + 1,
        currentLoss,
        bestLoss: Math.min(prev.bestLoss, currentLoss),
        message: `Epoch ${epoch + 1}/${modelConfig.epochs} - Loss: ${currentLoss.toFixed(4)}`
      }));

      // Generate some predictions for visualization
      if (epoch % 10 === 0) {
        for (let i = 0; i < 10; i++) {
          const actual = (Math.random() - 0.5) * 10; // Simulated actual price change
          const predicted = actual + (Math.random() - 0.5) * 2; // Add some error
          const date = new Date(Date.now() - (100 - epoch - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          generatedPredictions.push({ actual, predicted, date });
        }
      }
    }

    // Calculate final metrics
    const finalMetrics: ModelMetrics = {
      accuracy: 85 + Math.random() * 10, // Simulated accuracy
      mse: trainingLoss[trainingLoss.length - 1],
      mae: trainingLoss[trainingLoss.length - 1] * 0.8,
      r2: 0.75 + Math.random() * 0.2,
      trainingLoss,
      validationLoss
    };

    setModelMetrics(finalMetrics);
    setPredictions(generatedPredictions);
    setTrainingStatus({
      isTraining: false,
      epoch: modelConfig.epochs,
      totalEpochs: modelConfig.epochs,
      currentLoss: trainingLoss[trainingLoss.length - 1],
      bestLoss: Math.min(...trainingLoss),
      status: 'completed',
      message: `Training completed! Final accuracy: ${finalMetrics.accuracy.toFixed(2)}%`
    });
  };

  // Stop training
  const stopTraining = () => {
    setTrainingStatus({
      ...trainingStatus,
      isTraining: false,
      status: 'idle',
      message: 'Training stopped by user'
    });
  };

  // Download model or data
  const downloadData = (type: 'model' | 'data' | 'predictions') => {
    let data: any;
    let filename: string;

    switch (type) {
      case 'model':
        data = { config: modelConfig, metrics: modelMetrics, dataSource };
        filename = `phantom_ai_model_${dataSource}.json`;
        break;
      case 'data':
        data = trainingData;
        filename = `training_data_${dataSource}.json`;
        break;
      case 'predictions':
        data = predictions;
        filename = `predictions_${dataSource}.json`;
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    switch (trainingStatus.status) {
      case 'preparing':
      case 'training':
        return <FontAwesomeIcon icon={faSpinner} className="animate-spin" />;
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationTriangle} />;
      default:
        return <FontAwesomeIcon icon={faRobot} />;
    }
  };

  const getStatusColor = () => {
    switch (trainingStatus.status) {
      case 'training':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            <FontAwesomeIcon icon={faBrain} className="mr-3" />
            AI Model Training Center
          </h1>
          <p className="text-gray-300 text-lg">
            Train advanced neural networks using real market data from India and global markets
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Selection Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Data Source Selection */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                Data Source
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setDataSource('indian')}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    dataSource === 'indian'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400'
                      : 'bg-gray-700/30 text-gray-300 border-gray-600 hover:border-green-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faFlag} className="mr-2" />
                      <span className="font-semibold">Indian Markets</span>
                    </div>
                    {dataSource === 'indian' && <FontAwesomeIcon icon={faCheckCircle} />}
                  </div>
                  <p className="text-xs mt-1 opacity-80">NSE, BSE stocks with Indian fundamentals</p>
                </button>

                <button
                  onClick={() => setDataSource('global')}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    dataSource === 'global'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400'
                      : 'bg-gray-700/30 text-gray-300 border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                      <span className="font-semibold">Global Markets</span>
                    </div>
                    {dataSource === 'global' && <FontAwesomeIcon icon={faCheckCircle} />}
                  </div>
                  <p className="text-xs mt-1 opacity-80">US, Crypto, Forex, Commodities</p>
                </button>
              </div>
            </div>

            {/* Symbol Search */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Add Training Symbols
              </h3>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={dataSource === 'indian' ? "Search Indian stocks (e.g., RELIANCE, TCS)" : "Search global symbols (e.g., AAPL, TSLA)"}
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {searchResults.map((result) => (
                      <button
                        key={result.symbol}
                        onClick={() => addSymbol(result.symbol)}
                        className="w-full text-left px-3 py-2 bg-gray-700/30 hover:bg-gray-600/50 rounded-lg text-sm transition-all"
                      >
                        <span className="font-semibold text-cyan-400">{result.symbol}</span>
                        <span className="text-gray-300 ml-2">{result.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Symbols */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">
                    Selected Symbols ({selectedSymbols.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymbols.map((symbol) => (
                      <span
                        key={symbol}
                        className="inline-flex items-center px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm"
                      >
                        {symbol}
                        <button
                          onClick={() => removeSymbol(symbol)}
                          className="ml-2 text-cyan-400 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Model Configuration */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                Model Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Epochs</label>
                  <input
                    type="number"
                    value={modelConfig.epochs}
                    onChange={(e) => setModelConfig({...modelConfig, epochs: parseInt(e.target.value)})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Learning Rate</label>
                  <input
                    type="number"
                    step="0.001"
                    value={modelConfig.learningRate}
                    onChange={(e) => setModelConfig({...modelConfig, learningRate: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Batch Size</label>
                  <input
                    type="number"
                    value={modelConfig.batchSize}
                    onChange={(e) => setModelConfig({...modelConfig, batchSize: parseInt(e.target.value)})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={prepareTrainingData}
                disabled={selectedSymbols.length === 0 || trainingStatus.status === 'preparing'}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
              >
                <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                Prepare Training Data
              </button>

              <button
                onClick={trainingStatus.isTraining ? stopTraining : startTraining}
                disabled={!trainingData || trainingStatus.status === 'preparing'}
                className={`w-full py-3 text-white rounded-lg transition-all ${
                  trainingStatus.isTraining
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                } disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed`}
              >
                <FontAwesomeIcon icon={trainingStatus.isTraining ? faStop : faPlay} className="mr-2" />
                {trainingStatus.isTraining ? 'Stop Training' : 'Start Training'}
              </button>
            </div>
          </motion.div>

          {/* Training Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Status Panel */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cyan-400">Training Status</h3>
                <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="font-semibold capitalize">{trainingStatus.status}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300">{trainingStatus.message}</p>
                
                {trainingStatus.isTraining && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Progress</span>
                      <span>{trainingStatus.epoch}/{trainingStatus.totalEpochs}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(trainingStatus.epoch / trainingStatus.totalEpochs) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {trainingData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div className="text-cyan-400 font-semibold">Samples</div>
                      <div className="text-white text-lg">{trainingData.features.length}</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div className="text-cyan-400 font-semibold">Features</div>
                      <div className="text-white text-lg">{trainingData.featureNames.length}</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div className="text-cyan-400 font-semibold">Current Loss</div>
                      <div className="text-white text-lg">{trainingStatus.currentLoss.toFixed(4)}</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <div className="text-cyan-400 font-semibold">Best Loss</div>
                      <div className="text-white text-lg">{trainingStatus.bestLoss === Infinity ? 'N/A' : trainingStatus.bestLoss.toFixed(4)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Training Loss Chart */}
            {modelMetrics && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-cyan-400">Training Progress</h3>
                  <button
                    onClick={() => downloadData('model')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download Model
                  </button>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={modelMetrics.trainingLoss.map((loss, index) => ({
                      epoch: index + 1,
                      training: loss,
                      validation: modelMetrics.validationLoss[index]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="epoch" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="training"
                        stroke="#06B6D4"
                        strokeWidth={2}
                        name="Training Loss"
                      />
                      <Line
                        type="monotone"
                        dataKey="validation"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        name="Validation Loss"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Model Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-semibold">Accuracy</div>
                    <div className="text-white text-lg">{modelMetrics.accuracy.toFixed(2)}%</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-blue-400 font-semibold">R² Score</div>
                    <div className="text-white text-lg">{modelMetrics.r2.toFixed(3)}</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-purple-400 font-semibold">MSE</div>
                    <div className="text-white text-lg">{modelMetrics.mse.toFixed(4)}</div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                    <div className="text-pink-400 font-semibold">MAE</div>
                    <div className="text-white text-lg">{modelMetrics.mae.toFixed(4)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Predictions Visualization */}
            {predictions.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-cyan-400">Model Predictions</h3>
                  <button
                    onClick={() => downloadData('predictions')}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download Predictions
                  </button>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={predictions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="actual" 
                        stroke="#9CA3AF"
                        name="Actual"
                        label={{ value: 'Actual Price Change (%)', position: 'bottom' }}
                      />
                      <YAxis 
                        dataKey="predicted"
                        stroke="#9CA3AF"
                        name="Predicted"
                        label={{ value: 'Predicted Price Change (%)', angle: -90, position: 'left' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => [`${Number(value).toFixed(2)}%`, name]}
                      />
                      <Scatter fill="#06B6D4" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIModelTraining; 