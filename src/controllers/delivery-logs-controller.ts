import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class DeliveryLogsController {
  create = async (request: Request, response: Response) => {
    // Validar params
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

    if (delivery.status === "processing") {
      throw new AppError("Change status to shipped");
    }

    const logs = await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });

    return response.status(201).json();
  };
}

export { DeliveryLogsController };
