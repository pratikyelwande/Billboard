import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiResponse } from '../utils/apiResponse.js';
import { validate } from '../middleware/validate.js'; // Optional: if you have validation logic
import { createBillboard } from '../controllers/authController.js';
import { billboardSchema } from '../schemas/authSchema.js'; // Optional: if you use schema validation

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
    apiResponse.success(res, { user: req.user }, 'Profile retrieved successfully');
});

router.get('/test', authMiddleware, (req, res) => {
    apiResponse.success(res, { message: "Protected route works!" });
});

router.get('/admin', authMiddleware, (req, res) => {
    if (req.user.role !== 'Admin') {
        return apiResponse.unauthorized(res, 'Admin access required');
    }
    apiResponse.success(res, { message: 'Admin dashboard' });
});

// Optionally, if you want to validate the billboard data before creation,
// you could add a middleware like: validate(billboardSchema)
// Example: router.post('/billboards', authMiddleware, validate(billboardSchema), createBillboard);
router.post('/billboards', authMiddleware, createBillboard);

export default router;
