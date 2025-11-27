import { Request, Response } from "express";
import { RefreshTokenService } from "@/services/refresh-token-service";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaRefreshTokensRepository } from "@/repositories/prisma/prisma-refresh-tokens-repository";
import { ok } from "@/utils/response";

export class RefreshTokenController {
  handle = async (request: Request, response: Response) => {
    const { refresh_token } = request.body;

    const usersRepository = new PrismaUsersRepository();
    const refreshTokensRepository = new PrismaRefreshTokensRepository();

    const service = new RefreshTokenService(
      usersRepository,
      refreshTokensRepository
    );

    const result = await service.execute({ refresh_token });

    return response.json(ok("Token refreshed successfully", result));
  };
}
