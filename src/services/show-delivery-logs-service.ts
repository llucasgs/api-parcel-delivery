import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { DeliveryLogsRepository } from "@/repositories/delivery-logs-repository";
import {
  showDeliveryLogSchema,
  ShowDeliveryLogDTO,
} from "@/schemas/deliveries-logs/show-delivery-log-schema";

export class ShowDeliveryLogsService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private deliveryLogsRepository: DeliveryLogsRepository
  ) {}

  async execute(data: ShowDeliveryLogDTO) {
    const { delivery_id, user_id, role } = showDeliveryLogSchema.parse(data);

    const delivery = await this.deliveriesRepository.findById(delivery_id);

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    // Cliente só pode ver entregas dele mesmo
    if (role === "customer" && delivery.userId !== user_id) {
      throw new AppError(
        "You are not allowed to view logs of another customer's delivery",
        403
      );
    }

    return this.deliveryLogsRepository.findManyByDeliveryId(delivery_id);
  }
}
