import { Router } from 'express';
import {
  listDestinations,
  getDestinationDetails,
  addDestination,
  editDestination,
  removeDestination,
} from '../controllers/destinationController.js';
import {
  getDestinationReviews,
  addOrUpdateDestinationReview,
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware.js';

const router = Router();

router.get('/', optionalAuthMiddleware, listDestinations);
router.get('/:id', optionalAuthMiddleware, getDestinationDetails);
router.get('/:id/reviews', getDestinationReviews);
router.post('/:id/reviews', authMiddleware, addOrUpdateDestinationReview);
router.post('/', authMiddleware, adminMiddleware, addDestination);
router.put('/:id', authMiddleware, adminMiddleware, editDestination);
router.delete('/:id', authMiddleware, adminMiddleware, removeDestination);

export default router;
