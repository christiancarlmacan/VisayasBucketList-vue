import {
  getUserProfile,
  updateUserProfile,
  getAllUsersAdmin,
  updateUserRoleAdmin,
  deleteUserAdmin,
} from '../services/userService.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await getUserProfile(userId);
    return sendSuccess(res, { profile }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, profile_image } = req.body;

    if (name && name.trim().length < 2) {
      return sendError(res, 'Name must be at least 2 characters long.', 400);
    }

    const updatedUser = await updateUserProfile(userId, { name, profile_image });
    return sendSuccess(res, { user: updatedUser }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const listUsersAdmin = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await getAllUsersAdmin({ page, limit, search });
    return sendSuccess(res, result, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const changeUserRoleAdmin = async (req, res, next) => {
  try {
    const { id: targetUserId } = req.params;
    const { role } = req.body;

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return sendError(res, 'Role must be either USER or ADMIN.', 400);
    }

    const updated = await updateUserRoleAdmin(targetUserId, role);
    return sendSuccess(res, { user: updated }, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

export const removeUserAdmin = async (req, res, next) => {
  try {
    const { id: targetUserId } = req.params;
    const currentAdminId = req.user.id;

    await deleteUserAdmin(targetUserId, currentAdminId);
    return sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};
