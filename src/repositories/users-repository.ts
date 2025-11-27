import { User } from "@prisma/client";

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User>;
}

// Não criamos um SessionsRepository porque o UsersRepository já serve. Mais simples. Mais limpo. Mais claro. Por quê? Porque, na prática, o login só precisa de buscar usuário pelo e-mail, por isso reaproveitamos.
