import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    gender: z.enum(['Male', 'Female']).optional(), // Assuming gender is optional
    phoneno: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
    company_name: z.string().optional(),
    locality: z.string(),
    roleName: z.string().default('Admin'), // Default role from your schema
    document_id: z.string().uuid().optional() // Assuming document_id is optional
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});


export const billboardSchema = z.object({
    size: z.string(),
    location: z.string(),
    billboardType: z.string(),
    price: z.number(),
    available: z.boolean().default(true),
    amenities: z.string().optional(),
    bImg: z.string().optional(),
    bReview: z.string().optional(),
    bDescription: z.string().optional()
});