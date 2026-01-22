import { Router } from "express";
import { authCheck, authorizeOrganization } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import catchAsync from "../../shared/catchAsync";
import { createTaskValidation } from "./task.validation";
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

export const tasksRoutes = router;