import { z } from "zod";

export const refreshTokenSchema = z.object({
  refresh_token: z.string().uuid("Invalid token format"),
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
