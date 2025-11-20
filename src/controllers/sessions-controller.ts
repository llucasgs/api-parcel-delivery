import { Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcrypt";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

class SessionsController {
  create = async (request: Request, response: Response) => {
    return response.status(201).json({ message: "ok" });
  };
}

export { SessionsController };
