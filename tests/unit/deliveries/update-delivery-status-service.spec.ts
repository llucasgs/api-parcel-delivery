import { UpdateDeliveryStatusService } from "@/services/update-delivery-status-service";
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

describe("UpdateDeliveryStatusService - unit", () => {
  let deliveriesRepository: ReturnType<typeof mockDeliveriesRepository>;
  let logsRepository: ReturnType<typeof mockDeliveryLogsRepository>;
  let service: UpdateDeliveryStatusService;

  const VALID_ID = "11111111-2222-3333-4444-555555555555";
  const VALID_USER = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

  const fakeDelivery = {
    id: VALID_ID,
    userId: VALID_USER,
    description: "Pacote",
    status: "processing",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    deliveriesRepository = mockDeliveriesRepository();
    logsRepository = mockDeliveryLogsRepository();

    service = new UpdateDeliveryStatusService(
      deliveriesRepository,
      logsRepository
    );
  });

  // 1. SUCESSO
  test("deve atualizar status da entrega e gerar log", async () => {
    deliveriesRepository.findById.mockResolvedValue(fakeDelivery);

    deliveriesRepository.updateStatus.mockResolvedValue({
      ...fakeDelivery,
      status: "shipped",
    });

    logsRepository.create.mockResolvedValue({
      id: "log123",
      deliveryId: fakeDelivery.id,
      description: "shipped",
      performedBy: VALID_USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.execute({
      id: VALID_ID,
      status: "shipped",
      performedBy: VALID_USER,
    });

    expect(result.status).toBe("shipped");
    expect(deliveriesRepository.updateStatus).toHaveBeenCalledWith(
      VALID_ID,
      "shipped"
    );

    expect(logsRepository.create).toHaveBeenCalledWith({
      deliveryId: VALID_ID,
      description: "shipped",
      performedBy: VALID_USER,
    });
  });

  // 2. ENTREGA NÃO ENCONTRADA
  test("deve falhar caso a entrega não exista", async () => {
    deliveriesRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        id: VALID_ID,
        status: "shipped",
        performedBy: VALID_USER,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  // 3. VALIDAÇÃO ZOD
  test("deve falhar caso os dados sejam inválidos (Zod)", async () => {
    await expect(
      service.execute({
        id: "invalid-uuid",
        status: "INVALID_STATUS",
        performedBy: "not-an-uuid",
      })
    ).rejects.toThrow(); // ZodError
  });
});
