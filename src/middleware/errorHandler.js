import { ApiResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(
    res,
    `Route not found: ${req.originalUrl}`,
    [{ message: `Cannot ${req.method} ${req.originalUrl}` }],
    404
  );
};

export const globalErrorHandler = (err, req, res, next) => {
  logger.error(`[${req.method} ${req.url}] ${err.stack || err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    return ApiResponse.error(res, err.message || 'Database Validation Error', errors, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    return ApiResponse.error(
      res,
      `Duplicate field value entered for '${field}'. Please use another value.`,
      [{ field, message: `${field} already exists` }],
      409
    );
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return ApiResponse.error(
      res,
      `Invalid format for '${err.path}': '${err.value}'`,
      [{ field: err.path, message: `Invalid ObjectId format` }],
      400
    );
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid Token', [{ message: 'Token is malformed or invalid' }], 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token Expired', [{ message: 'Please log in again' }], 401);
  }

  // Multer Error
  if (err.name === 'MulterError') {
    return ApiResponse.error(res, `File upload error: ${err.message}`, [err], 400);
  }

  const statusCode = err.statusCode || err.status || 400;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(
    res,
    message,
    [{ message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined }],
    statusCode
  );
};
