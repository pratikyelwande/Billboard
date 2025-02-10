import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiResponse } from '../utils/apiResponse.js';
import { validate } from '../middleware/validate.js';
import { createBillboard, getAllBillboards, upload, approveBillboard, getApprovedBillboards } from '../controllers/authController.js';

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

router.post('/billboards', authMiddleware, upload.array('bImg', 10), createBillboard);
router.put('/billboards/:id/approve', authMiddleware, approveBillboard);
router.get('/billboards', authMiddleware, getApprovedBillboards);

export default router;