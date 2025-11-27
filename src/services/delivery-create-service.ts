import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { UsersRepository } from "@/repositories/users-repository";

import {
  deliveryCreateSchema,
  DeliveryCreateDTO,
} from "@/schemas/deliveries/delivery-schema";

export class DeliveryCreateService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute(data: DeliveryCreateDTO) {
    // 1. Validar entrada com schema externo
    const { user_id, description } = deliveryCreateSchema.parse(data);

    // 2. Validar se o usuário existe
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError("Customer not found", 404);
    }

    // 3. Criar entrega
    const delivery = await this.deliveriesRepository.create({
      user: { connect: { id: user_id } },
      description,
    });

    return delivery;
  }
}
