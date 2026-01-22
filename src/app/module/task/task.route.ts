import { Router } from "express";
import { authCheck, authorizeOrganization } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { assignTaskValidation, createTaskValidation, updateTaskValidation } from "./task.validation";
import * as TaskController from './task.controller';

const router = Router();

// Create task - ORGANIZATION_ADMIN only
router.post(
    '/',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    validateRequest(createTaskValidation),
    catchAsync(TaskController.createTask)
);

// Get all tasks for a project
router.get(
    '/project/:projectId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    catchAsync(TaskController.getProjectTasks)
);

// Get task by ID
router.get(
    '/:taskId',
    authCheck(),
    catchAsync(TaskController.getTaskById)
);

// Update task - ORGANIZATION_ADMIN only
router.patch(
    '/:taskId',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    validateRequest(updateTaskValidation),
    catchAsync(TaskController.updateTask)
);


// Assign task - ORGANIZATION_ADMIN only
router.post(
    '/assign',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    validateRequest(assignTaskValidation),
    catchAsync(TaskController.assignTask)
);

// Unassign task - ORGANIZATION_ADMIN only
router.delete(
    '/unassign',
    authCheck(UserRole.ORGANIZATION_ADMIN),
    catchAsync(TaskController.unassignTask)
);


export const tasksRoutes = router;