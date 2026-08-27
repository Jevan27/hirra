/**
 * Hirra Auth Types & Role Constants
 */

export const USER_ROLES = Object.freeze({
  CANDIDATE: 'CANDIDATE',
  JOB_SEEKER: 'CANDIDATE', // Backward-compatibility alias
  EMPLOYER: 'EMPLOYER',
  ADMIN: 'ADMIN'
});

/**
 * @typedef {'CANDIDATE' | 'EMPLOYER' | 'ADMIN'} UserRole
 */

/**
 * @typedef {Object} AuthenticatedUser
 * @property {string} uid - Supabase Auth UID (UUID)
 * @property {string} email - Authenticated user email
 * @property {UserRole} role - Application role from PostgreSQL/Prisma
 * @property {Object|null} prismaUser - Full application user profile from PostgreSQL
 * @property {Object} [supabaseUser] - Raw Supabase identity object
 */
