import { Router } from "express";
import { authCheck, authorizeOrganization } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createProjectValidation, updateProjectValidation } from "./project.validation";
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

// Get project by ID
router.get(
    '/:projectId',
    authCheck(),
    // authorizeOrganization,
    ProjectController.getProjectById
);

// Update project (Organization Admin only)
router.patch(
    '/:projectId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    authorizeOrganization,
    validateRequest(updateProjectValidation),
    ProjectController.updateProject
);

export const projectRoutes = router;