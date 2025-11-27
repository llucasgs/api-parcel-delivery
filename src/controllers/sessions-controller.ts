import { Request, Response } from "express";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { SessionsService } from "@/services/sessions-service";

class SessionsController {
  create = async (request: Request, response: Response) => {
    const usersRepository = new PrismaUsersRepository();
    const service = new SessionsService(usersRepository);

    const result = await service.execute(request.body);

    return response.status(201).json(result);
  };
}

export { SessionsController };
