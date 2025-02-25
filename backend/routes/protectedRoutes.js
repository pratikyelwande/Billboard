import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
    createBooking,
    getBookings,
    updateBookingStatus,
    getAvailableBillboards,
    createBillboard,
    upload,
    approveBillboard,
    getUnapprovedBillboards,
    getApprovedBillboards,
    getMyBillboards
} from '../controllers/authController.js';

const router = express.Router();

// Billboard Endpoints
router.post('/billboards', authMiddleware, upload.array('bImg', 10), createBillboard);
router.put('/billboards/:id/approve', authMiddleware, adminMiddleware, approveBillboard);
router.get('/billboards', authMiddleware, getApprovedBillboards);
router.get('/admin/billboards', authMiddleware, adminMiddleware, getUnapprovedBillboards);
router.get('/my-billboards', authMiddleware, getMyBillboards);

// Booking Endpoints
router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings', authMiddleware, getBookings);
router.patch('/bookings/:id', authMiddleware, updateBookingStatus);
router.get('/available-billboards', authMiddleware, getAvailableBillboards);

export default router;
