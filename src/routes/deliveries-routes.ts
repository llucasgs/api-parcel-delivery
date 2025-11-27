import { Router } from "express";
import { DeliveriesController } from "@/controllers/deliveries-controller";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();
const deliveriesStatusController = new DeliveriesStatusController();

// ROTAS INDIVIDUALMENTE PROTEGIDAS
deliveriesRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["sale"]),
  deliveriesController.create
);

deliveriesRoutes.get(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["sale"]),
  deliveriesController.index.bind(deliveriesController)
);

deliveriesRoutes.patch(
  "/:id/status",
  ensureAuthenticated,
  verifyUserAuthorization(["sale"]),
  deliveriesStatusController.update
);

export { deliveriesRoutes };
