import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Configuration & Middleware
 * 
 * Note on Distributed Architecture:
 * For multi-instance/distributed deployments, replace the default memory store with Redis
 * by providing `store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })`
 * from the `rate-limit-redis` package.
 */

// Helper to create standardized 429 handler with custom JSON shape and Retry-After
const createRateLimitHandler = (defaultMessage) => {
  return (req, res, next, options) => {
    const retryAfterSeconds = Math.ceil(options.windowMs / 1000);
    res.set('Retry-After', String(retryAfterSeconds));
    res.status(429).json({
      success: false,
      error: 'RATE_LIMITED',
      message: defaultMessage || 'Too many requests. Please try again shortly.',
      retryAfter: retryAfterSeconds
    });
  };
};

// Global API rate limiter (General defense)
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler('Too many requests from this IP, please try again in 15 minutes.')
});

// Job Search endpoint rate limiter (Configurable via env)
const searchWindowMs = parseInt(process.env.SEARCH_RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000; // 1 min
const searchMaxRequests = parseInt(process.env.SEARCH_RATE_LIMIT_MAX_REQUESTS, 10) || 30; // 30 req/min

export const searchRateLimiter = rateLimit({
  windowMs: searchWindowMs,
  max: searchMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler("You're searching a little too quickly. Please try again in a moment.")
});

// Location Autocomplete rate limiter (Strict protection for external geocoding calls)
const locationWindowMs = parseInt(process.env.LOCATION_RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000; // 1 min
const locationMaxRequests = parseInt(process.env.LOCATION_RATE_LIMIT_MAX_REQUESTS, 10) || 20; // 20 req/min

export const locationRateLimiter = rateLimit({
  windowMs: locationWindowMs,
  max: locationMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler("Too many location autocomplete requests. Please try again shortly.")
});
