import { Router } from "express";
import { DeliveryLogsController } from "@/controllers/delivery-logs-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveryLogsRoutes = Router();
const controller = new DeliveryLogsController();

// criar log → apenas sale
deliveryLogsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["sale"]),
  controller.create
);

// listar logs da entrega → sale e customer
deliveryLogsRoutes.get(
  "/:delivery_id",
  ensureAuthenticated,
  verifyUserAuthorization(["sale", "customer"]),
  controller.show
);

export { deliveryLogsRoutes };
