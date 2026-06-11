// P.H.A.N.T.O.M Trading Platform Database Configuration
// MongoDB and Redis configuration for profit tracking

import mongoose from 'mongoose';
import Redis from 'redis';
import { logger } from '../utils/logger.js';

let redisClient = null;

export const connectDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/phantom_trading';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ MongoDB connected successfully');

    // Connect to Redis
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = Redis.createClient({
      url: redisUrl
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    await redisClient.connect();

    return { mongoose, redis: redisClient };
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('✅ MongoDB disconnected');
    }

    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      logger.info('✅ Redis disconnected');
    }
  } catch (error) {
    logger.error('❌ Database disconnection error:', error);
  }
};

export const getRedisClient = () => redisClient; 