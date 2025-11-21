import { Request, Response } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { sign } from "jsonwebtoken";
import { authConfig } from "@/config/auth";

class SessionsController {
  create = async (request: Request, response: Response) => {
    const bodySchema = z.object({
      email: z.string({ required_error: "e-mail is required!" }).email(),
      password: z.string({ required_error: "password is required!" }).min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Invalid e-mail or password", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Invalid e-mail or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json({
      user: userWithoutPassword,
      token,
    });
  };
}

export { SessionsController };
