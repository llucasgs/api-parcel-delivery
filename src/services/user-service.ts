import { hash } from "bcrypt";
import { UsersRepository } from "@/repositories/users-repository";
import { AppError } from "@/utils/AppError";
import { createUserSchema, CreateUserDTO } from "@/schemas/users/user-schema";

export class UserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(data: CreateUserDTO) {
    // 1. Validação com Zod
    const { name, email, password } = createUserSchema.parse(data);

    // 2. Garantir que não exista usuário com o mesmo e-mail
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("User with same e-mail already exists", 400);
    }

    // 3. Hash da senha
    const hashedPassword = await hash(password, 8);

    // 4. Criar usuário
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Remover senha antes de retornar
    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
