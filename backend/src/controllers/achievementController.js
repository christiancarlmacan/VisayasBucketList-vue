import {
  getAllAchievements,
  getUserAchievements,
} from '../services/achievementService.js';
import { sendSuccess } from '../utils/helpers.js';

export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await getAllAchievements();
    return sendSuccess(res, { achievements }, 'Achievements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await getUserAchievements(userId);
    return sendSuccess(res, result, 'User achievements retrieved successfully');
  } catch (error) {
    next(error);
  }
};
