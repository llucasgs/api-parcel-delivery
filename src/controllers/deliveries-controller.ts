import { Request, Response } from "express";
import { DeliveryCreateService } from "@/services/delivery-create-service";
import { DeliveryListService } from "@/services/delivery-list-service";
import { PrismaDeliveriesRepository } from "@/repositories/prisma/prisma-deliveries-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ok, created } from "@/utils/response";

export class DeliveriesController {
  create = async (request: Request, response: Response) => {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const usersRepository = new PrismaUsersRepository();

    const service = new DeliveryCreateService(
      deliveriesRepository,
      usersRepository
    );

    const { user_id, description } = request.body;

    const delivery = await service.execute({ user_id, description });

    return response
      .status(201)
      .json(created("Delivery created successfully", delivery));
  };

  index = async (request: Request, response: Response) => {
    const deliveriesRepository = new PrismaDeliveriesRepository();
    const service = new DeliveryListService(deliveriesRepository);

    const deliveries = await service.execute();

    return response.json(ok("Deliveries fetched successfully", deliveries));
  };
}
