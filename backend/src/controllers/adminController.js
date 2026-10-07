import { getAdminDashboardStats } from '../services/adminService.js';
import { sendSuccess } from '../utils/helpers.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await getAdminDashboardStats();
    return sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};
