import { Prisma } from "@prisma/client";

import { HttpError } from "../../utils/httpError";
import { prisma } from "../../utils/prisma";

const userSelect = {
  id: true,
  email: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.UserSelect;

const listingSummarySelect = {
  id: true,
  title: true,
  model: true,
  rarity: true,
  condition: true,
  priceCents: true,
  images: true,
  status: true,
  ownerId: true
} satisfies Prisma.ListingSelect;

const wishlistInclude = {
  listing: {
    select: listingSummarySelect
  }
} satisfies Prisma.WishlistItemInclude;

const collectionInclude = {
  listing: {
    select: listingSummarySelect
  }
} satisfies Prisma.CollectionItemInclude;

export const getCurrentUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      listings: {
        select: {
          id: true,
          title: true,
          status: true,
          priceCents: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const [wishlist, collection, savedFilters] = await Promise.all([
    listWishlistItems(userId),
    listCollectionItems(userId),
    prisma.savedFilter.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return {
    profile: user,
    wishlist,
    collection,
    savedFilters
  };
};

export const updateCurrentUserProfile = async (
  userId: string,
  data: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
  }
) => {
  if (!data.displayName && !data.bio && !data.avatarUrl) {
    throw new HttpError(400, "No fields provided for update");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: userSelect
  });

  return updated;
};

export const getPublicUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...userSelect,
      listings: {
        select: {
          id: true,
          title: true,
          priceCents: true,
          rarity: true,
          condition: true,
          status: true,
          images: true,
          createdAt: true
        },
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
};

export const addWishlistItem = async (userId: string, listingId: string) => {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });

  if (!listing) {
    throw new HttpError(404, "Listing not found");
  }

  try {
    await prisma.wishlistItem.create({
      data: {
        userId,
        listingId
      }
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new HttpError(409, "Listing is already in wishlist");
    }

    throw error;
  }

  return { message: "Added to wishlist" };
};

export const removeWishlistItem = async (userId: string, listingId: string) => {
  const result = await prisma.wishlistItem.deleteMany({
    where: { userId, listingId }
  });

  if (result.count === 0) {
    throw new HttpError(404, "Wishlist item not found");
  }
};

export const listWishlistItems = async (userId: string) =>
  prisma.wishlistItem.findMany({
    where: { userId },
    include: wishlistInclude,
    orderBy: { createdAt: "desc" }
  });

export const addCollectionItem = async (
  userId: string,
  listingId: string,
  notes?: string
) => {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });

  if (!listing) {
    throw new HttpError(404, "Listing not found");
  }

  try {
    await prisma.collectionItem.create({
      data: {
        userId,
        listingId,
        notes
      }
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new HttpError(409, "Listing already in collection");
    }

    throw error;
  }

  return { message: "Added to collection" };
};

export const updateCollectionItem = async (
  userId: string,
  listingId: string,
  notes?: string
) => {
  const updated = await prisma.collectionItem.updateMany({
    where: { userId, listingId },
    data: { notes }
  });

  if (updated.count === 0) {
    throw new HttpError(404, "Collection item not found");
  }
};

export const removeCollectionItem = async (
  userId: string,
  listingId: string
) => {
  const deleted = await prisma.collectionItem.deleteMany({
    where: { userId, listingId }
  });

  if (deleted.count === 0) {
    throw new HttpError(404, "Collection item not found");
  }
};

export const listCollectionItems = async (userId: string) =>
  prisma.collectionItem.findMany({
    where: { userId },
    include: collectionInclude,
    orderBy: { createdAt: "desc" }
  });

export const listSavedFilters = async (userId: string) =>
  prisma.savedFilter.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

export const createSavedFilter = async (
  userId: string,
  name: string,
  criteria: Record<string, unknown>
) => {
  await prisma.savedFilter.create({
    data: {
      userId,
      name,
      criteria: criteria as Prisma.InputJsonValue
    }
  });
};

export const deleteSavedFilter = async (userId: string, id: string) => {
  const deleted = await prisma.savedFilter.deleteMany({
    where: { id, userId }
  });

  if (deleted.count === 0) {
    throw new HttpError(404, "Saved filter not found");
  }
};

export const updateSavedFilter = async (
  userId: string,
  id: string,
  data: { name?: string; criteria?: Record<string, unknown> }
) => {
  if (!data.name && !data.criteria) {
    throw new HttpError(400, "No fields provided for update");
  }

  const existing = await prisma.savedFilter.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    throw new HttpError(404, "Saved filter not found");
  }

  const updated = await prisma.savedFilter.update({
    where: { id },
    data: {
      name: data.name ?? existing.name,
      criteria: (data.criteria ?? existing.criteria) as Prisma.InputJsonValue
    }
  });

  return updated;
};

export const getUserListings = async (userId: string) => {
  const listings = await prisma.listing.findMany({
    where: { 
      ownerId: userId,
      status: "ACTIVE"
    },
    select: listingSummarySelect,
    orderBy: { createdAt: "desc" }
  });

  return listings;
};
