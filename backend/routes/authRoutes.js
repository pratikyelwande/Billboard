import express from 'express';
import { registerSchema, loginSchema, billboardSchema } from '../schemas/authSchema.js';
import { registerController, loginController, createBillboard } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);
// router.post('/billboards', validate(billboardSchema), createBillboard);

export default router;