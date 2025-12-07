import { z } from "zod";

export const createDeliveryLogSchema = z.object({
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, "Description cannot be empty"),
});

export type CreateDeliveryLogDTO = z.infer<typeof createDeliveryLogSchema>;
