import { RefreshToken } from "@prisma/client";

export interface RefreshTokensRepository {
  create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;

  findByToken(token: string): Promise<RefreshToken | null>;

  deleteById(id: string): Promise<void>;
}
