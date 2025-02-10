import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiResponse } from '../utils/apiResponse.js';
import { validate } from '../middleware/validate.js'; // Optional: if you have validation logic
import {createBillboard, getAllBillboards, upload} from '../controllers/authController.js';

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

router.get('/billboards', authMiddleware, getAllBillboards);


export default router;
