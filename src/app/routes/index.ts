import { Router } from "express";
import { authRoutes } from "../module/auth/auth.route";
import { organizationRoutes } from "../module/organization/organization.route";


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
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})