import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";
import { DeliveryStatus } from "@prisma/client";
import { createDeliveryLogSchema } from "@/schemas/deliveries-logs/delivery-log-schema";

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
    const { delivery_id, description, performedBy } =
      createDeliveryLogSchema.parse(data);

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
      performedBy,
    });
  }
}
