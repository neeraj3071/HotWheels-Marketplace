import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { validateRequest } from "../../middleware/validateRequest";
import { catchAsync } from "../../utils/catchAsync";
import { addToWishlistSchema, wishlistItemIdSchema } from "./schemas";
import { wishlistService } from "./service";

export const wishlistRouter = Router();

// Add to wishlist
wishlistRouter.post(
  "/",
  authenticate,
  validateRequest(addToWishlistSchema),
  catchAsync(async (req, res) => {
    const { listingId } = req.body;
    const userId = req.user!.id;

    const wishlistItem = await wishlistService.addToWishlist(userId, listingId);

    res.status(201).json(wishlistItem);
  })
);

// Get user's wishlist
wishlistRouter.get(
  "/",
  authenticate,
  catchAsync(async (req, res) => {
    const userId = req.user!.id;

    const wishlist = await wishlistService.getUserWishlist(userId);

    res.json(wishlist);
  })
);

// Remove from wishlist
wishlistRouter.delete(
  "/:id",
  authenticate,
  validateRequest(wishlistItemIdSchema),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const result = await wishlistService.removeFromWishlist(id, userId);

    res.json(result);
  })
);
