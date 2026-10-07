import { Router } from 'express';
import { getAchievements, getMyAchievements } from '../controllers/achievementController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAchievements);
router.get('/my', authMiddleware, getMyAchievements);

export default router;
