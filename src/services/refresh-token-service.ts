import { AppError } from "@/utils/AppError";
import { sign } from "jsonwebtoken";
import { z } from "zod";

import { UsersRepository } from "@/repositories/users-repository";
import { RefreshTokensRepository } from "@/repositories/refresh-tokens-repository";
import { authConfig } from "@/config/auth";

export class RefreshTokenService {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokensRepository: RefreshTokensRepository
  ) {}

  async execute(data: { refresh_token: string }) {
    // 1. Valida a entrada
    const schema = z.object({
      refresh_token: z.string().uuid("Invalid refresh token format"),
    });

    const { refresh_token } = schema.parse(data);

    // 2. Busca o refresh token no banco
    const storedToken = await this.refreshTokensRepository.findByToken(
      refresh_token
    );

    if (!storedToken) {
      throw new AppError("Refresh token not found", 401);
    }

    // 3. Verifica a expiração
    const isExpired = storedToken.expiresAt < new Date();
    if (isExpired) {
      throw new AppError("Refresh token expired", 401);
    }

    // 4. Busca o usuário
    const user = await this.usersRepository.findById(storedToken.userId);
    if (!user) {
      throw new AppError("User no longer exists", 404);
    }

    // 5. Gera um novo JWT
    const jwtToken = sign({ role: user.role }, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    // 6. Cria um novo refresh token
    const newRefreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 dias

    const createdRefreshToken = await this.refreshTokensRepository.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt,
    });

    // 7. Apaga o refresh token antigo
    await this.refreshTokensRepository.deleteById(storedToken.id);

    // 8. Retorna para o front
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: jwtToken,
      refresh_token: createdRefreshToken.token,
    };
  }
}
