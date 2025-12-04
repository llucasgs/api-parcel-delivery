import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { UsersRepository } from "@/repositories/users-repository";
import { RefreshTokensRepository } from "@/repositories/refresh-tokens-repository";

import { AppError } from "@/utils/AppError";
import { authConfig } from "@/config/auth";

import {
  sessionLoginSchema,
  SessionLoginDTO,
} from "@/schemas/sessions/session-schema";

import { randomUUID } from "crypto";

export class SessionsService {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokensRepository: RefreshTokensRepository
  ) {}

  async execute(data: SessionLoginDTO) {
    // 1. Validação do DTO com Zod
    const { email, password } = sessionLoginSchema.parse(data);

    // 2. Buscar usuário
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid e-mail or password", 401);
    }

    // 3. Validar senha
    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new AppError("Invalid e-mail or password", 401);
    }

    // 4. Gerar Access Token
    const { secret, expiresIn } = authConfig.jwt;

    const access_token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    // 5. Gerar Refresh Token
    const refresh_token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 dias

    await this.refreshTokensRepository.create({
      userId: user.id,
      token: refresh_token,
      expiresAt,
    });

    // 6. Remover senha antes do retorno
    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      access_token,
      refresh_token,
    };
  }
}
