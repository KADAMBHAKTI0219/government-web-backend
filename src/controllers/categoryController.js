import CategoryService from '../services/CategoryService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.createCategory(req.body);
  return ApiResponse.success(res, 'Category created successfully', category, 201);
});

export const getCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  const categories = await CategoryService.getAllCategories(includeInactive);
  return ApiResponse.success(res, 'Categories fetched successfully', categories, 200);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await CategoryService.getCategoryBySlug(req.params.slug);
  return ApiResponse.success(res, 'Category details fetched', category, 200);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const updated = await CategoryService.updateCategory(req.params.id, req.body);
  return ApiResponse.success(res, 'Category updated successfully', updated, 200);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await CategoryService.deleteCategory(req.params.id);
  return ApiResponse.success(res, 'Category deleted successfully', {}, 200);
});
