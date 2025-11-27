import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";
import { deliveryUpdateStatusSchema } from "@/schemas/deliveries/update-delivery-status-schema";

export class UpdateDeliveryStatusService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private logsRepository: DeliveryLogsRepository
  ) {}

  async execute(data: { id: string; status: string; performedBy: string }) {
    const { id, status, performedBy } = deliveryUpdateStatusSchema.parse(data);

    const delivery = await this.deliveriesRepository.findById(id);
    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    // 1. Atualizar entrega
    const updated = await this.deliveriesRepository.updateStatus(id, status);

    // 2. Criar log automaticamente
    await this.logsRepository.create({
      deliveryId: id,
      description: status,
      performedBy,
    });

    return updated;
  }
}
