import { authService } from '../auth/authService.js';

/**
 * Extract Bearer token from the Authorization header.
 * @param {import('express').Request} req
 * @returns {string|null}
 */
const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }
  const parts = authHeader.trim().split(' ');
  if (parts.length === 2 && /^bearer$/i.test(parts[0])) {
    return parts[1];
  }
  return null;
};

/**
 * Middleware: Enforce authentication on protected routes.
 * Validates Supabase JWT and attaches verified identity and Prisma User to `req.user`.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication token is required. Please include a valid Bearer token in the Authorization header.'
      });
    }

    // Verify token with Supabase
    const { supabaseUser } = await authService.verifySupabaseToken(token);

    // Sync with PostgreSQL / Prisma User model
    const prismaUser = await authService.findOrCreateUser(supabaseUser);

    // Attach contextual user info to request (Safe, no passwords/secrets)
    req.user = {
      supabaseUserId: supabaseUser.id,
      email: supabaseUser.email,
      role: prismaUser?.role || 'JOB_SEEKER',
      prismaUser,
      supabaseUser
    };

    next();
  } catch (err) {
    const statusCode = err.statusCode || 401;
    return res.status(statusCode).json({
      success: false,
      error: err.code || 'AUTHENTICATION_FAILED',
      message: err.message || 'Authentication failed'
    });
  }
};

/**
 * Middleware: Optional authentication.
 * Attaches user to `req.user` if a valid token is provided, but allows unauthenticated access if omitted.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      req.user = null;
      return next();
    }

    const { supabaseUser } = await authService.verifySupabaseToken(token);
    const prismaUser = await authService.findOrCreateUser(supabaseUser);

    req.user = {
      supabaseUserId: supabaseUser.id,
      email: supabaseUser.email,
      role: prismaUser?.role || 'JOB_SEEKER',
      prismaUser,
      supabaseUser
    };

    next();
  } catch (_err) {
    // For optional auth, continue as guest if token is invalid or service is down
    req.user = null;
    next();
  }
};

/**
 * Guard Middleware: Role-Based Access Control (RBAC).
 * Enforces that the authenticated user possesses at least one of the specified roles.
 * @param  {...string} allowedRoles - List of permitted roles (e.g. 'ADMIN', 'EMPLOYER')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required before role verification.'
      });
    }

    const userRole = req.user.role || req.user.prismaUser?.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
};
