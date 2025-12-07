import { Request, Response } from "express";

import { PrismaDeliveriesRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { PrismaDeliveryLogsRepository } from "@/repositories/prisma/prisma-delivery-logs-repository";

import { DeliveryLogService } from "@/services/delivery-log-service";
import { ShowDeliveryLogsService } from "@/services/show-delivery-logs-service";

import { ok, created } from "@/utils/response";

class DeliveryLogsController {
  create = async (request: Request, response: Response) => {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const logsRepository = new PrismaDeliveryLogsRepository();

    const service = new DeliveryLogService(
      deliveriesRepository,
      logsRepository
    );

    const log = await service.execute({
      delivery_id: request.params.id,
      description: request.body.description,
      performedBy: request.user!.id, // pegamos do JWT
      role: request.user!.role, // pegamos do JWT
    });

    return response
      .status(201)
      .json(created("Delivery log created successfully", log));
  };

  show = async (request: Request, response: Response) => {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const logsRepository = new PrismaDeliveryLogsRepository();

    const service = new ShowDeliveryLogsService(
      deliveriesRepository,
      logsRepository
    );

    const logs = await service.execute({
      delivery_id: request.params.id,
      user_id: request.user!.id,
      role: request.user!.role,
    });

    return response.json(ok("Delivery logs fetched successfully", logs));
  };
}

export { DeliveryLogsController };
