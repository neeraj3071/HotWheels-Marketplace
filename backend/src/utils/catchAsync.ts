import type { NextFunction, Request, Response } from "express";

export const catchAsync = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
