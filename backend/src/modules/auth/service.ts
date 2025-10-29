import { randomUUID } from "crypto";

import type { User } from "@prisma/client";

import { env } from "../../config/env";
import { HttpError } from "../../utils/httpError";
import { hashPassword, verifyPassword } from "../../utils/password";
import { prisma } from "../../utils/prisma";
import {
  calculateExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../../utils/token";
import { presentUser } from "../users/presenter";

const issueTokens = async (user: User) => {
  const tokenId = randomUUID();
  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role, tokenId);
  const expiresAt = calculateExpiryDate(env.jwtRefreshExpiresIn);

  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      token: refreshToken,
      userId: user.id,
      expiresAt
    }
  });

  return {
    accessToken,
    refreshToken,
    refreshExpiresAt: expiresAt.toISOString(),
    expiresIn: env.jwtAccessExpiresIn
  };
};

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName
    }
  });

  const tokens = await issueTokens(user);

  return {
    user: presentUser(user),
    ...tokens
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const tokens = await issueTokens(user);

  return {
    user: presentUser(user),
    ...tokens
  };
};

export const refreshTokens = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  });

  if (!storedToken) {
    throw new HttpError(401, "Refresh token not recognized");
  }

  if (storedToken.expiresAt.getTime() < Date.now()) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new HttpError(401, "Refresh token expired");
  }

  if (payload.tokenId && storedToken.id !== payload.tokenId) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new HttpError(401, "Refresh token mismatch");
  }

  await prisma.refreshToken.delete({ where: { token: refreshToken } });

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const tokens = await issueTokens(user);

  return {
    user: presentUser(user),
    ...tokens
  };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};
