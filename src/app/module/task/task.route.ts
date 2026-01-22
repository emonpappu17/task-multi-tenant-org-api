import { Router } from "express";
import { authCheck, authorizeOrganization } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { assignTaskValidation, createTaskValidation } from "./task.validation";
import * as TaskController from './task.controller';

const router = Router();

// Create task - ORGANIZATION_ADMIN only
router.post(
    '/',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    // authorizeOrganization,
    validateRequest(createTaskValidation),
    catchAsync(TaskController.createTask)
);

// Get all tasks for a project
router.get(
    '/:projectId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    // authorizeOrganization,
    catchAsync(TaskController.getProjectTasks)
);


// Assign task - ORGANIZATION_ADMIN only
router.post(
    '/assign',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    // authorizeOrganization,
    validateRequest(assignTaskValidation),
    catchAsync(TaskController.assignTask)
);

export const tasksRoutes = router;