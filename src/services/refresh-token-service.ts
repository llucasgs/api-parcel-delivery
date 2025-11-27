import { sign } from "jsonwebtoken";

import { AppError } from "@/utils/AppError";
import { authConfig } from "@/config/auth";

import { UsersRepository } from "@/repositories/users-repository";
import { RefreshTokensRepository } from "@/repositories/refresh-tokens-repository";

import {
  refreshTokenSchema,
  RefreshTokenDTO,
} from "@/schemas/sessions/refresh-token-schema";

export class RefreshTokenService {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokensRepository: RefreshTokensRepository
  ) {}

  async execute(data: RefreshTokenDTO) {
    // 1. Validar dados
    const { refresh_token } = refreshTokenSchema.parse(data);

    // 2. Buscar token existente
    const storedToken = await this.refreshTokensRepository.findByToken(
      refresh_token
    );

    if (!storedToken) {
      throw new AppError("Refresh token not found", 401);
    }

    // 3. Validar expiração
    if (storedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token expired", 401);
    }

    // 4. Buscar usuário dono do token
    const user = await this.usersRepository.findById(storedToken.userId);

    if (!user) {
      throw new AppError("User no longer exists", 404);
    }

    // 5. Gerar novo Access Token
    const access_token = sign({ role: user.role }, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    // 6. Criar novo Refresh Token
    const newRefreshToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 dias

    const createdRefreshToken = await this.refreshTokensRepository.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt,
    });

    // 7. Remover token antigo
    await this.refreshTokensRepository.deleteById(storedToken.id);

    // 8. Retornar dados seguros
    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      access_token,
      refresh_token: createdRefreshToken.token,
    };
  }
}
