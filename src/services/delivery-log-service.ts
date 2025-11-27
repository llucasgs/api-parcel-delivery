import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";
import { DeliveryStatus } from "@prisma/client";

export class DeliveryLogService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliveryLogsRepository: DeliveryLogsRepository
  ) {}

  async execute(data: {
    delivery_id: string;
    description: string;
    performedBy: string;
  }) {
    const schema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string().min(1),
      performedBy: z.string().uuid(),
    });

    const { delivery_id, description, performedBy } = schema.parse(data);

    const delivery = await this.deliveriesRepository.findById(delivery_id);

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    if (delivery.status === DeliveryStatus.processing) {
      throw new AppError("Change status to shipped first");
    }

    if (delivery.status === DeliveryStatus.delivered) {
      throw new AppError("This order has already been delivered");
    }

    return this.deliveryLogsRepository.create({
      deliveryId: delivery_id,
      description,
      performedBy, // <<< AQUI!
    });
  }
}
