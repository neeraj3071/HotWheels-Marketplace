import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError";

export const requireRole = (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, "Insufficient permissions"));
    }

    next();
  };
