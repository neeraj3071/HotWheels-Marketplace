'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageCircle, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Listing } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await api.get<Listing>(`/listings/${params.id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Failed to fetch listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async () => {
    if (!user || !listing) return;
    try {
      await api.post('/wishlist', { listingId: listing.id });
      alert('Added to wishlist!');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const startConversation = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Double check user is not the owner
    if (user.id === listing?.owner?.id) {
      alert('You cannot message yourself.');
      return;
    }
    router.push(`/messages?sellerId=${listing?.owner?.id}`);
  };

  const nextImage = () => {
    if (listing && listing.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing && listing.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6" />
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Button asChild>
            <Link href="/listings">Back to Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/listings">← Back to listings</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
              {listing.images && listing.images.length > 0 ? (
                <>
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-contain"
                  />
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">{listing.condition}</Badge>
                    <Badge variant="outline">{listing.rarity}</Badge>
                    <Badge variant={listing.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-4xl font-bold text-orange-600 mb-6">
                {formatPrice(listing.priceCents)}
              </div>

              <div className="space-y-4 mb-6">
                {listing.series && (
                  <div>
                    <span className="font-semibold">Series:</span> {listing.series}
                  </div>
                )}
                {listing.year && (
                  <div>
                    <span className="font-semibold">Year:</span> {listing.year}
                  </div>
                )}
                {listing.manufacturer && (
                  <div>
                    <span className="font-semibold">Manufacturer:</span> {listing.manufacturer}
                  </div>
                )}
                {listing.scale && (
                  <div>
                    <span className="font-semibold">Scale:</span> {listing.scale}
                  </div>
                )}
                {listing.color && (
                  <div>
                    <span className="font-semibold">Color:</span> {listing.color}
                  </div>
                )}
                {listing.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{listing.location}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>

              {user && user.id !== listing.owner?.id && (
                <div className="flex gap-3 mb-6">
                  <Button onClick={startConversation} className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Seller
                  </Button>
                  <Button onClick={addToWishlist} variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {user && user.id === listing.owner?.id && (
                <div className="flex gap-3 mb-6">
                  <Button asChild className="flex-1">
                    <Link href={`/listings/${listing.id}/edit`}>Edit Listing</Link>
                  </Button>
                </div>
              )}

              {/* Seller Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <Link href={`/profile/${listing.owner?.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.owner?.avatarUrl} />
                    <AvatarFallback>
                      {listing.owner?.displayName?.charAt(0).toUpperCase() || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{listing.owner?.displayName}</p>
                    <p className="text-sm text-gray-500">View Profile</p>
                  </div>
                </Link>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Listed {formatDate(listing.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
