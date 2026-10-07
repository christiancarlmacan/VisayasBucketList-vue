import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  listUsersAdmin,
  changeUserRoleAdmin,
  removeUserAdmin,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

// User profile endpoints (Authenticated)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin-only user management endpoints
router.get('/', authMiddleware, adminMiddleware, listUsersAdmin);
router.put('/:id/role', authMiddleware, adminMiddleware, changeUserRoleAdmin);
router.delete('/:id', authMiddleware, adminMiddleware, removeUserAdmin);

export default router;
