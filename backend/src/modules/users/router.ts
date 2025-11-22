import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { validateRequest } from "../../middleware/validateRequest";
import { catchAsync } from "../../utils/catchAsync";

import {
  collectionAddSchema,
  collectionUpdateSchema,
  savedFilterCreateSchema,
  savedFilterParamsSchema,
  savedFilterUpdateSchema,
  updateProfileSchema,
  wishlistMutationSchema,
  wishlistParamsSchema
} from "./schemas";
import {
  addCollectionItem,
  addWishlistItem,
  createSavedFilter,
  deleteSavedFilter,
  getCurrentUserProfile,
  getPublicUserProfile,
  getUserListings,
  listSavedFilters,
  listCollectionItems,
  listWishlistItems,
  removeCollectionItem,
  removeWishlistItem,
  updateCollectionItem,
  updateCurrentUserProfile,
  updateSavedFilter
} from "./service";

export const usersRouter = Router();

usersRouter.get(
  "/me",
  authenticate,
  catchAsync(async (req, res) => {
    const data = await getCurrentUserProfile(req.user!.id);
    res.status(200).json(data);
  })
);

usersRouter.patch(
  "/me",
  authenticate,
  validateRequest(updateProfileSchema),
  catchAsync(async (req, res) => {
    const updated = await updateCurrentUserProfile(req.user!.id, req.body);
    res.status(200).json({ profile: updated });
  })
);

usersRouter.get(
  "/me/wishlist",
  authenticate,
  catchAsync(async (req, res) => {
    const wishlist = await listWishlistItems(req.user!.id);
    res.status(200).json({ wishlist });
  })
);

usersRouter.post(
  "/me/wishlist",
  authenticate,
  validateRequest(wishlistMutationSchema),
  catchAsync(async (req, res) => {
    const result = await addWishlistItem(req.user!.id, req.body.listingId);
    res.status(201).json(result);
  })
);

usersRouter.delete(
  "/me/wishlist/:listingId",
  authenticate,
  validateRequest(wishlistParamsSchema),
  catchAsync(async (req, res) => {
    await removeWishlistItem(req.user!.id, req.params.listingId);
    res.status(204).send();
  })
);

usersRouter.get(
  "/me/collection",
  authenticate,
  catchAsync(async (req, res) => {
    const collection = await listCollectionItems(req.user!.id);
    res.status(200).json({ collection });
  })
);

usersRouter.post(
  "/me/collection",
  authenticate,
  validateRequest(collectionAddSchema),
  catchAsync(async (req, res) => {
    const result = await addCollectionItem(
      req.user!.id,
      req.body.listingId,
      req.body.notes
    );
    res.status(201).json(result);
  })
);

usersRouter.patch(
  "/me/collection/:listingId",
  authenticate,
  validateRequest(collectionUpdateSchema),
  catchAsync(async (req, res) => {
    await updateCollectionItem(
      req.user!.id,
      req.params.listingId,
      req.body.notes
    );
    res.status(200).json({ message: "Collection item updated" });
  })
);

usersRouter.delete(
  "/me/collection/:listingId",
  authenticate,
  validateRequest(collectionUpdateSchema),
  catchAsync(async (req, res) => {
    await removeCollectionItem(req.user!.id, req.params.listingId);
    res.status(204).send();
  })
);

usersRouter.get(
  "/me/filters",
  authenticate,
  catchAsync(async (req, res) => {
    const filters = await listSavedFilters(req.user!.id);
    res.status(200).json({ filters });
  })
);

usersRouter.post(
  "/me/filters",
  authenticate,
  validateRequest(savedFilterCreateSchema),
  catchAsync(async (req, res) => {
    await createSavedFilter(req.user!.id, req.body.name, req.body.criteria);
    res.status(201).json({ message: "Filter saved" });
  })
);

usersRouter.patch(
  "/me/filters/:id",
  authenticate,
  validateRequest(savedFilterUpdateSchema),
  catchAsync(async (req, res) => {
    const updated = await updateSavedFilter(
      req.user!.id,
      req.params.id,
      req.body
    );
    res.status(200).json(updated);
  })
);

usersRouter.delete(
  "/me/filters/:id",
  authenticate,
  validateRequest(savedFilterParamsSchema),
  catchAsync(async (req, res) => {
    await deleteSavedFilter(req.user!.id, req.params.id);
    res.status(204).send();
  })
);

usersRouter.get(
  "/:id",
  catchAsync(async (req, res) => {
    const user = await getPublicUserProfile(req.params.id);
    res.status(200).json(user);
  })
);

usersRouter.get(
  "/:id/listings",
  catchAsync(async (req, res) => {
    const listings = await getUserListings(req.params.id);
    res.status(200).json(listings);
  })
);
