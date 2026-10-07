import {
  getUserBucketList,
  addToBucketList,
  updateBucketListItemStatus,
  removeFromBucketList,
} from '../services/bucketListService.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getMyBucketList = async (req, res, next) => {
  try {
    const { status } = req.query;
    const result = await getUserBucketList(req.user.id, status);
    return sendSuccess(res, result, 'Bucket list fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const addItemToBucketList = async (req, res, next) => {
  try {
    const { destinationId, status } = req.body;
    if (!destinationId) {
      return sendError(res, 'destinationId is required', 400);
    }
    const item = await addToBucketList(req.user.id, destinationId, status);
    return sendSuccess(res, { item }, 'Destination added to your bucket list', 201);
  } catch (error) {
    next(error);
  }
};

export const updateItemStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['WANT_TO_VISIT', 'VISITED'].includes(status.toUpperCase())) {
      return sendError(res, 'Valid status is required ("WANT_TO_VISIT" or "VISITED")', 400);
    }
    const item = await updateBucketListItemStatus(req.user.id, id, status.toUpperCase());
    return sendSuccess(res, { item }, 'Bucket list item status updated');
  } catch (error) {
    next(error);
  }
};

export const deleteItemFromBucketList = async (req, res, next) => {
  try {
    const { id } = req.params;
    await removeFromBucketList(req.user.id, id);
    return sendSuccess(res, null, 'Destination removed from your bucket list');
  } catch (error) {
    next(error);
  }
};
