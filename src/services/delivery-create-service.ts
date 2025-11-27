import { AppError } from "@/utils/AppError";
import { DeliveriesRepository } from "@/repositories/deliveries-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { z } from "zod";

export class DeliveryCreateService {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute(data: { user_id: string; description: string }) {
    const schema = z.object({
      user_id: z.string().uuid(),
      description: z.string().min(1),
    });

    const { user_id, description } = schema.parse(data);

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Customer not found", 404);
    }

    return this.deliveriesRepository.create({
      user: { connect: { id: user_id } },
      description,
    });
  }
}
