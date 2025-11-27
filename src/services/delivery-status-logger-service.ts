import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";

export class DeliveryStatusLoggerService {
  constructor(private logsRepository: DeliveryLogsRepository) {}

  async createStatusLog({
    deliveryId,
    status,
    performedBy,
  }: {
    deliveryId: string;
    status: string;
    performedBy: string;
  }) {
    return this.logsRepository.create({
      deliveryId,
      description: status,
      performedBy,
    });
  }
}
