import {
  getDestinations,
  getDestinationByIdOrSlug,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../services/destinationService.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const listDestinations = async (req, res, next) => {
  try {
    const { search, region, province, category, page, limit } = req.query;
    const userId = req.user?.id || null;

    const result = await getDestinations({
      search,
      region,
      province,
      category,
      page,
      limit,
      userId,
    });

    return sendSuccess(res, result, 'Destinations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDestinationDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const destination = await getDestinationByIdOrSlug(id, userId);
    return sendSuccess(res, { destination }, 'Destination details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const addDestination = async (req, res, next) => {
  try {
    const {
      name,
      description,
      province,
      region,
      location,
      latitude,
      longitude,
      estimated_budget,
      recommended_days,
      image_url,
      category_id,
    } = req.body;

    if (!name || !description || !province || !region || !location || !category_id) {
      return sendError(
        res,
        'Name, description, province, region, location, and category_id are required fields.',
        400
      );
    }

    const destination = await createDestination({
      name,
      description,
      province,
      region,
      location,
      latitude,
      longitude,
      estimated_budget,
      recommended_days,
      image_url,
      category_id,
    });

    return sendSuccess(res, { destination }, 'Destination created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const editDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destination = await updateDestination(id, req.body);
    return sendSuccess(res, { destination }, 'Destination updated successfully');
  } catch (error) {
    next(error);
  }
};

export const removeDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteDestination(id);
    return sendSuccess(res, null, 'Destination deleted successfully');
  } catch (error) {
    next(error);
  }
};
