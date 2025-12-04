import { SessionsService } from "@/services/sessions-service";
import { AppError } from "@/utils/AppError";

import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";

// MOCKS DE BIBLIOTECAS EXTERNAS
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

// MOCK DOS REPOSITORIES
const mockUsersRepository = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
});

const mockRefreshTokensRepository = () => ({
  create: jest.fn(),
  findByToken: jest.fn(),
  deleteById: jest.fn(),
});

// TEST SUITE
describe("SessionsService - unit", () => {
  let usersRepository: ReturnType<typeof mockUsersRepository>;
  let refreshTokensRepository: ReturnType<typeof mockRefreshTokensRepository>;
  let service: SessionsService;

  beforeEach(() => {
    jest.clearAllMocks();

    usersRepository = mockUsersRepository();
    refreshTokensRepository = mockRefreshTokensRepository();

    service = new SessionsService(usersRepository, refreshTokensRepository);

    // JWT determinístico
    (sign as jest.Mock).mockReturnValue("jwt_token_fake");

    // Refresh Token determinístico
    (randomUUID as jest.Mock).mockReturnValue(
      "11111111-2222-3333-4444-555555555555"
    );
  });

  // 1. LOGIN COM SUCESSO
  test("deve autenticar usuário com sucesso", async () => {
    const fakeUser = {
      id: "user123",
      name: "Lucas",
      email: "lucas@example.com",
      password: "hashed_password",
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    usersRepository.findByEmail.mockResolvedValue(fakeUser);
    (compare as jest.Mock).mockResolvedValue(true);

    refreshTokensRepository.create.mockResolvedValue({
      id: "ref123",
      token: "11111111-2222-3333-4444-555555555555",
      userId: fakeUser.id,
      expiresAt: new Date(Date.now() + 7 * 86400000),
    });

    const result = await service.execute({
      email: "lucas@example.com",
      password: "123456",
    });

    expect(result).toHaveProperty("access_token", "jwt_token_fake");
    expect(result).toHaveProperty(
      "refresh_token",
      "11111111-2222-3333-4444-555555555555"
    );

    expect(result.user.email).toBe("lucas@example.com");
    expect(result.user).not.toHaveProperty("password");
  });

  // 2. E-MAIL NÃO EXISTE
  test("deve falhar caso o e-mail não exista", async () => {
    usersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      service.execute({
        email: "wrong@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 3. SENHA INCORRETA
  test("deve falhar caso a senha esteja incorreta", async () => {
    usersRepository.findByEmail.mockResolvedValue({
      id: "123",
      email: "lucas@example.com",
      password: "hashed_password",
    });

    (compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.execute({
        email: "lucas@example.com",
        password: "errada",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 4. ZOD — DADOS INVÁLIDOS
  test("deve falhar caso os dados sejam inválidos (Zod)", async () => {
    await expect(
      service.execute({
        email: "email_invalido",
        password: "",
      })
    ).rejects.toThrow();
  });
});
