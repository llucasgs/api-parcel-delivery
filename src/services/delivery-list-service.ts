import { DeliveriesRepository } from "@/repositories/deliveries-repository";

export class DeliveryListService {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute() {
    const deliveries = await this.deliveriesRepository.findAll();

    return deliveries;
  }
}
