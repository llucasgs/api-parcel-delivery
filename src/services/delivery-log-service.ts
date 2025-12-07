import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";
import { DeliveryStatus } from "@prisma/client";

import { createDeliveryLogSchema } from "@/schemas/deliveries-logs/delivery-log-schema";
import { z } from "zod";

export class DeliveryLogService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliveryLogsRepository: DeliveryLogsRepository
  ) {}

  async execute(data: {
    delivery_id: string; // vem do params
    description: string; // vem do body
    performedBy: string; // vem do JWT
    role: "sale" | "customer"; // vem do JWT
  }) {
    // 1. Validar corpo (somente description)
    const { description } = createDeliveryLogSchema.parse({
      description: data.description,
    });

    // 2. Validar delivery_id separadamente
    const delivery_id = z.string().uuid().parse(data.delivery_id);

    // 3. Somente SALE pode criar logs manuais
    if (data.role !== "sale") {
      throw new AppError("Only sales can create manual delivery logs", 403);
    }

    // 4. Buscar entrega
    const delivery = await this.deliveriesRepository.findById(delivery_id);
    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    // 5. Não permitir logs após entrega finalizada
    if (delivery.status === DeliveryStatus.delivered) {
      throw new AppError("Delivered orders cannot receive new logs", 400);
    }

    // 6. Criar log manual
    return this.deliveryLogsRepository.create({
      deliveryId: delivery_id,
      description,
      performedBy: data.performedBy,
    });
  }
}
