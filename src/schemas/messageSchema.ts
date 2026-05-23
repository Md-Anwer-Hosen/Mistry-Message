import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .max(200, { message: "meassage is no longer then 200 character" })
    .min(20, { message: "meassage must at least 20 character" }),
});
