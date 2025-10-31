import { Prisma } from "@prisma/client";
import type { UserRole, ListingStatus } from "@prisma/client";

import { HttpError } from "../../utils/httpError";
import { prisma } from "../../utils/prisma";

interface ListUsersFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

const userSelect = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.UserSelect;

export const listUsersForAdmin = async (filters: ListUsersFilters) => {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
  const skip = (page - 1) * pageSize;

  const where: Prisma.UserWhereInput = filters.search
    ? {
        OR: [
          { email: { contains: filters.search, mode: "insensitive" } },
          { displayName: { contains: filters.search, mode: "insensitive" } }
        ]
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize
    })
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: userSelect
    });

    return updated;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new HttpError(404, "User not found");
    }

    throw error;
  }
};

export const adminArchiveListing = async (listingId: string) => {
  try {
    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: { status: "ARCHIVED" },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true
      }
    });

    return listing;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new HttpError(404, "Listing not found");
    }

    throw error;
  }
};

export const adminUpdateListingStatus = async (
  listingId: string,
  status: ListingStatus
) => {
  try {
    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: { status },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true
      }
    });

    return listing;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new HttpError(404, "Listing not found");
    }

    throw error;
  }
};

export const getAdminStats = async () => {
  const [totalUsers, totalListings, activeListings, totalMessages] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.message.count()
  ]);

  return {
    totalUsers,
    totalListings,
    activeListings,
    totalMessages
  };
};
