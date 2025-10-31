import { prisma } from "../../utils/prisma";

export const wishlistService = {
  async addToWishlist(userId: string, listingId: string) {
    return await prisma.wishlistItem.create({
      data: {
        userId,
        listingId
      },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });
  },

  async getUserWishlist(userId: string) {
    return await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  async removeFromWishlist(id: string, userId: string) {
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id }
    });

    if (!wishlistItem) {
      throw new Error('Wishlist item not found');
    }

    if (wishlistItem.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.wishlistItem.delete({
      where: { id }
    });

    return { message: 'Removed from wishlist' };
  },

  async checkIfInWishlist(userId: string, listingId: string) {
    const item = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        listingId
      }
    });

    return !!item;
  }
};
