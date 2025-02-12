import express from 'express';
import {adminMiddleware, authMiddleware} from '../middleware/authMiddleware.js';
import { apiResponse } from '../utils/apiResponse.js';
import { validate } from '../middleware/validate.js';
import { createBillboard, upload, approveBillboard,getUnapprovedBillboards , getApprovedBillboards } from '../controllers/authController.js';

const router = express.Router();

// router.get('/profile', authMiddleware, (req, res) => {
//     apiResponse.success(res, { user: req.user }, 'Profile retrieved successfully');
// });

router.get('/admin', authMiddleware, (req, res) => {
    if (req.user.role !== 'Admin') {
        return apiResponse.unauthorized(res, 'Admin access required');
    }
    apiResponse.success(res, { message: 'Admin dashboard' });
});

router.post('/billboards', authMiddleware, upload.array('bImg', 10), createBillboard);
router.put('/billboards/:id/approve', authMiddleware, adminMiddleware,approveBillboard);
router.get('/billboards', authMiddleware, getApprovedBillboards);
router.get('/admin/billboards', authMiddleware, adminMiddleware, getUnapprovedBillboards);
export default router;