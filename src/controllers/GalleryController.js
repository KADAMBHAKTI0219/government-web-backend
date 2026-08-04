import GalleryService from '../services/GalleryService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createAlbum = asyncHandler(async (req, res) => {
  const album = await GalleryService.createAlbum(req.body);
  return ApiResponse.success(res, 'Gallery album created', album, 201);
});

export const addMediaToAlbum = asyncHandler(async (req, res) => {
  const updated = await GalleryService.addMediaToAlbum(req.params.id, req.body.media);
  return ApiResponse.success(res, 'Media items added to album', updated, 200);
});

export const getAlbums = asyncHandler(async (req, res) => {
  const result = await GalleryService.getAlbums(req.query);
  return ApiResponse.success(res, 'Gallery albums fetched', result, 200);
});

export const getAlbumBySlug = asyncHandler(async (req, res) => {
  const album = await GalleryService.getAlbumBySlug(req.params.slug);
  return ApiResponse.success(res, 'Album details fetched', album, 200);
});

export const deleteAlbum = asyncHandler(async (req, res) => {
  await GalleryService.deleteAlbum(req.params.id);
  return ApiResponse.success(res, 'Album deleted', {}, 200);
});
