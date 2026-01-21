import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { loginValidation } from './auth.validation';
import catchAsync from '../../shared/catchAsync';
import * as AuthController from './auth.controller';

const router = Router();

// Public routes
router.post(
    '/login',
    validateRequest(loginValidation),
    catchAsync(AuthController.login)
);


export const authRoutes = router;
