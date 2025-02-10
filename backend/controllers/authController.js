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

// export const createBillboard = async (req, res) => {
//     try {
//         // Destructure billboard details from the request body
//         const { size, location, billboardType, price, available, amenities, bImg, bReview, bDescription } = req.body;
//
//         // Retrieve the authenticated user's id from the token (attached by authMiddleware)
//         const userId = req.user?.userId;
//         if (!userId) {
//             return apiResponse.error(res, 'Owner ID not found', 400);
//         }
//
//         console.log('Owner ID from token:', userId);
//
//         // Create a new billboard record using the ownerId from the token
//         const newBillboard = await prisma.billboard.create({
//             data: {
//                 size,
//                 location,
//                 billboardType,
//                 price,
//                 available,
//                 amenities,
//                 bImg,
//                 bReview,
//                 bDescription,
//                 ownerId: userId
//             }
//         });
//
//         return apiResponse.success(res, newBillboard, 'Billboard created successfully');
//     } catch (error) {
//         return apiResponse.error(res, error.message, 500);
//     }
// };

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

        const bImgPaths = req.files.map(file => file.path);

        const newBillboard = await prisma.billboard.create({
            data: {
                size,
                location,
                billboardType,
                price: parseFloat(price),
                available: available === 'true',
                amenities,
                bImg: bImgPaths.join(','),
                bReview,
                bDescription,
                ownerId: userId
            }
        });

        return apiResponse.success(res, newBillboard, 'Billboard created successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};
export const getAllBillboards = async (req, res) => {
    try {
        const billboards = await prisma.billboard.findMany();
        return apiResponse.success(res, billboards, 'Billboards retrieved successfully');
    } catch (error) {
        return apiResponse.error(res, error.message, 500);
    }
};