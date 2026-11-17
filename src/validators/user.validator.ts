import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(1, "fullName is required"),
    email: z.string().trim().email("email is not valid"),
    phone: z.string().trim().min(10, "phone must be at least 10 digits"),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid user id"),
  }),
});
