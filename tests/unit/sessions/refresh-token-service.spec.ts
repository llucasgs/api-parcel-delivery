import { RefreshTokenService } from "@/services/refresh-token-service";
import { AppError } from "@/utils/AppError";
import { sign } from "jsonwebtoken";
import * as crypto from "crypto";

// MOCKS DE BIBLIOTECAS EXTERNAS
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

// MOCK COMPLETO DO CRYPTO
jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

const cryptoMock = crypto as jest.Mocked<typeof crypto>;

// MOCKS DE REPOSITORIES
const mockUsersRepository = () => ({
  findById: jest.fn(),
  findByEmail: jest.fn(), // não usado, mas mantido por compatibilidade
  create: jest.fn(),
});

const mockRefreshTokensRepository = () => ({
  findByToken: jest.fn(),
  create: jest.fn(),
  deleteById: jest.fn(),
});

// TESTES
describe("RefreshTokenService - unit", () => {
  let usersRepository: ReturnType<typeof mockUsersRepository>;
  let refreshTokensRepository: ReturnType<typeof mockRefreshTokensRepository>;
  let service: RefreshTokenService;

  const VALID_OLD_TOKEN = "11111111-2222-3333-4444-555555555555";
  const VALID_NEW_TOKEN = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

  const fakeUser = {
    id: "user123",
    name: "Lucas",
    email: "lucas@example.com",
    password: "hashed_password",
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    usersRepository = mockUsersRepository();
    refreshTokensRepository = mockRefreshTokensRepository();

    service = new RefreshTokenService(usersRepository, refreshTokensRepository);

    // JWT fixo
    (sign as jest.Mock).mockReturnValue("jwt_token_fake");

    // Mock controlado de UUID
    cryptoMock.randomUUID.mockReturnValue(VALID_NEW_TOKEN);
  });

  // 1. SUCESSO
  test("deve renovar refresh token com sucesso", async () => {
    refreshTokensRepository.findByToken.mockResolvedValue({
      id: "oldTokenId",
      token: VALID_OLD_TOKEN,
      userId: fakeUser.id,
      expiresAt: new Date(Date.now() + 10000), // válido
    });

    usersRepository.findById.mockResolvedValue(fakeUser);

    refreshTokensRepository.create.mockResolvedValue({
      id: "newTokenId",
      token: VALID_NEW_TOKEN,
      userId: fakeUser.id,
      expiresAt: new Date(),
    });

    const result = await service.execute({
      refresh_token: VALID_OLD_TOKEN,
    });

    expect(result.access_token).toBe("jwt_token_fake");
    expect(result.refresh_token).toBe(VALID_NEW_TOKEN);
    expect(result.user.email).toBe("lucas@example.com");
  });

  // 2. TOKEN NÃO EXISTE
  test("deve falhar quando refresh token não existir", async () => {
    refreshTokensRepository.findByToken.mockResolvedValue(null);

    await expect(
      service.execute({ refresh_token: VALID_OLD_TOKEN })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 3. TOKEN EXPIRADO
  test("deve falhar quando refresh token estiver expirado", async () => {
    refreshTokensRepository.findByToken.mockResolvedValue({
      id: "token123",
      token: VALID_OLD_TOKEN,
      userId: "user123",
      expiresAt: new Date(Date.now() - 1000), // já expirado
    });

    await expect(
      service.execute({
        refresh_token: VALID_OLD_TOKEN,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 4. USUÁRIO NÃO EXISTE
  test("deve falhar caso o usuário não exista mais", async () => {
    refreshTokensRepository.findByToken.mockResolvedValue({
      id: "token123",
      token: VALID_OLD_TOKEN,
      userId: "userNotFound",
      expiresAt: new Date(Date.now() + 10000),
    });

    usersRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        refresh_token: VALID_OLD_TOKEN,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 5. ERRO DE VALIDAÇÃO ZOD (token inválido)
  test("deve falhar caso o refresh_token seja inválido (Zod)", async () => {
    await expect(
      service.execute({
        refresh_token: "invalid",
      })
    ).rejects.toThrow(); // ZodError
  });
});
