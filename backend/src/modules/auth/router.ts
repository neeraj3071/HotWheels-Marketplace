import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import { catchAsync } from "../../utils/catchAsync";

import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema
} from "./schemas";
import {
  loginUser,
  refreshTokens,
  registerUser,
  revokeRefreshToken
} from "./service";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  catchAsync(async (req, res) => {
    const { email, password, displayName } = req.body;
    const result = await registerUser(email, password, displayName);
    res.status(201).json(result);
  })
);

authRouter.post(
  "/login",
  validateRequest(loginSchema),
  catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  })
);

authRouter.post(
  "/refresh",
  validateRequest(refreshSchema),
  catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await refreshTokens(refreshToken);
    res.status(200).json(result);
  })
);

authRouter.post(
  "/logout",
  validateRequest(logoutSchema),
  catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
  })
);
