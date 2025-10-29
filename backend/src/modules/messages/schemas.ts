import { z } from "zod";

import type { ValidationSchema } from "../../middleware/validateRequest";

const uuid = () => z.string().uuid();

export const createThreadSchema: ValidationSchema = {
  body: z.object({
    participantId: uuid(),
    listingId: uuid().optional()
  })
};

export const threadIdSchema: ValidationSchema = {
  params: z.object({ id: uuid() })
};

export const createMessageSchema: ValidationSchema = {
  params: z.object({ id: uuid() }),
  body: z.object({
    body: z.string().min(1).max(2000)
  })
};

export const listMessagesQuerySchema: ValidationSchema = {
  params: z.object({ id: uuid() }),
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional()
  })
};
