import { Router } from "express";
import { authCheck, authorizeOrganization } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createUserByAdminValidation, updateUserValidation } from "./user.validation";
import * as UserController from './user.controller';

const router = Router();

// Create user - ORGANIZATION_ADMIN only
router.post(
    '/',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    validateRequest(createUserByAdminValidation),
    catchAsync(UserController.createUser)
);

// Get all users in organization - ORGANIZATION_ADMIN and ORGANIZATION_MEMBER can view
router.get(
    '/',
    authCheck(UserRole.ORGANIZATION_ADMIN, UserRole.ORGANIZATION_MEMBER),
    catchAsync(UserController.getOrganizationUsers)
);

// Get user by ID
router.get(
    '/:userId',
    authCheck(),
    catchAsync(UserController.getUserById)
);

// Update user - ORGANIZATION_ADMIN only
router.patch(
    '/:userId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    validateRequest(updateUserValidation),
    catchAsync(UserController.updateUser)
);

// Delete user - ORGANIZATION_ADMIN only
router.delete(
    '/:userId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    catchAsync(UserController.deleteUser)
);


export const userRoutes = router;