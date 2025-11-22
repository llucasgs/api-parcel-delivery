import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class DeliveriesController {
  create = async (request: Request, response: Response) => {
    const bodySchema = z.object({
      // ID do usuário (customer) para o qual o pedido vai ser enviado
      user_id: z
        .string({ required_error: "The customer user ID is required!" })
        .uuid(),
      // Descrição do que está sendo enviado
      description: z.string({
        required_error: "A description of what is being sent is required!",
      }),
    });

    const { user_id, description } = bodySchema.parse(request.body);

    await prisma.delivery.create({
      data: {
        userId: user_id,
        description,
      },
    });

    return response.status(201).json();
  };
}

export { DeliveriesController };
