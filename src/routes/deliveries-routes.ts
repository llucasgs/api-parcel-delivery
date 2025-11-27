import { Router } from "express";

import { DeliveriesController } from "@/controllers/deliveries-controller";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";
import { DeliveryLogsController } from "@/controllers/delivery-logs-controller";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveriesRoutes = Router();

const deliveriesController = new DeliveriesController();
const statusController = new DeliveriesStatusController();
const logsController = new DeliveryLogsController();

deliveriesRoutes.use(ensureAuthenticated);

// Criar entrega (SALE)
deliveriesRoutes.post(
  "/",
  verifyUserAuthorization(["sale"]),
  deliveriesController.create
);

// Listar entregas (SALE)
deliveriesRoutes.get(
  "/",
  verifyUserAuthorization(["sale"]),
  deliveriesController.index.bind(deliveriesController)
);

// Atualizar status (SALE)
deliveriesRoutes.patch(
  "/:id/status",
  verifyUserAuthorization(["sale"]),
  statusController.update
);

// Criar log da entrega (SALE)
deliveriesRoutes.post(
  "/:id/logs",
  verifyUserAuthorization(["sale"]),
  logsController.create
);

// Listar logs de uma entrega (SALE + CUSTOMER)
deliveriesRoutes.get(
  "/:id/logs",
  verifyUserAuthorization(["sale", "customer"]),
  logsController.show
);

export { deliveriesRoutes };
