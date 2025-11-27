import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";
import { DeliveryStatus } from "@prisma/client";
import { DeliveryStatusLoggerService } from "./delivery-status-logger-service";

export class UpdateDeliveryStatusService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private logsRepository: DeliveryLogsRepository
  ) {}

  async execute(data: { id: string; status: string; performedBy: string }) {
    const schema = z.object({
      id: z.string().uuid(),
      status: z.nativeEnum(DeliveryStatus),
      performedBy: z.string().uuid(),
    });

    const { id, status, performedBy } = schema.parse(data);

    const delivery = await this.deliveriesRepository.findById(id);
    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    // Atualiza a entrega
    const updated = await this.deliveriesRepository.updateStatus(id, status);

    // Usa o novo logger centralizado
    const logger = new DeliveryStatusLoggerService(this.logsRepository);

    await logger.createStatusLog({
      deliveryId: id,
      status,
      performedBy,
    });

    return updated;
  }
}
