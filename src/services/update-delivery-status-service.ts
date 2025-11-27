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

  async execute(data: { id: string; status: string }) {
    // aqui o Zod garante que o status é um dos valores do enum
    const schema = z.object({
      id: z.string().uuid(),
      status: z.nativeEnum(DeliveryStatus),
    });

    const { id, status } = schema.parse(data); // status agora é DeliveryStatus

    const delivery = await this.deliveriesRepository.findById(id);

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    const updated = await this.deliveriesRepository.updateStatus(id, status);

    // cria log automático
    await this.logsRepository.create({
      deliveryId: id,
      description: status, // string mesmo, porque o enum vira string
    });

    return updated;
  }
}
