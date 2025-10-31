import { z } from "zod";
import type { ValidationSchema } from "../../middleware/validateRequest";

const uuid = () => z.string().uuid();

export const addToWishlistSchema: ValidationSchema = {
  body: z.object({
    listingId: uuid()
  })
};

export const wishlistItemIdSchema: ValidationSchema = {
  params: z.object({
    id: uuid()
  })
};
