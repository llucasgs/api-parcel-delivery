import { ShowDeliveryLogsService } from "@/services/show-delivery-logs-service";
import { AppError } from "@/utils/AppError";

// Mock dos repositórios
const mockDeliveriesRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  updateStatus: jest.fn(),
});

const mockDeliveryLogsRepository = () => ({
  create: jest.fn(),
  findManyByDeliveryId: jest.fn(),
});

describe("ShowDeliveryLogsService - unit", () => {
  let deliveriesRepository: ReturnType<typeof mockDeliveriesRepository>;
  let logsRepository: ReturnType<typeof mockDeliveryLogsRepository>;
  let service: ShowDeliveryLogsService;

  const VALID_DELIVERY_ID = "11111111-2222-3333-4444-555555555555";
  const CUSTOMER_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
  const OTHER_CUSTOMER_ID = "99999999-8888-7777-6666-555555555555";

  const fakeDelivery = {
    id: VALID_DELIVERY_ID,
    userId: CUSTOMER_ID,
    description: "Pacote",
    status: "shipped",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const fakeLogs = [
    {
      id: "log1",
      deliveryId: VALID_DELIVERY_ID,
      description: "Saiu para entrega",
      performedBy: "user123",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    deliveriesRepository = mockDeliveriesRepository();
    logsRepository = mockDeliveryLogsRepository();

    service = new ShowDeliveryLogsService(deliveriesRepository, logsRepository);
  });

  // 1. SUCESSO PARA CUSTOMER DONO DA ENTREGA
  test("deve retornar logs com sucesso quando o cliente é o dono da entrega", async () => {
    deliveriesRepository.findById.mockResolvedValue(fakeDelivery);
    logsRepository.findManyByDeliveryId.mockResolvedValue(fakeLogs);

    const result = await service.execute({
      delivery_id: VALID_DELIVERY_ID,
      user_id: CUSTOMER_ID,
      role: "customer",
    });

    expect(result).toHaveLength(1);
    expect(result[0].description).toBe("Saiu para entrega");
    expect(logsRepository.findManyByDeliveryId).toHaveBeenCalledTimes(1);
  });

  // 2. SUCESSO PARA "sale" → pode ver qualquer entrega
  test("deve retornar logs com sucesso quando o usuário for 'sale'", async () => {
    deliveriesRepository.findById.mockResolvedValue(fakeDelivery);
    logsRepository.findManyByDeliveryId.mockResolvedValue(fakeLogs);

    const result = await service.execute({
      delivery_id: VALID_DELIVERY_ID,
      user_id: OTHER_CUSTOMER_ID, // irrelevant
      role: "sale",
    });

    expect(result).toHaveLength(1);
    expect(logsRepository.findManyByDeliveryId).toHaveBeenCalledTimes(1);
  });

  // 3. ENTREGA NÃO EXISTE
  test("deve falhar caso a entrega não exista", async () => {
    deliveriesRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        user_id: CUSTOMER_ID,
        role: "customer",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 4. CUSTOMER TENTA VER ENTREGA DE OUTRA PESSOA
  test("deve bloquear customer tentando acessar logs de entrega de outro usuário", async () => {
    deliveriesRepository.findById.mockResolvedValue(fakeDelivery);

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        user_id: OTHER_CUSTOMER_ID,
        role: "customer",
      })
    ).rejects.toThrow(
      "Forbidden: customers can only view their own delivery logs"
    );
  });

  // 5. ERRO DE VALIDAÇÃO ZOD — UUID inválido
  test("deve falhar com dados inválidos (Zod)", async () => {
    await expect(
      service.execute({
        delivery_id: "invalid",
        user_id: "invalid",
        role: "customer",
      })
    ).rejects.toThrow();
  });
});
