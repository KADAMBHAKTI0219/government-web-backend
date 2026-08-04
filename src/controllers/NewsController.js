import NewsService from '../services/NewsService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createNews = asyncHandler(async (req, res) => {
  const news = await NewsService.createNews(req.user._id, req.body);
  return ApiResponse.success(res, 'News article created successfully', news, 201);
});

export const getAllNews = asyncHandler(async (req, res) => {
  const result = await NewsService.getAllNews(req.query);
  return ApiResponse.success(res, 'News articles fetched successfully', result, 200);
});

export const getNewsBySlug = asyncHandler(async (req, res) => {
  const news = await NewsService.getNewsBySlug(req.params.slug);
  return ApiResponse.success(res, 'News article details fetched', news, 200);
});

export const updateNews = asyncHandler(async (req, res) => {
  const updated = await NewsService.updateNews(req.params.id, req.body);
  return ApiResponse.success(res, 'News article updated', updated, 200);
});

export const deleteNews = asyncHandler(async (req, res) => {
  await NewsService.deleteNews(req.params.id);
  return ApiResponse.success(res, 'News article deleted', {}, 200);
});
