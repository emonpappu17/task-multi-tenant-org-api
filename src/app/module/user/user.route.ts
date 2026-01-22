import { Router } from "express";
import { authCheck, authorizeOrganization } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createUserByAdminValidation } from "./user.validation";
import * as UserController from './user.controller';

const router = Router();

// Create user - ORGANIZATION_ADMIN only
router.post(
    '/',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    // authorizeOrganization,
    validateRequest(createUserByAdminValidation),
    catchAsync(UserController.createUser)
);


export const userRoutes = router;