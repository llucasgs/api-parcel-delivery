import { prisma } from "@/database/prisma";
import { DeliveryLogsRepository } from "../delivery-logs-repository";
import { DeliveryLog } from "@prisma/client";

export class PrismaDeliveryLogsRepository implements DeliveryLogsRepository {
  async create(data: {
    deliveryId: string;
    description: string;
    performedBy: string;
  }): Promise<DeliveryLog> {
    return prisma.deliveryLog.create({ data });
  }

  async findManyByDeliveryId(deliveryId: string): Promise<DeliveryLog[]> {
    return prisma.deliveryLog.findMany({
      where: { deliveryId },
      orderBy: { createdAt: "asc" },
    });
  }
}
