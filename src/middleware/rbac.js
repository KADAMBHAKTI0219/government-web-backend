import { ApiResponse } from '../utils/apiResponse.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'User identity not found', [], 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        [],
        403
      );
    }

    next();
  };
};
