export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export type ListingCondition = 'NEW' | 'LIKE_NEW' | 'USED' | 'DAMAGED';

export type ListingRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'ULTRA_RARE';

export type ListingStatus = 'ACTIVE' | 'ARCHIVED' | 'SOLD';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  profilePicture?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  year?: number;
  model: string;
  series?: string;
  manufacturer?: string;
  scale?: string;
  color?: string;
  location?: string;
  condition: ListingCondition;
  rarity: ListingRarity;
  priceCents: number;
  images: string[];
  status: ListingStatus;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface WishlistItem {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  listing: Listing;
}

export interface CollectionItem {
  id: string;
  userId: string;
  listingId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  listing: Listing;
}

export interface SavedFilter {
  id: string;
  name: string;
  criteria: Record<string, any>;
  userId: string;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  listingId?: string;
  participants: User[];
  createdAt: string;
  updatedAt: string;
  listing?: {
    id: string;
    title: string;
    priceCents: number;
    images: string[];
  };
  lastMessage?: Message;
}

export interface Message {
  id: string;
  body: string;
  senderId: string;
  threadId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
