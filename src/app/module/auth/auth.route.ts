import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { loginValidation } from './auth.validation';
import catchAsync from '../../shared/catchAsync';
import * as AuthController from './auth.controller';
import { authCheck } from '../../middlewares/auth';

const router = Router();

// Public routes
router.post(
    '/login',
    validateRequest(loginValidation),
    catchAsync(AuthController.login)
);

router.get(
    '/me',
    authCheck(),
    catchAsync(AuthController.getCurrentUser)
);


export const authRoutes = router;
