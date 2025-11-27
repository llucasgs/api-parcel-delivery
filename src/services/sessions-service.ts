import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UsersRepository } from "@/repositories/users-repository";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/config/auth";
import { RefreshTokensRepository } from "@/repositories/refresh-tokens-repository";

export class SessionsService {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokensRepository: RefreshTokensRepository
  ) {}

  async execute(data: { email: string; password: string }) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = schema.parse(data);

    // 1. Buscar usuário
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid e-mail or password", 401);
    }

    // 2. Comparar senha
    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError("Invalid e-mail or password", 401);
    }

    // 3. Gerar Access Token
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    // 4. Gerar Refresh Token
    const refresh_token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 dias

    await this.refreshTokensRepository.create({
      userId: user.id,
      token: refresh_token,
      expiresAt,
    });

    // 5. Remover senha
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token: token,
      refresh_token,
    };
  }
}
