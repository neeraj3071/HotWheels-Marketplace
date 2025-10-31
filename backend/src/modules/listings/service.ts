import type {
  ListingCondition,
  ListingRarity,
  ListingStatus,
  Prisma,
  User
} from "@prisma/client";

import { HttpError } from "../../utils/httpError";
import { prisma } from "../../utils/prisma";

interface ListingFilters {
  search?: string;
  condition?: ListingCondition;
  rarity?: ListingRarity;
  status?: ListingStatus;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  ownerId?: string;
  page?: number;
  pageSize?: number;
}

const listingSelect = {
  id: true,
  title: true,
  description: true,
  year: true,
  model: true,
  condition: true,
  rarity: true,
  priceCents: true,
  images: true,
  status: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: {
      id: true,
      displayName: true,
      avatarUrl: true
    }
  }
} satisfies Prisma.ListingSelect;

const buildWhereClause = (filters: ListingFilters): Prisma.ListingWhereInput => {
  const where: Prisma.ListingWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  } else {
    where.status = "ACTIVE";
  }

  if (filters.condition) {
    where.condition = filters.condition;
  }

  if (filters.rarity) {
    where.rarity = filters.rarity;
  }

  if (filters.ownerId) {
    where.ownerId = filters.ownerId;
  }

  if (filters.year) {
    where.year = filters.year;
  }

  if (filters.search) {
    const search = filters.search;
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceFilter: Prisma.IntFilter = {};

    if (filters.minPrice !== undefined) {
      priceFilter.gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      priceFilter.lte = filters.maxPrice;
    }

    where.priceCents = priceFilter;
  }

  return where;
};

export const listListings = async (filters: ListingFilters) => {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
  const skip = (page - 1) * pageSize;

  const where = buildWhereClause(filters);

  const [total, data] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      select: listingSelect,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    })
  ]);

  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

export const getListingById = async (id: string) => {
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      ...listingSelect,
      owner: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true
        }
      }
    }
  });

  if (!listing) {
    throw new HttpError(404, "Listing not found");
  }

  return listing;
};

export const createListing = async (
  ownerId: string,
  payload: {
    title: string;
    description: string;
    year?: number;
    model: string;
    condition: ListingCondition;
    rarity: ListingRarity;
    priceCents: number;
    images?: string[];
  }
) => {
  const listing = await prisma.listing.create({
    data: {
      ...payload,
      images: payload.images ?? [],
      ownerId
    },
    select: listingSelect
  });

  return listing;
};

export const updateListing = async (
  listingId: string,
  actor: Pick<User, "id" | "role">,
  data: Partial<{
    title: string;
    description: string;
    year?: number;
    model: string;
    condition: ListingCondition;
    rarity: ListingRarity;
    priceCents: number;
    images: string[];
    status: ListingStatus;
  }>
) => {
  const existing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { ownerId: true }
  });

  if (!existing) {
    throw new HttpError(404, "Listing not found");
  }

  if (existing.ownerId !== actor.id && actor.role !== "ADMIN") {
    throw new HttpError(403, "You can only modify your own listings");
  }

  const listing = await prisma.listing.update({
    where: { id: listingId },
    data,
    select: listingSelect
  });

  return listing;
};

export const archiveListing = async (
  listingId: string,
  actor: Pick<User, "id" | "role">
) => {
  const existing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { ownerId: true }
  });

  if (!existing) {
    throw new HttpError(404, "Listing not found");
  }

  if (existing.ownerId !== actor.id && actor.role !== "ADMIN") {
    throw new HttpError(403, "You can only remove your own listings");
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { status: "ARCHIVED" }
  });
};
