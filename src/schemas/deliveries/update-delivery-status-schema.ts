import { z } from "zod";
import { DeliveryStatus } from "@prisma/client";

export const deliveryUpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(DeliveryStatus),
  performedBy: z.string().uuid(),
});

export type DeliveryUpdateStatusDTO = z.infer<
  typeof deliveryUpdateStatusSchema
>;
