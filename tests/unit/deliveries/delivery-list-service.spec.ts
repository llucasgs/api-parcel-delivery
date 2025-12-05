import { DeliveryListService } from "@/services/delivery-list-service";

// Mock completo para respeitar a interface DeliveriesRepository
const mockDeliveriesRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  updateStatus: jest.fn(),
});

describe("DeliveryListService - unit", () => {
  let deliveriesRepository: ReturnType<typeof mockDeliveriesRepository>;
  let service: DeliveryListService;

  const fakeDeliveries = [
    {
      id: "11111111-2222-3333-4444-555555555555",
      userId: "99999999-8888-7777-6666-555555555555",
      description: "Pacote 1",
      status: "processing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      userId: "99999999-8888-7777-6666-555555555555",
      description: "Pacote 2",
      status: "shipped",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    deliveriesRepository = mockDeliveriesRepository();
    service = new DeliveryListService(deliveriesRepository);
  });

  // ENTREGAS QUE EXISTEM
  test("deve listar todas as entregas com sucesso", async () => {
    deliveriesRepository.findAll.mockResolvedValue(fakeDeliveries);

    const result = await service.execute();

    expect(result).toHaveLength(2);
    expect(result[0].description).toBe("Pacote 1");
    expect(deliveriesRepository.findAll).toHaveBeenCalledTimes(1);
  });

  // ENTREGAS QUE NÃO EXISTEM
  test("deve retornar lista vazia caso não existam entregas", async () => {
    deliveriesRepository.findAll.mockResolvedValue([]);

    const result = await service.execute();

    expect(result).toEqual([]);
    expect(deliveriesRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
