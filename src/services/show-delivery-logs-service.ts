import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";

export class ShowDeliveryLogsService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliveryLogsRepository: DeliveryLogsRepository
  ) {}

  async execute(data: { delivery_id: string; user_id: string; role: string }) {
    const schema = z.object({
      delivery_id: z.string().uuid(),
      user_id: z.string().uuid(),
      role: z.string(),
    });

    const { delivery_id, role, user_id } = schema.parse(data);

    const delivery = await this.deliveriesRepository.findById(delivery_id);

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    // customer só pode ver pedidos dele mesmo
    if (role === "customer" && delivery.userId !== user_id) {
      throw new AppError(
        "Forbidden: customers can only view their deliveries",
        403
      );
    }

    return this.deliveryLogsRepository.findManyByDeliveryId(delivery_id);
  }
}
