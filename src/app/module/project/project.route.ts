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
    validateRequest(createProjectValidation),
    catchAsync(ProjectController.createProject)
);

// Get all projects in organization
router.get(
    '/',
    authCheck(),
    catchAsync(ProjectController.getOrganizationProjects)
);

// Get project by ID
router.get(
    '/:projectId',
    authCheck(),
    ProjectController.getProjectById
);

// Update project (Organization Admin only)
router.patch(
    '/:projectId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    validateRequest(updateProjectValidation),
    ProjectController.updateProject
);

// Delete project (Organization Admin only)
router.delete(
    '/:projectId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    ProjectController.deleteProject
);


export const projectRoutes = router;