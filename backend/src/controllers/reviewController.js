import {
  getReviewsForDestination,
  upsertReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
} from '../services/reviewService.js';
import { validateReviewInput } from '../validators/reviewValidator.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getDestinationReviews = async (req, res, next) => {
  try {
    const { id: destinationId } = req.params;
    const result = await getReviewsForDestination(destinationId);
    return sendSuccess(res, result, 'Reviews retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const addOrUpdateDestinationReview = async (req, res, next) => {
  try {
    const { id: destinationId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const validationError = validateReviewInput({ rating, comment });
    if (validationError) {
      return sendError(res, validationError, 400);
    }

    const review = await upsertReview(userId, destinationId, { rating, comment });
    return sendSuccess(res, { review }, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (rating !== undefined || comment !== undefined) {
      if (rating !== undefined) {
        const num = Number(rating);
        if (!Number.isInteger(num) || num < 1 || num > 5) {
          return sendError(res, 'Rating must be an integer between 1 and 5.', 400);
        }
      }
      if (comment !== undefined && (typeof comment !== 'string' || comment.trim().length < 3)) {
        return sendError(res, 'Comment must be at least 3 characters long.', 400);
      }
    }

    const review = await updateReview(userId, reviewId, { rating, comment });
    return sendSuccess(res, { review }, 'Review updated successfully');
  } catch (error) {
    next(error);
  }
};

export const removeReview = async (req, res, next) => {
  try {
    const { id: reviewId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    await deleteReview(userId, reviewId, isAdmin);
    return sendSuccess(res, null, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const listAllReviewsAdmin = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await getAllReviewsAdmin({ page, limit, search });
    return sendSuccess(res, result, 'All reviews retrieved successfully');
  } catch (error) {
    next(error);
  }
};
