import { Router } from 'express';
import {
  getCategories,
  addCategory,
  editCategory,
  removeCategory,
} from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', getCategories);
router.post('/', authMiddleware, adminMiddleware, addCategory);
router.put('/:id', authMiddleware, adminMiddleware, editCategory);
router.delete('/:id', authMiddleware, adminMiddleware, removeCategory);

export default router;
