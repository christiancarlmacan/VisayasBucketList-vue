import { Router } from 'express';
import {
  editReview,
  removeReview,
  listAllReviewsAdmin,
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

// Admin: list all reviews
router.get('/', authMiddleware, adminMiddleware, listAllReviewsAdmin);

// User/Admin: Edit review
router.put('/:id', authMiddleware, editReview);

// User/Admin: Delete review
router.delete('/:id', authMiddleware, removeReview);

export default router;
