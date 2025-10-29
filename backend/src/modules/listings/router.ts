import type { ListingCondition, ListingRarity, ListingStatus } from "@prisma/client";
import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { requireRole } from "../../middleware/requireRole";
import { validateRequest } from "../../middleware/validateRequest";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";

import {
  createListingSchema,
  listingIdSchema,
  listingsQuerySchema,
  updateListingSchema
} from "./schemas";
import {
  archiveListing,
  createListing,
  getListingById,
  listListings,
  updateListing
} from "./service";

export const listingsRouter = Router();

listingsRouter.get(
  "/",
  validateRequest(listingsQuerySchema),
  catchAsync(async (req, res) => {
    const {
      search,
      condition,
      rarity,
      status,
      minPrice,
      maxPrice,
      year,
      ownerId,
      page,
      pageSize
    } = req.query as Record<string, string | undefined>;

    const result = await listListings({
      search,
      condition: condition as ListingCondition | undefined,
      rarity: rarity as ListingRarity | undefined,
      status: status as ListingStatus | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      year: year ? Number(year) : undefined,
      ownerId,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined
    });

    res.status(200).json(result);
  })
);

listingsRouter.get(
  "/:id",
  validateRequest(listingIdSchema),
  catchAsync(async (req, res) => {
    const listing = await getListingById(req.params.id);
    res.status(200).json(listing);
  })
);

listingsRouter.post(
  "/",
  authenticate,
  requireRole("USER", "ADMIN"),
  validateRequest(createListingSchema),
  catchAsync(async (req, res) => {
    const payload = await createListing(req.user!.id, req.body);
    res.status(201).json(payload);
  })
);

listingsRouter.patch(
  "/:id",
  authenticate,
  requireRole("USER", "ADMIN"),
  validateRequest(updateListingSchema),
  catchAsync(async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      throw new HttpError(400, "No fields provided for update");
    }

    const listing = await updateListing(req.params.id, req.user!, req.body);
    res.status(200).json(listing);
  })
);

listingsRouter.delete(
  "/:id",
  authenticate,
  requireRole("USER", "ADMIN"),
  validateRequest(listingIdSchema),
  catchAsync(async (req, res) => {
    await archiveListing(req.params.id, req.user!);
    res.status(204).send();
  })
);
