import { DeliveriesRepository } from "@/repositories/deliveries-repository";

export class DeliveryListService {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute() {
    return this.deliveriesRepository.findAll();
  }
}
