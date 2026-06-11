// P.H.A.N.T.O.M - World's Best Profit-Generating Trading Platform
// Main Server File

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Redis from 'redis';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import tradingRoutes from './routes/trading.js';
import marketDataRoutes from './routes/marketData.js';
import portfolioRoutes from './routes/portfolio.js';
import aiRoutes from './routes/ai.js';
import brokerRoutes from './routes/brokers.js';
import analyticsRoutes from './routes/analytics.js';
// Advanced trading routes optional (requires TensorFlow native bindings)
// import advancedTradingRoutes from './routes/advancedTrading.js';
import walletRoutes from './routes/wallet.js';

// Import services
import { initializeMarketDataService } from './services/marketDataService.js';
import { initializeTradingEngine } from './services/tradingEngine.js';
import { initializeAIService } from './services/aiService.js';
import { initializeBrokerService } from './services/brokerService.js';
import { initializeWebSocketService } from './services/websocketService.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { rateLimiter } from './middleware/rateLimiter.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Environment variables
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phantom_trading';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://phantom-trading-platform.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow Vercel preview URLs
    }
  },
  credentials: true,
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'P.H.A.N.T.O.M Trading Platform is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/analytics', analyticsRoutes);
// app.use('/api/advanced-trading', advancedTradingRoutes);
app.use('/api/wallet', walletRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize services
async function seedAdminIfNeeded() {
  const User = (await import('./models/User.js')).default;
  const existing = await User.findOne({ email: 'admin@phantom.com' });
  if (existing) return;

  const adminUser = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@phantom.com',
    password: 'Honey@!2!6',
    phone: '9876543210',
    role: 'super_admin',
    wallet: { balance: 1000000, currency: 'INR' },
    isActive: true,
  });
  await adminUser.save();
  logger.info('✅ Seeded default paper-trading admin (admin@phantom.com)');
}

async function initializeServices() {
  try {
    if (process.env.USE_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      MONGODB_URI = mongod.getUri('phantom_trading');
      logger.info('✅ Using in-memory MongoDB for paper trading');
    }

    await mongoose.connect(MONGODB_URI);
    logger.info('✅ Connected to MongoDB');
    await seedAdminIfNeeded();

    let redisClient = null;
    try {
      redisClient = Redis.createClient({ url: REDIS_URL });
      await redisClient.connect();
      logger.info('✅ Connected to Redis');
    } catch (redisError) {
      logger.warn('⚠️ Redis unavailable — continuing without cache:', redisError.message);
    }

    // Initialize trading services
    if (redisClient) {
      await initializeMarketDataService(redisClient);
      await initializeTradingEngine(redisClient);
      await initializeWebSocketService(io, redisClient);
    }
    await initializeAIService();
    await initializeBrokerService();

    logger.info('✅ All services initialized successfully');

  } catch (error) {
    logger.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await initializeServices();
    
    server.listen(PORT, () => {
      logger.info(`🚀 P.H.A.N.T.O.M Trading Platform running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      logger.info(`💰 Ready to generate profits! 💰`);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Start the server
startServer();

export { app, io }; 