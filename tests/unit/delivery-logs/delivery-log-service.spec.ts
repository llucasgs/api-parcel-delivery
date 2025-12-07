import { DeliveryLogService } from "@/services/delivery-log-service";
import { AppError } from "@/utils/AppError";
import { DeliveryStatus } from "@prisma/client";

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

describe("DeliveryLogService - unit", () => {
  let deliveriesRepository: ReturnType<typeof mockDeliveriesRepository>;
  let logsRepository: ReturnType<typeof mockDeliveryLogsRepository>;
  let service: DeliveryLogService;

  const VALID_DELIVERY_ID = "11111111-2222-3333-4444-555555555555";
  const PERFORMED_BY = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

  const baseDelivery = {
    id: VALID_DELIVERY_ID,
    userId: PERFORMED_BY,
    description: "Pacote",
    status: DeliveryStatus.shipped,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    deliveriesRepository = mockDeliveriesRepository();
    logsRepository = mockDeliveryLogsRepository();

    service = new DeliveryLogService(deliveriesRepository, logsRepository);
  });

  // 1. SUCESSO
  test("deve criar um log manual com sucesso quando o usuário for SALE", async () => {
    deliveriesRepository.findById.mockResolvedValue(baseDelivery);

    logsRepository.create.mockResolvedValue({
      id: "log123",
      deliveryId: VALID_DELIVERY_ID,
      description: "Tentativa de entrega",
      performedBy: PERFORMED_BY,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.execute({
      delivery_id: VALID_DELIVERY_ID,
      description: "Tentativa de entrega",
      performedBy: PERFORMED_BY,
      role: "sale",
    });

    expect(result).toHaveProperty("id");
    expect(logsRepository.create).toHaveBeenCalledWith({
      deliveryId: VALID_DELIVERY_ID,
      description: "Tentativa de entrega",
      performedBy: PERFORMED_BY,
    });
  });

  // 2. SOMENTE SALE PODE CRIAR LOG
  test("deve impedir criação de log manual por CUSTOMER", async () => {
    deliveriesRepository.findById.mockResolvedValue(baseDelivery);

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        description: "Teste",
        performedBy: PERFORMED_BY,
        role: "customer",
      })
    ).rejects.toThrow("Only sales can create manual delivery logs");
  });

  // 3. ENTREGA NÃO EXISTE
  test("deve falhar caso a entrega não exista", async () => {
    deliveriesRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        description: "Log manual",
        performedBy: PERFORMED_BY,
        role: "sale",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 4. ENTREGA FINALIZADA — NÃO PERMITE LOG
  test("deve impedir criação de log quando status for 'delivered'", async () => {
    deliveriesRepository.findById.mockResolvedValue({
      ...baseDelivery,
      status: DeliveryStatus.delivered,
    });

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        description: "Tentativa pós-entrega",
        performedBy: PERFORMED_BY,
        role: "sale",
      })
    ).rejects.toThrow("Delivered orders cannot receive new logs");
  });

  // 5. ERRO DE VALIDAÇÃO — description vazio
  test("deve falhar com dados inválidos (Zod)", async () => {
    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        description: "",
        performedBy: PERFORMED_BY,
        role: "sale",
      })
    ).rejects.toThrow();
  });

  // 6. ERRO DE VALIDAÇÃO — delivery_id inválido
  test("deve falhar caso delivery_id seja inválido (Zod)", async () => {
    await expect(
      service.execute({
        delivery_id: "invalid-uuid",
        description: "Teste",
        performedBy: PERFORMED_BY,
        role: "sale",
      })
    ).rejects.toThrow();
  });
});
