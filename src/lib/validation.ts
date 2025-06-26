import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email diperlukan"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email diperlukan"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
