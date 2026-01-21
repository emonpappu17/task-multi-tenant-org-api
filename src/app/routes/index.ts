import { Router } from "express";


export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})