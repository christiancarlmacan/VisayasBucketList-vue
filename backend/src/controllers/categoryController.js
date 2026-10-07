import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService.js';
import { sendSuccess, sendError } from '../utils/helpers.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return sendSuccess(res, { categories }, 'Categories fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
      return sendError(res, 'Category name is required', 400);
    }
    const category = await createCategory({ name, description });
    return sendSuccess(res, { category }, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await updateCategory(id, { name, description });
    return sendSuccess(res, { category }, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

export const removeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    return sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
