import { UserService } from "@/services/user-service";
import { AppError } from "@/utils/AppError";

// Mock do repositório
const mockUsersRepository = () => {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
};

describe("UserService - unit", () => {
  let usersRepository: ReturnType<typeof mockUsersRepository>;
  let service: UserService;

  beforeEach(() => {
    usersRepository = mockUsersRepository();
    service = new UserService(usersRepository);
  });

  describe("create user", () => {
    test("deve criar um usuário com sucesso", async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      usersRepository.create.mockResolvedValue({
        id: "123",
        name: "Lucas",
        email: "lucas@example.com",
        password: "hashed_password",
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.execute({
        name: "Lucas",
        email: "lucas@example.com",
        password: "123456",
      });

      expect(result).toHaveProperty("id");
      expect(result.email).toBe("lucas@example.com");
      expect(result).not.toHaveProperty("password");
    });

    test("não deve permitir criar usuário com e-mail já existente", async () => {
      usersRepository.findByEmail.mockResolvedValue({
        id: "123",
        name: "Lucas",
        email: "lucas@example.com",
        password: "hashed",
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.execute({
          name: "Lucas",
          email: "lucas@example.com",
          password: "123456",
        })
      ).rejects.toThrow("User with same e-mail already exists");
    });

    test("deve falhar ao enviar dados inválidos (Zod)", async () => {
      await expect(
        service.execute({
          name: "",
          email: "email_invalido",
          password: "123",
        })
      ).rejects.toThrow();
    });
  });
});
