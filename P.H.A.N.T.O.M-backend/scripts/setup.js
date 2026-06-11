// P.H.A.N.T.O.M Trading Platform Setup Script
// Initialize default admin user and basic configuration

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/phantom_trading';

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@phantom.com' });
    
    if (existingAdmin) {
      logger.info('✅ Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@phantom.com',
      password: 'Honey@!2!6',
      phone: '9876543210',
      role: 'super_admin',
      permissions: [
        'read_portfolio', 'write_portfolio', 'execute_trades', 'view_analytics',
        'social_trading', 'copy_trading', 'admin_users', 'admin_trading',
        'admin_analytics', 'admin_system', 'ai_predictions', 'advanced_charts',
        'real_time_data', 'options_trading', 'futures_trading', 'forex_trading'
      ],
      tradingProfile: {
        experience: 'expert',
        riskTolerance: 'aggressive',
        preferredMarkets: ['indian_stocks', 'us_stocks', 'forex', 'crypto', 'commodities', 'options', 'futures'],
        tradingStyle: 'day_trading'
      },
      wallet: {
        balance: 1000000, // 10 lakh INR starting balance
        currency: 'INR'
      },
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true,
          profitAlerts: true,
          lossAlerts: true,
          marketAlerts: true
        },
        theme: 'dark',
        language: 'en',
        timezone: 'Asia/Kolkata'
      }
    });

    await adminUser.save();
    logger.info('✅ Default admin user created successfully');
    logger.info('📧 Email: admin@phantom.com');
    logger.info('🔑 Password: Honey@!2!6');

    // Create additional demo users for testing
    const demoUsers = [
      {
        firstName: 'Demo',
        lastName: 'Trader',
        email: 'demo@phantom.com',
        password: 'Demo@123',
        role: 'trader',
        wallet: { balance: 500000, currency: 'INR' }
      },
      {
        firstName: 'Premium',
        lastName: 'User',
        email: 'premium@phantom.com',
        password: 'Premium@123',
        role: 'premium',
        wallet: { balance: 250000, currency: 'INR' }
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User({
          ...userData,
          phone: '9876543210',
          permissions: [
            'read_portfolio', 'write_portfolio', 'execute_trades', 'view_analytics',
            'ai_predictions', 'advanced_charts', 'real_time_data'
          ],
          tradingProfile: {
            experience: 'intermediate',
            riskTolerance: 'moderate',
            preferredMarkets: ['indian_stocks', 'us_stocks'],
            tradingStyle: 'swing_trading'
          },
          isEmailVerified: true,
          isPhoneVerified: true,
          isActive: true
        });
        await user.save();
        logger.info(`✅ Demo user created: ${userData.email} (Password: ${userData.password})`);
      }
    }

    logger.info('🎉 P.H.A.N.T.O.M Trading Platform setup completed successfully!');
    logger.info('💰 Ready to generate profits! 💰');

  } catch (error) {
    logger.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('📊 Database connection closed');
  }
}

// Run setup
setupDatabase(); 