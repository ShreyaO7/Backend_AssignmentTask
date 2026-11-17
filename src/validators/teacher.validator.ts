import { z } from "zod";

export const createTeacherSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(1, "fullName is required"),
    email: z.string().trim().email("email is not valid"),
    specialization: z.string().trim().min(1, "specialization is required"),
    experience: z.number().nonnegative("experience cannot be negative"),
  }),
});
