import {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  googleAuthUser,
  createPasswordResetToken,
  resetUserPassword,
} from '../services/authService.js';
import { validateRegisterInput, validateLoginInput } from '../validators/authValidator.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const register = async (req, res, next) => {
  try {
    const validationError = validateRegisterInput(req.body);
    if (validationError) {
      return sendError(res, validationError, 400);
    }

    const { name, email, password } = req.body;
    const result = await registerUser({ name, email, password });

    return sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) {
      return sendError(res, validationError, 400);
    }

    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    return sendSuccess(res, result, 'Login successful', 200);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  // In JWT stateless auth, logout is handled on client by clearing the token.
  return sendSuccess(res, null, 'Logged out successfully', 200);
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUserProfile(req.user.id);
    return sendSuccess(res, { user }, 'User profile retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, profile_image } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, 'A valid Google email address is required.', 400);
    }

    const result = await googleAuthUser({ email, name, profile_image });
    return sendSuccess(res, result, 'Google authentication successful', 200);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, 'Please provide a valid email address.', 400);
    }

    const result = await createPasswordResetToken({ email });
    return sendSuccess(res, result, 'Account verified for password reset', 200);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword, viaGoogle } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, 'A valid email address is required.', 400);
    }
    if (!newPassword || newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long.', 400);
    }

    const result = await resetUserPassword({ email, resetToken, newPassword, viaGoogle });
    return sendSuccess(res, result, 'Password has been reset successfully', 200);
  } catch (error) {
    next(error);
  }
};
