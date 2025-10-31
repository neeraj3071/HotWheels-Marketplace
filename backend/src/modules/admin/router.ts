import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { requireRole } from "../../middleware/requireRole";
import { validateRequest } from "../../middleware/validateRequest";
import { catchAsync } from "../../utils/catchAsync";

import {
  listUsersQuerySchema,
  listingIdParamSchema,
  listingModerationSchema,
  updateUserRoleSchema
} from "./schemas";
import {
  adminArchiveListing,
  adminUpdateListingStatus,
  listUsersForAdmin,
  updateUserRole,
  getAdminStats
} from "./service";

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole("ADMIN"));

// Get admin statistics
adminRouter.get(
  "/stats",
  catchAsync(async (req, res) => {
    const stats = await getAdminStats();
    res.status(200).json(stats);
  })
);

adminRouter.get(
  "/users",
  validateRequest(listUsersQuerySchema),
  catchAsync(async (req, res) => {
    const { search, page, pageSize } = req.query as Record<string, string | undefined>;
    const result = await listUsersForAdmin({
      search,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined
    });
    res.status(200).json(result);
  })
);

adminRouter.patch(
  "/users/:id/role",
  validateRequest(updateUserRoleSchema),
  catchAsync(async (req, res) => {
    const user = await updateUserRole(req.params.id, req.body.role);
    res.status(200).json(user);
  })
);

adminRouter.delete(
  "/listings/:id",
  validateRequest(listingIdParamSchema),
  catchAsync(async (req, res) => {
    const listing = await adminArchiveListing(req.params.id);
    res.status(200).json(listing);
  })
);

adminRouter.patch(
  "/listings/:id/status",
  validateRequest(listingModerationSchema),
  catchAsync(async (req, res) => {
    const listing = await adminUpdateListingStatus(req.params.id, req.body.status);
    res.status(200).json(listing);
  })
);
