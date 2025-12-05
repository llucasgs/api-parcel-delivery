import { DeliveryCreateService } from "@/services/delivery-create-service";
import { AppError } from "@/utils/AppError";

// --- MOCKS DE REPOSITORIES ---
const mockDeliveriesRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  updateStatus: jest.fn(),
});

const mockUsersRepository = () => ({
  findById: jest.fn(),
  findByEmail: jest.fn(), // compatibilidade
  create: jest.fn(),
});

describe("DeliveryCreateService - unit", () => {
  let deliveriesRepository: ReturnType<typeof mockDeliveriesRepository>;
  let usersRepository: ReturnType<typeof mockUsersRepository>;
  let service: DeliveryCreateService;

  // UUID válido para todos os testes
  const VALID_USER_ID = "11111111-2222-3333-4444-555555555555";

  const fakeUser = {
    id: VALID_USER_ID,
    name: "Lucas",
    email: "lucas@example.com",
    password: "hashed",
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const fakeDelivery = {
    id: "99999999-8888-7777-6666-555555555555",
    userId: VALID_USER_ID,
    description: "Caixa pequena",
    status: "processing",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    deliveriesRepository = mockDeliveriesRepository();
    usersRepository = mockUsersRepository();

    service = new DeliveryCreateService(deliveriesRepository, usersRepository);
  });

  // SUCESSO
  test("deve criar uma entrega com sucesso", async () => {
    usersRepository.findById.mockResolvedValue(fakeUser);

    deliveriesRepository.create.mockResolvedValue(fakeDelivery);

    const result = await service.execute({
      user_id: VALID_USER_ID,
      description: "Caixa pequena",
    });

    expect(result).toHaveProperty("id");
    expect(result.description).toBe("Caixa pequena");
    expect(deliveriesRepository.create).toHaveBeenCalledTimes(1);
  });

  // USUÁRIO NÃO EXISTE
  test("deve falhar caso o usuário não exista", async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        user_id: VALID_USER_ID,
        description: "Pacote",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // ERRO DE VALIDAÇÃO DO ZOD
  test("deve falhar caso os dados sejam inválidos (Zod)", async () => {
    await expect(
      service.execute({
        user_id: "123", // inválido -> não é UUID
        description: "",
      })
    ).rejects.toThrow();
  });
});
