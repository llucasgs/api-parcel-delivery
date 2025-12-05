import { prisma } from "@/database/prisma";
import { DeliveriesRepository } from "../deliveries-repository";
import { Delivery, Prisma, DeliveryStatus } from "@prisma/client";

export class PrismaDeliveriesRepository implements DeliveriesRepository {
  async create(data: Prisma.DeliveryCreateInput): Promise<Delivery> {
    return prisma.delivery.create({ data });
  }

  async findById(id: string): Promise<Delivery | null> {
    return prisma.delivery.findUnique({ where: { id } });
  }

  async findAll(): Promise<Delivery[]> {
    return prisma.delivery.findMany({
      include: {
        user: { select: { name: true, email: true } },
        logs: true,
      },
    });
  }

  async updateStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
    return prisma.delivery.update({
      where: { id },
      data: { status },
    });
  }
}
