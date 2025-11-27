import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controller";
import { RefreshTokenController } from "@/controllers/refresh-token-controller";

const sessionsRoutes = Router();

const sessionsController = new SessionsController();
const refreshTokenController = new RefreshTokenController();

sessionsRoutes.post("/", sessionsController.create);

// Nova rota para Refresh Token
sessionsRoutes.post("/refresh", refreshTokenController.handle);

export { sessionsRoutes };
