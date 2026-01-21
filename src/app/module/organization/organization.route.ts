import { UserRole } from "@prisma/client";
import { Router } from "express";
import authCheck from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createOrganizationValidation } from "./organization.validation";
import * as OrganizationController from './organizatoin.controller';

const router = Router();

// Create organization - PLATFORM_ADMIN only
router.post(
    '/',
    authCheck(UserRole.PLATFORM_ADMIN),
    validateRequest(createOrganizationValidation),
    catchAsync(OrganizationController.createOrganization)
);

// Create first org admin for organization - PLATFORM_ADMIN only
router.post(
    '/:organizationId/create-first-admin',
    authCheck(UserRole.PLATFORM_ADMIN),
    catchAsync(OrganizationController.createFirstOrgAdmin)
);


export const organizationRoutes = router;