import { Request, Response } from "express";
import { PrismaDeliveriesRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { PrismaDeliveryLogsRepository } from "@/repositories/prisma/prisma-delivery-logs-repository";
import { UpdateDeliveryStatusService } from "@/services/update-delivery-status-service";

class DeliveriesStatusController {
  update = async (request: Request, response: Response) => {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const logsRepository = new PrismaDeliveryLogsRepository();

    const service = new UpdateDeliveryStatusService(
      deliveriesRepository,
      logsRepository
    );

    const result = await service.execute({
      id: request.params.id,
      status: request.body.status,
      performedBy: request.user!.id,
    });

    return response.json(result);
  };
}

export { DeliveriesStatusController };
