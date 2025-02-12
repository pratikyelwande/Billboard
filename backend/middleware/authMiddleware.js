import { apiResponse } from '../utils/apiResponse.js';
import { verifyToken } from '../utils/auth.js';

export const authMiddleware = (req, res, next) => {
    // Get token from cookie or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return apiResponse.unauthorized(res, 'Authentication required');
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return apiResponse.unauthorized(res, error.message);
    }
};
export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'Admin') { // Match the exact role name (e.g., 'Admin')
        return apiResponse.unauthorized(res, 'Admin access required');
    }
    next();
};