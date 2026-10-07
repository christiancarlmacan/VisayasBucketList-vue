import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favoriteService.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await getUserFavorites(req.user.id);
    return sendSuccess(res, { favorites }, 'Favorites fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const createFavorite = async (req, res, next) => {
  try {
    const { destinationId } = req.body;
    if (!destinationId) {
      return sendError(res, 'destinationId is required', 400);
    }
    const favorite = await addFavorite(req.user.id, destinationId);
    return sendSuccess(res, { favorite }, 'Added to favorites', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteFavorite = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    await removeFavorite(req.user.id, destinationId);
    return sendSuccess(res, null, 'Removed from favorites');
  } catch (error) {
    next(error);
  }
};
