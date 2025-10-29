import { z } from "zod";

import type { ValidationSchema } from "../../middleware/validateRequest";

export const registerSchema: ValidationSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().min(2).max(50)
  })
};

export const loginSchema: ValidationSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
};

export const refreshSchema: ValidationSchema = {
  body: z.object({
    refreshToken: z.string().min(10)
  })
};

export const logoutSchema = refreshSchema;
