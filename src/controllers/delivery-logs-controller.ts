import { Request, Response } from "express";
import { PrismaDeliveriesRepository } from "@/repositories/prisma-deliveries-repository";
import { PrismaDeliveryLogsRepository } from "@/repositories/prisma-delivery-logs-repository";

import { DeliveryLogService } from "@/services/delivery-log-service";
import { ShowDeliveryLogsService } from "@/services/show-delivery-logs-service";

class DeliveryLogsController {
  create = async (request: Request, response: Response) => {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const logsRepository = new PrismaDeliveryLogsRepository();

    const service = new DeliveryLogService(
      deliveriesRepository,
      logsRepository
    );

    const log = await service.execute({
      delivery_id: request.body.delivery_id,
      description: request.body.description,
    });

    return response.status(201).json(log);
  };

  show = async (request: Request, response: Response) => {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const logsRepository = new PrismaDeliveryLogsRepository();

    const service = new ShowDeliveryLogsService(
      deliveriesRepository,
      logsRepository
    );

    const logs = await service.execute({
      delivery_id: request.params.delivery_id,
      user_id: request.user!.id,
      role: request.user!.role,
    });

    return response.json(logs);
  };
}

export { DeliveryLogsController };
