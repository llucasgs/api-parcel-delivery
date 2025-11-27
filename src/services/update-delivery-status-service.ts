import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";
import { DeliveryStatus } from "@prisma/client";

export class UpdateDeliveryStatusService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private logsRepository: DeliveryLogsRepository
  ) {}

  async execute(data: { id: string; status: string; performedBy: string }) {
    const schema = z.object({
      id: z.string().uuid(),
      status: z.nativeEnum(DeliveryStatus),
    });

    // Valida apenas id e status
    const { id, status } = schema.parse(data);

    // Pega performedBy diretamente do data
    const { performedBy } = data;

    const delivery = await this.deliveriesRepository.findById(id);

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    const updated = await this.deliveriesRepository.updateStatus(id, status);

    await this.logsRepository.create({
      deliveryId: id,
      description: status,
      performedBy,
    });

    return updated;
  }
}
