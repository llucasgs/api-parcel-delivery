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
    status: DeliveryStatus.shipped, // status válido para log
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
  test("deve criar um log com sucesso", async () => {
    deliveriesRepository.findById.mockResolvedValue(baseDelivery);

    logsRepository.create.mockResolvedValue({
      id: "log123",
      deliveryId: baseDelivery.id,
      description: "Saiu para entrega",
      performedBy: PERFORMED_BY,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.execute({
      delivery_id: VALID_DELIVERY_ID,
      description: "Saiu para entrega",
      performedBy: PERFORMED_BY,
    });

    expect(result).toHaveProperty("id");
    expect(logsRepository.create).toHaveBeenCalledWith({
      deliveryId: VALID_DELIVERY_ID,
      description: "Saiu para entrega",
      performedBy: PERFORMED_BY,
    });
  });

  // 2. ENTREGA NÃO EXISTE
  test("deve falhar caso a entrega não exista", async () => {
    deliveriesRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        description: "Teste",
        performedBy: PERFORMED_BY,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 3. STATUS = processing → bloqueado
  test("deve impedir log quando status for 'processing'", async () => {
    deliveriesRepository.findById.mockResolvedValue({
      ...baseDelivery,
      status: DeliveryStatus.processing,
    });

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        description: "Teste",
        performedBy: PERFORMED_BY,
      })
    ).rejects.toThrow("Change status to shipped first");
  });

  // 4. STATUS = delivered → bloqueado
  test("deve impedir log quando status for 'delivered'", async () => {
    deliveriesRepository.findById.mockResolvedValue({
      ...baseDelivery,
      status: DeliveryStatus.delivered,
    });

    await expect(
      service.execute({
        delivery_id: VALID_DELIVERY_ID,
        description: "Teste",
        performedBy: PERFORMED_BY,
      })
    ).rejects.toThrow("This order has already been delivered");
  });

  // 5. VALIDAÇÃO ZOD
  test("deve falhar com dados inválidos (Zod)", async () => {
    await expect(
      service.execute({
        delivery_id: "invalid",
        description: "",
        performedBy: "not-uuid",
      })
    ).rejects.toThrow();
  });
});
