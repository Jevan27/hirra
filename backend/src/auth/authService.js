import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { prisma, isDatabaseConfigured } from '../config/prisma.js';
import { USER_ROLES } from './authTypes.js';

class AuthService {
  /**
   * Verify incoming Supabase JWT access token.
   * @param {string} token - Bearer JWT from Authorization header
   * @returns {Promise<{ supabaseUser: Object }>}
   */
  async verifySupabaseToken(token) {
    if (!isSupabaseConfigured()) {
      const error = new Error('Supabase authentication is not configured on the server. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
      error.statusCode = 503;
      error.code = 'AUTH_SERVICE_UNAVAILABLE';
      throw error;
    }

    if (!token || typeof token !== 'string') {
      const error = new Error('No authentication token provided');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      const authError = new Error(error?.message || 'Invalid or expired authentication token');
      authError.statusCode = 401;
      authError.code = 'INVALID_TOKEN';
      throw authError;
    }

    return { supabaseUser: user };
  }

  /**
   * Synchronize Supabase authenticated user with PostgreSQL Prisma User model.
   * Uses upsert to prevent duplicate records and ensure idempotency.
   * @param {Object} supabaseUser - Verified Supabase user object
   * @param {Object} [overrideFields] - Optional explicit fields (e.g. from registration)
   * @returns {Promise<Object>} The Prisma User record
   */
  async findOrCreateUser(supabaseUser, overrideFields = {}) {
    if (!supabaseUser || !supabaseUser.id) {
      throw new Error('Invalid Supabase user object');
    }

    const uid = supabaseUser.id;
    const email = (supabaseUser.email || overrideFields.email || '').toLowerCase().trim();
    const metadata = supabaseUser.user_metadata || {};

    const firstName = overrideFields.firstName ?? metadata.first_name ?? metadata.firstName ?? null;
    const middleName = overrideFields.middleName ?? metadata.middle_name ?? metadata.middleName ?? null;
    const lastName = overrideFields.lastName ?? metadata.last_name ?? metadata.lastName ?? null;
    const avatarUrl = overrideFields.avatarUrl ?? metadata.avatar_url ?? metadata.picture ?? null;
    
    // Validate role against enum
    let role = overrideFields.role ?? metadata.role ?? USER_ROLES.CANDIDATE;
    if (!Object.values(USER_ROLES).includes(role)) {
      role = USER_ROLES.CANDIDATE;
    }

    // If database connection is not yet configured, return safe fallback user shape
    if (!isDatabaseConfigured()) {
      return {
        uid,
        email,
        firstName,
        middleName,
        lastName,
        avatarUrl,
        role,
        isTransient: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    try {
      const user = await prisma.user.upsert({
        where: { uid },
        update: {
          email: email || undefined,
          firstName: firstName || undefined,
          middleName: middleName || undefined,
          lastName: lastName || undefined,
          avatarUrl: avatarUrl || undefined,
          lastLoginAt: new Date(),
        },
        create: {
          uid,
          email,
          firstName,
          middleName,
          lastName,
          avatarUrl,
          role,
          emailVerified: Boolean(supabaseUser.email_confirmed_at || supabaseUser.confirmed_at),
          lastLoginAt: new Date(),
        },
        include: {
          jobRole: true,
          skills: { include: { skill: true } },
          links: true,
          resumes: true
        }
      });

      return user;
    } catch (dbError) {
      console.error('[AuthService] Database sync error:', dbError.message);
      const error = new Error('Failed to synchronize user record with database');
      error.statusCode = 500;
      error.code = 'DATABASE_SYNC_ERROR';
      throw error;
    }
  }

  /**
   * Register a new user with email and password via Supabase Auth
   * and create corresponding Prisma User record.
   */
  async register({ email, password, firstName, middleName, lastName, role = USER_ROLES.CANDIDATE }) {
    if (!isSupabaseConfigured()) {
      const error = new Error('Supabase authentication is not configured on the server. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
      error.statusCode = 503;
      error.code = 'AUTH_SERVICE_UNAVAILABLE';
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const validatedRole = Object.values(USER_ROLES).includes(role) ? role : USER_ROLES.CANDIDATE;

    // Create user in Supabase Auth via Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true, // auto-confirm for immediate access
      user_metadata: {
        first_name: firstName || '',
        middle_name: middleName || '',
        last_name: lastName || '',
        role: validatedRole
      }
    });

    if (error) {
      const authError = new Error(error.message);
      authError.statusCode = error.status || 400;
      authError.code = 'REGISTRATION_FAILED';
      throw authError;
    }

    const supabaseUser = data.user;

    // Sync to PostgreSQL / Prisma
    const prismaUser = await this.findOrCreateUser(supabaseUser, {
      email: normalizedEmail,
      firstName,
      middleName,
      lastName,
      role: validatedRole
    });

    return {
      supabaseUser: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        createdAt: supabaseUser.created_at
      },
      prismaUser
    };
  }

  /**
   * Sign in existing user with email and password via Supabase Auth
   * and sync with Prisma User record.
   */
  async login({ email, password }) {
    if (!isSupabaseConfigured()) {
      const error = new Error('Supabase authentication is not configured on the server. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
      error.statusCode = 503;
      error.code = 'AUTH_SERVICE_UNAVAILABLE';
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      const authError = new Error(error.message || 'Invalid email or password');
      authError.statusCode = 401;
      authError.code = 'INVALID_CREDENTIALS';
      throw authError;
    }

    const { session, user: supabaseUser } = data;

    // Sync to PostgreSQL / Prisma
    const prismaUser = await this.findOrCreateUser(supabaseUser);

    return {
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
        expiresAt: session.expires_at,
        tokenType: session.token_type
      },
      user: {
        uid: supabaseUser.id,
        email: supabaseUser.email,
        prismaUser
      }
    };
  }

  /**
   * Refresh session tokens using Supabase refresh token.
   */
  async refreshToken(refreshToken) {
    if (!isSupabaseConfigured()) {
      const error = new Error('Supabase authentication is not configured on the server.');
      error.statusCode = 503;
      error.code = 'AUTH_SERVICE_UNAVAILABLE';
      throw error;
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error || !data.session) {
      const authError = new Error(error?.message || 'Failed to refresh authentication session');
      authError.statusCode = 401;
      authError.code = 'REFRESH_TOKEN_INVALID';
      throw authError;
    }

    const { session, user: supabaseUser } = data;
    const prismaUser = await this.findOrCreateUser(supabaseUser);

    return {
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
        expiresAt: session.expires_at,
        tokenType: session.token_type
      },
      user: {
        uid: supabaseUser.id,
        email: supabaseUser.email,
        prismaUser
      }
    };
  }
}

export const authService = new AuthService();
