import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { authRoutes } from "./auth-routes";
import { deliveriesRoutes } from "./deliveries-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/auth", authRoutes);
routes.use("/deliveries", deliveriesRoutes);

export { routes };
