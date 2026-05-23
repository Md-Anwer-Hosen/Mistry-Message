import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().length(6, "identifire must be 6 digit"),
  password: z.string().length(6, "verification code must be 6 digit"),
});
