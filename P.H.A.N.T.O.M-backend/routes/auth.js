// P.H.A.N.T.O.M Trading Platform Authentication Routes
// Secure authentication for profit-generating trading platform

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { logger, logError } from '../utils/logger.js';

const router = express.Router();

// Register new user
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, tradingProfile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      tradingProfile: tradingProfile || {
        experience: 'beginner',
        riskTolerance: 'moderate',
        preferredMarkets: ['indian_stocks'],
        tradingStyle: 'swing_trading'
      },
      role: 'user',
      permissions: [
        'read_portfolio',
        'write_portfolio',
        'execute_trades',
        'view_analytics',
        'ai_predictions',
        'advanced_charts',
        'real_time_data'
      ],
      wallet: {
        balance: 100000, // Starting with 1 lakh INR
        currency: 'INR'
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });

  } catch (error) {
    logError(error, 'AUTH_REGISTER');
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login user
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        error: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });

  } catch (error) {
    logError(error, 'AUTH_LOGIN');
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    logError(error, 'AUTH_REFRESH');
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    logError(error, 'AUTH_PROFILE');
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'tradingProfile',
      'preferences', 'socialTrading'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update user
    Object.assign(user, updates);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    logError(error, 'AUTH_UPDATE_PROFILE');
    res.status(500).json({
      success: false,
      error: 'Profile update failed'
    });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logError(error, 'AUTH_CHANGE_PASSWORD');
    res.status(500).json({
      success: false,
      error: 'Password change failed'
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logError(error, 'AUTH_LOGOUT');
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

// Forgot password
router.post('/forgot-password', authRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store reset token in user document
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // In a real application, send email with reset link
    // For now, just log the token
    logger.info(`Password reset token for ${email}: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    logError(error, 'AUTH_FORGOT_PASSWORD');
    res.status(500).json({
      success: false,
      error: 'Password reset request failed'
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with reset token
    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    logError(error, 'AUTH_RESET_PASSWORD');
    res.status(500).json({
      success: false,
      error: 'Password reset failed'
    });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with verification token
    const user = await User.findOne({
      _id: decoded.userId,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    logError(error, 'AUTH_VERIFY_EMAIL');
    res.status(500).json({
      success: false,
      error: 'Email verification failed'
    });
  }
});

// Resend verification email
router.post('/resend-verification', authRateLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store verification token
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 86400000); // 24 hours
    await user.save();

    // In a real application, send email with verification link
    // For now, just log the token
    logger.info(`Email verification token for ${email}: ${verificationToken}`);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    logError(error, 'AUTH_RESEND_VERIFICATION');
    res.status(500).json({
      success: false,
      error: 'Failed to send verification email'
    });
  }
});

export default router; 