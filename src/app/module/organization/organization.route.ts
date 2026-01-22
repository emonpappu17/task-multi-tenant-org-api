import { UserRole } from "@prisma/client";
import { Router } from "express";
// import authCheck from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createFirstOrgAdminValidation, createOrganizationValidation } from "./organization.validation";
import * as OrganizationController from './organizatoin.controller';
import { authCheck, authorizeOrganization } from "../../middlewares/auth";

const router = Router();

// Create organization - PLATFORM_ADMIN only
router.post(
    '/',
    authCheck(UserRole.PLATFORM_ADMIN),
    validateRequest(createOrganizationValidation),
    catchAsync(OrganizationController.createOrganization)
);

// Get all organizations - PLATFORM_ADMIN only
router.get(
    '/',
    authCheck(UserRole.PLATFORM_ADMIN),
    catchAsync(OrganizationController.getAllOrganizations)
);

// Get organization by ID
router.get(
    '/:organizationId',
    authCheck(),
    authorizeOrganization,
    catchAsync(OrganizationController.getOrganizationById)
);


// Create first org admin for organization - PLATFORM_ADMIN only
router.post(
    '/:organizationId/create-first-admin',
    authCheck(UserRole.PLATFORM_ADMIN),
    validateRequest(createFirstOrgAdminValidation),
    catchAsync(OrganizationController.createFirstOrgAdmin)
);


export const organizationRoutes = router;