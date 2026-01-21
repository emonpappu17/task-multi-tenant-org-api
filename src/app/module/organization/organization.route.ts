import { Router } from "express";
import authenticate from "../../middlewares/authenticate";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createOrganizationValidation } from "./organization.validation";
import { authorizeRoles } from "../../middlewares/authorize";
import { UserRole } from "@prisma/client";
import * as OrganizationController from './organizatoin.controller';
import authCheck from "../../middlewares/auth";

const router = Router();

// Create organization - PLATFORM_ADMIN only
router.post(
    '/',
    authCheck(UserRole.PLATFORM_ADMIN),
    validateRequest(createOrganizationValidation),
    catchAsync(OrganizationController.createOrganization)
);

export const organizationRoutes = router;