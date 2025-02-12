import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';
import { generateToken } from '../utils/auth.js';
import { apiResponse } from '../utils/apiResponse.js';
import {billboardSchema} from "../schemas/authSchema.js";
import { verifyToken } from '../utils/auth.js';  // Make sure this path is correct
import multer from 'multer';

export const registerController = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, roleName, phoneno, locality, gender, companyName } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return apiResponse.error(res, 'User already exists', 409);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname: firstName,
                lastname: lastName,
                roleName,
                phoneno,
                locality,
                gender,
                companyName,
                isVerified: false
            }
        });

        // Generate token (optional)
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.roleName
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        apiResponse.success(res, { user: userWithoutPassword, token }, 'User registered successfully');

    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (!user) {
            return apiResponse.unauthorized(res, 'Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return apiResponse.unauthorized(res, 'Invalid credentials');
        }

        // Generate token with payload containing userId, email, and role
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.roleName
        });

        // Set token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        const { password: _, ...userWithoutPassword } = user;
        apiResponse.success(res, { user: userWithoutPassword, token }, 'Login successful');
    } catch (error) {
        next(error);
    }
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage });
export const createBillboard = async (req, res) => {
    try {
        const { size, location, billboardType, price, available, amenities, bReview, bDescription } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return apiResponse.error(res, 'Owner ID not found', 400);
        }

        // Get the image paths from the uploaded files
        const bImg = req.files.map(file => file.path);

        const newBillboard = await prisma.billboard.create({
            data: {
                size,
                location,
                billboardType,
                price: parseFloat(price),
                available: available === 'true',
                amenities,
                bReview,
                bDescription,
                ownerId: userId,
                isApproved: false, // Default to false
                bImg: bImg.join(','), // Store the image paths as a comma-separated string
            },
        });

        return apiResponse.success(res, newBillboard, 'Billboard created successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};

export const approveBillboard = async (req, res) => {
    try {
        const { id } = req.params;
        const billboard = await prisma.billboard.update({
            where: { id },
            data: { isApproved: true },
        });
        return apiResponse.success(res, billboard, 'Billboard approved successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};

export const getApprovedBillboards = async (req, res) => {
    try {
        const billboards = await prisma.billboard.findMany({
            where: { isApproved: true },
        });
        return apiResponse.success(res, billboards, 'Approved billboards retrieved successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};

export const getUnapprovedBillboards = async (req, res) => {
    try {
        const billboards = await prisma.billboard.findMany({
            where: { isApproved: false },
        });
        return apiResponse.success(res, billboards, 'Unapproved billboards retrieved successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};

export const createBooking = async (req, res) => {
    try {
        const { startDate, endDate, offeredPrice, billboardId } = req.body;
        const userId = req.user.userId;

        // Validate required fields
        if (!startDate || !endDate || !offeredPrice || !billboardId) {
            return apiResponse.error(res, 'All fields are required', 400);
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!userExists) {
            return apiResponse.error(res, 'User not found', 404);
        }

        // Check if billboard exists and is available
        const billboard = await prisma.billboard.findUnique({
            where: { id: billboardId }
        });

        if (!billboard) {
            return apiResponse.error(res, 'Billboard not found', 404);
        }

        if (!billboard.available) {
            return apiResponse.error(res, 'Billboard is not available for booking', 400);
        }

        // Convert dates to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate date logic
        if (start >= end) {
            return apiResponse.error(res, 'End date must be after start date', 400);
        }

        // Check for existing bookings that conflict with these dates
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                billboardId,
                OR: [
                    {
                        startDate: { lte: end },
                        endDate: { gte: start }
                    },
                    {
                        status: 'approved',
                        startDate: { lte: end },
                        endDate: { gte: start }
                    }
                ]
            }
        });

        if (conflictingBooking) {
            return apiResponse.error(res, 'This billboard is already booked for the selected dates', 409);
        }

        // Create the booking
        const newBooking = await prisma.booking.create({
            data: {
                startDate: start,
                endDate: end,
                offeredPrice: parseFloat(offeredPrice),
                userId,
                billboardId,
                status: 'pending',
            },
        });

        return apiResponse.success(res, newBooking, 'Booking request created successfully');

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return apiResponse.error(res, 'Booking conflict detected', 409);
            }
            return apiResponse.error(res, `Database error: ${error.message}`, 500);
        }
        return apiResponse.error(res, 'Internal Server Error', 500);
    }
};

export const getBookings = async (req, res) => {
    try {
        const userId = req.user.userId;

        const bookings = await prisma.booking.findMany({
            where: {
                billboard: {
                    ownerId: userId,
                },
            },
            include: {
                billboard: true,
                user: true,
            },
        });

        return apiResponse.success(res, bookings, 'Bookings retrieved successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.userId;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { billboard: true },
        });

        if (!booking || booking.billboard.ownerId !== userId) {
            return apiResponse.unauthorized(res, 'You are not authorized to update this booking');
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status },
        });

        if (status === 'approved') {
            await prisma.billboard.update({
                where: { id: booking.billboardId },
                data: { available: false },
            });
        }

        return apiResponse.success(res, updatedBooking, 'Booking status updated successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};

export const getAvailableBillboards = async (req, res) => {
    try {
        const billboards = await prisma.billboard.findMany({
            where: { available: true },
        });

        return apiResponse.success(res, billboards, 'Available billboards retrieved successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};
