import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controller";
import { RefreshTokenController } from "@/controllers/refresh-token-controller";

const authRoutes = Router();

const sessionsController = new SessionsController();
const refreshTokenController = new RefreshTokenController();

authRoutes.post("/login", sessionsController.create);
authRoutes.post("/refresh", refreshTokenController.handle);

export { authRoutes };
