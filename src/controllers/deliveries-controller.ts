// deliveries-controller.ts
import { Request, Response } from "express";
import { DeliveryCreateService } from "@/services/delivery-create-service";
import { DeliveryListService } from "@/services/delivery-List-Service";
import { PrismaDeliveriesRepository } from "@/repositories/prisma-deliveries-repository";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

export class DeliveriesController {
  async create(request: Request, response: Response) {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const usersRepository = new PrismaUsersRepository();

    const service = new DeliveryCreateService(
      deliveriesRepository,
      usersRepository
    );

    const { user_id, description } = request.body;

    const delivery = await service.execute({ user_id, description });

    return response.status(201).json(delivery);
  }

  async index(request: Request, response: Response) {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const service = new DeliveryListService(deliveriesRepository);

    const deliveries = await service.execute();

    return response.json(deliveries);
  }
}
