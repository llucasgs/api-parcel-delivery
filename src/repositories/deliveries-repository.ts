import { Delivery, Prisma, DeliveryStatus } from "@prisma/client";

export interface DeliveriesRepository {
  create(data: Prisma.DeliveryCreateInput): Promise<Delivery>;
  findById(id: string): Promise<Delivery | null>;
  findAll(): Promise<Delivery[]>;
  updateStatus(id: string, status: DeliveryStatus): Promise<Delivery>;
}
