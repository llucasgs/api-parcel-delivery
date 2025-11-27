import { DeliveryLog } from "@prisma/client";

export interface DeliveryLogsRepository {
  create(data: {
    deliveryId: string;
    description: string;
  }): Promise<DeliveryLog>;

  findManyByDeliveryId(deliveryId: string): Promise<DeliveryLog[]>;
}
