import { prisma } from "@/database/prisma";
import { UsersRepository } from "../users-repository";
import { User } from "@prisma/client";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  }
}
