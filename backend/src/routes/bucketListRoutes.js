import { Router } from 'express';
import {
  getMyBucketList,
  addItemToBucketList,
  updateItemStatus,
  deleteItemFromBucketList,
} from '../controllers/bucketListController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// All bucket list routes are protected by authMiddleware
router.use(authMiddleware);

router.get('/', getMyBucketList);
router.post('/', addItemToBucketList);
router.put('/:id', updateItemStatus);
router.delete('/:id', deleteItemFromBucketList);

export default router;
