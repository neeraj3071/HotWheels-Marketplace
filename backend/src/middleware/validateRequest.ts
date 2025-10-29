import type { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

import { HttpError } from "../utils/httpError";

export interface ValidationSchema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validateRequest = (schema: ValidationSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new HttpError(400, "Validation error", error.flatten()));
      }

      next(error);
    }
  };
