import { z } from "zod";

import type { ValidationSchema } from "../../middleware/validateRequest";

const uuid = () => z.string().uuid();

const roles = ["GUEST", "USER", "ADMIN"] as const;
const listingStatuses = ["ACTIVE", "ARCHIVED", "SOLD"] as const;

export const listUsersQuerySchema: ValidationSchema = {
  query: z.object({
    search: z.string().max(120).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional()
  })
};

export const updateUserRoleSchema: ValidationSchema = {
  params: z.object({ id: uuid() }),
  body: z.object({
    role: z.enum(roles)
  })
};

export const listingModerationSchema: ValidationSchema = {
  params: z.object({ id: uuid() }),
  body: z.object({
    status: z.enum(listingStatuses)
  })
};

export const listingIdParamSchema: ValidationSchema = {
  params: z.object({ id: uuid() })
};
