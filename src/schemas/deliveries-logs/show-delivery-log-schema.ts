import { z } from "zod";

export const showDeliveryLogSchema = z.object({
  delivery_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(["sale", "customer"]),
});

export type ShowDeliveryLogDTO = z.infer<typeof showDeliveryLogSchema>;
