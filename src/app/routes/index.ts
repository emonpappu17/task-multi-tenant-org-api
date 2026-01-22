import { Router } from "express";
import { authRoutes } from "../module/auth/auth.route";
import { organizationRoutes } from "../module/organization/organization.route";
import { userRoutes } from "../module/user/user.route";
import { projectRoutes } from "../module/project/project.route";


export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: '/organizations',
        route: organizationRoutes,
    },
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/projects',
        route: projectRoutes,
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})