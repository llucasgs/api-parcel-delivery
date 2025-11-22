import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class DeliveriesStatusController {
  update = async (request: Request, response: Response) => {
    const paramsSchema = z.object({
      // ID da entrega que será atualizada
      id: z.string({ required_error: "Deliveries ID is required!" }).uuid(),
    });

    const bodySchema = z.object({
      status: z.enum(["processing", "shipped", "delivered"]),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.findUnique({ where: { id } });

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    await prisma.delivery.update({
      data: {
        status,
      },
      where: {
        id,
      },
    });

    return response.json();
  };
}

export { DeliveriesStatusController };
