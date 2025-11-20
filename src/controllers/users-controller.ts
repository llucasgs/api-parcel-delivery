import { Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcrypt";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class UsersController {
  create = async (request: Request, response: Response) => {
    const bodySchema = z.object({
      name: z.string({ required_error: "name is required!" }).trim().min(2),
      email: z.string({ required_error: "e-mail is required!" }).email(),
      password: z.string({ required_error: "password is required!" }).min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("User with same e-mail already exists");
    }

    const hashedPassword = await hash(password, 8); // Criptografa a senha.

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  };
}

export { UsersController };
