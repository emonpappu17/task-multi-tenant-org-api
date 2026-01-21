import { Router } from "express";
import { authRoutes } from "../module/auth/auth.route";


export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})