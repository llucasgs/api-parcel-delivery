import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UsersRepository } from "@/repositories/users-repository";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/config/auth";

export class SessionsService {
  constructor(private usersRepository: UsersRepository) {}

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

    // 3. Gerar token
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    // 4. Remover senha
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
