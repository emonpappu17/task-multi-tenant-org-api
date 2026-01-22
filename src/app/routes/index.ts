import { Router } from "express";
import { authRoutes } from "../module/auth/auth.route";
import { organizationRoutes } from "../module/organization/organization.route";
import { userRoutes } from "../module/user/user.route";


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
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})