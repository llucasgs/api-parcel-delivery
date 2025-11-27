import { prisma } from "@/database/prisma";
import { RefreshTokensRepository } from "./refresh-tokens-repository";
import { RefreshToken } from "@prisma/client";

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { id },
    });
  }
}
