import { z } from "zod";
import { UsersRepository } from "@/repositories/users-repository";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";

export class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(data: { name: string; email: string; password: string }) {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = schema.parse(data);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new AppError("User with same e-mail already exists", 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
