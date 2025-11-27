import { z } from "zod";

export const deliveryCreateSchema = z.object({
  user_id: z.string().uuid(),
  description: z.string().min(1),
});

export type DeliveryCreateDTO = z.infer<typeof deliveryCreateSchema>;
