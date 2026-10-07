import { registerUser, loginUser, getCurrentUserProfile } from '../services/authService.js';
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
