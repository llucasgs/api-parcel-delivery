import { Request, Response } from "express";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaRefreshTokensRepository } from "@/repositories/prisma/prisma-refresh-tokens-repository";
import { SessionsService } from "@/services/sessions-service";
import { ok } from "@/utils/response";

class SessionsController {
  create = async (request: Request, response: Response) => {
    const usersRepository = new PrismaUsersRepository();
    const refreshTokensRepository = new PrismaRefreshTokensRepository();

    const service = new SessionsService(
      usersRepository,
      refreshTokensRepository
    );

    const result = await service.execute(request.body);

    return response
      .status(200)
      .json(ok("User authenticated successfully", result));
  };
}

export { SessionsController };
