import type { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import ms from "ms";
import type { StringValue } from "ms";

import { env } from "../config/env";

import { HttpError } from "./httpError";

export interface AuthTokenPayload extends jwt.JwtPayload {
  sub: string;
  role: UserRole;
  tokenId?: string;
}

const ensurePayload = (payload: string | jwt.JwtPayload): AuthTokenPayload => {
  if (typeof payload === "string" || !payload.sub || !payload.role) {
    throw new HttpError(401, "Invalid token payload");
  }

  return payload as AuthTokenPayload;
};

export const calculateExpiryDate = (duration: string) => {
  const milliseconds = ms(duration as StringValue);

  if (typeof milliseconds !== "number") {
    throw new HttpError(500, "Failed to parse token duration");
  }

  return new Date(Date.now() + milliseconds);
};

export const signAccessToken = (userId: string, role: UserRole) =>
  jwt.sign({ sub: userId, role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"]
  });

export const signRefreshToken = (
  userId: string,
  role: UserRole,
  tokenId: string
) =>
  jwt.sign({ sub: userId, role, tokenId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"]
  });

export const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    return ensurePayload(payload);
  } catch {
    throw new HttpError(401, "Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const payload = jwt.verify(token, env.jwtRefreshSecret);
    return ensurePayload(payload);
  } catch {
    throw new HttpError(401, "Invalid or expired refresh token");
  }
};
