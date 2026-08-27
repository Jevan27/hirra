import { authService } from '../auth/authService.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, middleName, lastName, role } = req.body;
    const result = await authService.register({
      email,
      password,
      firstName,
      middleName,
      lastName,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.json({
      success: true,
      message: 'Authentication successful',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is populated by requireAuth middleware
    res.json({
      success: true,
      data: {
        uid: req.user.uid,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.prismaUser
      }
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      message: 'Session refreshed successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (_req, res, _next) => {
  // Supabase sessions are stateless JWTs on backend; return success
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
