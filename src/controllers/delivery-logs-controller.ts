import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class DeliveryLogsController {
  create = async (request: Request, response: Response) => {
    const bodySchema = z.object({
      // ID da entrega
      delivery_id: z
        .string({ required_error: "Deliveries ID is required!" })
        .uuid(),
      // Descrição para acompanhamento do pedido
      description: z.string({
        required_error: "Write a description for tracking the delivery.",
      }),
    });

    const { delivery_id, description } = bodySchema.parse(request.body);

    // Verifica se a entrega existe
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    if (delivery.status === "delivered") {
      throw new AppError("This order has already been delivered");
    }

    if (delivery.status === "processing") {
      throw new AppError("Change status to shipped");
    }

    const log = await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });

    return response.status(201).json();
  };

  show = async (request: Request, response: Response) => {
    const paramsSchema = z.object({
      // ID da entrega
      delivery_id: z
        .string({ required_error: "Deliveries ID is required!" })
        .uuid(),
    });

    const { delivery_id } = paramsSchema.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
      include: {
        user: true,
        logs: true,
      },
    });

    if (
      request.user?.role === "customer" &&
      request.user.id !== delivery?.userId
    ) {
      throw new AppError(
        "Forbidden: insufficient permissions. The user can only view their deliveries",
        401
      );
    }

    return response.json(delivery);
  };
}

export { DeliveryLogsController };
