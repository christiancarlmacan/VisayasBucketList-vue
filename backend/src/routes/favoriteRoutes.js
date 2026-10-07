import { Router } from 'express';
import {
  getFavorites,
  createFavorite,
  deleteFavorite,
} from '../controllers/favoriteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', createFavorite);
router.delete('/:destinationId', deleteFavorite);

export default router;
