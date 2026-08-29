import { ApiResponse } from '../utils/apiResponse.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'User identity not found', [], 401);
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => String(r).toUpperCase());

    // Super Admin and Admin have full access, or if role matches allowed roles
    if (
      userRole === 'SUPER_ADMIN' ||
      userRole === 'ADMIN' ||
      normalizedAllowed.includes(userRole)
    ) {
      return next();
    }

    return ApiResponse.error(
      res,
      `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
      [],
      403
    );
  };
};
