import { Router } from "express";
import { authCheck, authorizeOrganization } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createProjectValidation } from "./project.validation";
import * as ProjectController from './project.controller';

const router = Router();

// Create project - ORGANIZATION_ADMIN only
router.post(
    '/',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    // authorizeOrganization,
    validateRequest(createProjectValidation),
    catchAsync(ProjectController.createProject)
);

// Get all projects in organization
router.get(
    '/',
    authCheck(),
    // authorizeOrganization,
    catchAsync(ProjectController.getOrganizationProjects)
);

export const projectRoutes = router;