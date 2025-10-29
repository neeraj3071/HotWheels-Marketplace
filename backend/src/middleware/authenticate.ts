import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError";
import { verifyAccessToken } from "../utils/token";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authorization header missing"));
  }

  const token = header.slice(7);

  try {
    const payload = verifyAccessToken(token);

    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    next(error);
  }
};
