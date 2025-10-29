import { z } from "zod";

import type { ValidationSchema } from "../../middleware/validateRequest";

const uuid = () => z.string().uuid();

export const updateProfileSchema: ValidationSchema = {
  body: z.object({
    displayName: z.string().min(2).max(50).optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional()
  })
};

export const wishlistMutationSchema: ValidationSchema = {
  body: z.object({
    listingId: uuid()
  })
};

export const collectionAddSchema: ValidationSchema = {
  body: z.object({
    listingId: uuid(),
    notes: z.string().max(500).optional()
  })
};

export const collectionUpdateSchema: ValidationSchema = {
  params: z.object({
    listingId: uuid()
  }),
  body: z.object({
    notes: z.string().max(500).optional()
  })
};

export const wishlistParamsSchema: ValidationSchema = {
  params: z.object({
    listingId: uuid()
  })
};

export const savedFilterCreateSchema: ValidationSchema = {
  body: z.object({
    name: z.string().min(2).max(50),
    criteria: z.record(z.any())
  })
};

export const savedFilterParamsSchema: ValidationSchema = {
  params: z.object({
    id: uuid()
  })
};

export const savedFilterUpdateSchema: ValidationSchema = {
  params: z.object({
    id: uuid()
  }),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    criteria: z.record(z.any()).optional()
  })
};
