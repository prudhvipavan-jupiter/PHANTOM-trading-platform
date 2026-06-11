// P.H.A.N.T.O.M Trading Platform Logger
// Comprehensive logging system for profit tracking and debugging

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // File transport for trading activities
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/trading.log'),
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // File transport for profit tracking
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/profits.log'),
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Specialized loggers for different purposes
export const tradingLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/trading.log')
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export const profitLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/profits.log')
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Helper functions for specific logging
export const logTrade = (tradeData) => {
  tradingLogger.info('TRADE_EXECUTED', {
    ...tradeData,
    timestamp: new Date().toISOString()
  });
};

export const logProfit = (profitData) => {
  profitLogger.info('PROFIT_GENERATED', {
    ...profitData,
    timestamp: new Date().toISOString()
  });
};

export const logError = (error, context = '') => {
  logger.error(`ERROR${context ? ` [${context}]` : ''}: ${error.message}`, {
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

export const logMarketData = (marketData) => {
  tradingLogger.info('MARKET_DATA_UPDATE', {
    ...marketData,
    timestamp: new Date().toISOString()
  });
};

export const logAIPrediction = (predictionData) => {
  tradingLogger.info('AI_PREDICTION', {
    ...predictionData,
    timestamp: new Date().toISOString()
  });
};

export default logger; 