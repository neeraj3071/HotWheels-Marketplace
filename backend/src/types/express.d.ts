import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      role: UserRole;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
