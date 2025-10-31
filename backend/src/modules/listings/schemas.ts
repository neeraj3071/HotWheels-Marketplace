import { z } from "zod";

import type { ValidationSchema } from "../../middleware/validateRequest";

const listingConditions = ["NEW", "LIKE_NEW", "USED", "DAMAGED"] as const;
const listingRarities = ["COMMON", "UNCOMMON", "RARE", "ULTRA_RARE"] as const;
const listingStatuses = ["ACTIVE", "ARCHIVED", "SOLD"] as const;

const uuid = () => z.string().uuid();

export const createListingSchema: ValidationSchema = {
  body: z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(10),
    year: z.number().int().min(1950).max(new Date().getFullYear()).optional(),
    model: z.string().min(1).max(120),
    condition: z.enum(listingConditions),
    rarity: z.enum(listingRarities),
    priceCents: z.number().int().min(0),
    images: z.array(z.string()).max(10).optional() // Accept any string (URLs or base64)
  })
};

export const updateListingSchema: ValidationSchema = {
  params: z.object({ id: uuid() }),
  body: z.object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().min(10).optional(),
    year: z
      .number()
      .int()
      .min(1950)
      .max(new Date().getFullYear())
      .optional(),
    model: z.string().min(1).max(120).optional(),
    condition: z.enum(listingConditions).optional(),
    rarity: z.enum(listingRarities).optional(),
    priceCents: z.number().int().min(0).optional(),
    images: z.array(z.string()).max(10).optional(), // Accept any string (URLs or base64)
    status: z.enum(listingStatuses).optional()
  })
};

export const listingIdSchema: ValidationSchema = {
  params: z.object({ id: uuid() })
};

export const listingsQuerySchema: ValidationSchema = {
  query: z.object({
    search: z.string().max(120).optional(),
    condition: z.enum(listingConditions).optional(),
    rarity: z.enum(listingRarities).optional(),
    status: z.enum(listingStatuses).optional(),
    minPrice: z.string().regex(/^\d+$/).optional(),
    maxPrice: z.string().regex(/^\d+$/).optional(),
    year: z.string().regex(/^\d+$/).optional(),
    ownerId: uuid().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    pageSize: z.string().regex(/^\d+$/).optional()
  })
};