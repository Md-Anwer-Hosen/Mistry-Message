import { z } from "zod";

export const userNamevalidation = z
  .string()
  .min(3, "UserName must be at least 3 characters")
  .max(15, "UserName not more than 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "User name can not contain any special character");

export const signUpSchema = z.object({
  username: userNamevalidation,

  email: z.string().email({
    message: "Invalid email address",
  }),

  password: z
    .string()
    .min(10, {
      message: "Password must be greater than 10 characters",
    })
    .max(20, {
      message: "Password must not exceed 20 characters",
    }),
});
