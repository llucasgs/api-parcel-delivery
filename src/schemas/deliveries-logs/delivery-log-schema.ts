import { z } from "zod";

export const createDeliveryLogSchema = z.object({
  delivery_id: z.string().uuid(),
  description: z.string().min(1),
  performedBy: z.string().uuid(),
});

export type CreateDeliveryLogDTO = z.infer<typeof createDeliveryLogSchema>;
