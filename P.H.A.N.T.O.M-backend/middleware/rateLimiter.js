// P.H.A.N.T.O.M Trading Platform Rate Limiter
// Protect against abuse and ensure fair usage

import rateLimit from 'express-rate-limit';

// General API rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Trading specific rate limiter (more restrictive)
export const tradingRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 trading requests per minute
  message: {
    success: false,
    error: 'Too many trading requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI prediction rate limiter
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 AI predictions per minute
  message: {
    success: false,
    error: 'Too many AI prediction requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 