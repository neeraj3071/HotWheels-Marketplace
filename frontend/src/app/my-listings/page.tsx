'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Car, Edit, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Listing } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export default function MyListingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMyListings();
  }, [user]);

  const fetchMyListings = async () => {
    try {
      const response = await api.get<Listing[]>(`/users/${user?.id}/listings`);
      setListings(response.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await api.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    try {
      await api.put(`/listings/${id}`, { status: newStatus });
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id ? { ...listing, status: newStatus as any } : listing
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update listing status');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <Car className="h-8 w-8 text-orange-600" />
              My Listings
            </h1>
            <p className="text-gray-600">Manage your Hot Wheels listings</p>
          </div>
          <Button asChild>
            <Link href="/listings/create">Create New Listing</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">You haven't created any listings yet</p>
            <Button asChild>
              <Link href="/listings/create">Create First Listing</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="group hover:shadow-lg transition-shadow">
                <Link href={`/listings/${listing.id}`}>
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <Badge
                      variant={listing.status === 'ACTIVE' ? 'success' : 'secondary'}
                      className="absolute top-2 right-2"
                    >
                      {listing.status}
                    </Badge>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/listings/${listing.id}`}>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-orange-600">
                      {listing.title}
                    </h3>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {listing.condition}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {listing.rarity}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-orange-600 mb-3">
                      {formatPrice(listing.priceCents)}
                    </p>
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/listings/${listing.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(listing.id, listing.status)}
                    >
                      {listing.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteListing(listing.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
