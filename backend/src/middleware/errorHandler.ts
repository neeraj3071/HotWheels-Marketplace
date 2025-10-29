import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const statusCode = (err as { statusCode?: number; status?: number }).statusCode
    ?? (err as { status?: number }).status
    ?? 500;
  const payload: Record<string, unknown> = {
    message: err.message || "Internal Server Error"
  };

  if ((err as { details?: unknown }).details) {
    payload.details = (err as { details?: unknown }).details;
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
