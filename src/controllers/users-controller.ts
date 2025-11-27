import { Request, Response } from "express";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { UserService } from "@/services/user-service";

class UsersController {
  create = async (request: Request, response: Response) => {
    const repository = new PrismaUsersRepository();
    const service = new UserService(repository);

    const user = await service.execute(request.body);

    return response.status(201).json(user);
  };
}

export { UsersController };
