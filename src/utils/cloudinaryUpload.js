import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import logger from './logger.js';

/**
 * Uploads a file (from multer disk storage or buffer) to Cloudinary.
 * If Cloudinary credentials are not set or default, falls back to local upload path.
 * 
 * @param {Object} file - Multer file object
 * @param {string} folder - Sub-folder name in Cloudinary (e.g., 'profile_pictures')
 * @returns {Promise<string>} - Cloudinary URL or local file path URL
 */
export const uploadToCloudinary = async (file, folder = 'profile_pictures') => {
  if (!file) return null;

  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

  if (!isCloudinaryConfigured) {
    logger.warn('Cloudinary credentials not configured. Using local uploads directory fallback.');
    return `/uploads/${file.filename}`;
  }

  try {
    let result;
    if (file.path) {
      result = await cloudinary.uploader.upload(file.path, {
        folder: `cg_awards/${folder}`,
        resource_type: 'auto'
      });

      // Remove temp file from local disk after successful upload to Cloudinary
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } else if (file.buffer) {
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `cg_awards/${folder}`, resource_type: 'auto' },
          (error, res) => {
            if (error) return reject(error);
            resolve(res);
          }
        );
        stream.end(file.buffer);
      });
    } else {
      throw new Error('No file path or buffer available for Cloudinary upload.');
    }

    return result.secure_url;
  } catch (error) {
    logger.error('Error uploading file to Cloudinary:', error);
    if (file.filename) {
      return `/uploads/${file.filename}`;
    }
    throw error;
  }
};

/**
 * Deletes an image from Cloudinary by its URL
 * @param {string} imageUrl 
 */
export const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes('cloudinary.com')) return;

  try {
    const parts = imageUrl.split('/');
    const filenameWithExt = parts.pop();
    const publicIdWithoutExt = filenameWithExt.split('.')[0];
    const folderIndex = parts.indexOf('cg_awards');

    let publicId = publicIdWithoutExt;
    if (folderIndex !== -1) {
      publicId = parts.slice(folderIndex).join('/') + '/' + publicIdWithoutExt;
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error('Error removing file from Cloudinary:', error);
  }
};
