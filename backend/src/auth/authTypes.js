/**
 * Hirra Auth Types & Role Constants
 */

export const USER_ROLES = Object.freeze({
  JOB_SEEKER: 'JOB_SEEKER',
  EMPLOYER: 'EMPLOYER',
  ADMIN: 'ADMIN'
});

/**
 * @typedef {'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN'} UserRole
 */

/**
 * @typedef {Object} AuthenticatedUser
 * @property {string} supabaseUserId - Supabase Auth UID (UUID)
 * @property {string} email - Authenticated user email
 * @property {UserRole} role - Application role from PostgreSQL/Prisma
 * @property {Object|null} prismaUser - Full application user profile from PostgreSQL
 * @property {Object} [supabaseUser] - Raw Supabase identity object
 */
