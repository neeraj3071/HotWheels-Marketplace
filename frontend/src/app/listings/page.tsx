'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Heart, Car } from 'lucide-react';
import { api } from '@/lib/api';
import { Listing, PaginatedResponse } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function ListingsPage() {
  const user = useAuthStore((state) => state.user);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    condition: '',
    rarity: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchListings();
  }, [page, filters.sortBy, filters.sortOrder]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 12,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.search) params.search = filters.search;
      if (filters.condition) params.condition = filters.condition;
      if (filters.rarity) params.rarity = filters.rarity;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await api.get<PaginatedResponse<Listing>>('/listings', { params });
      setListings(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchListings();
  };

  const addToWishlist = async (listingId: string) => {
    if (!user) return;
    try {
      await api.post('/wishlist', { listingId });
      alert('Added to wishlist!');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header with Racing Theme */}
        <div className="mb-8 animate-speed-in">
          <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 mb-4">
            <Car className="h-5 w-5 text-orange-600 animate-tire-spin" />
            <span className="text-sm font-bold text-orange-600">BROWSE COLLECTION</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">Browse Hot Wheels</h1>
          <p className="text-gray-600 text-lg">🏁 Discover rare and collectible Hot Wheels cars</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 animate-zoom-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, series, year..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.condition}
              onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
            >
              <option value="">All Conditions</option>
              <option value="NEW">New</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="USED">Used</option>
              <option value="DAMAGED">Damaged</option>
            </Select>
            <Select
              value={filters.rarity}
              onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
            >
              <option value="">All Rarities</option>
              <option value="COMMON">Common</option>
              <option value="UNCOMMON">Uncommon</option>
              <option value="RARE">Rare</option>
              <option value="ULTRA_RARE">Ultra Rare</option>
            </Select>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
              <option value="title">Name</option>
            </Select>
            <Button onClick={handleSearch} className="bg-orange-600 hover:bg-orange-700 font-bold transition-all hover:scale-105">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Apply
            </Button>
          </div>
          <div className="mt-4 flex gap-4">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="max-w-[150px]"
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="max-w-[150px]"
            />
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse shimmer rounded-xl">
                <div className="aspect-square bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No cars found</p>
            <p className="text-gray-400 mb-4">Try adjusting your filters or be the first to list!</p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 font-bold transition-all hover:scale-105">
              <Link href="/listings/create">
                <Car className="mr-2 h-4 w-4" />
                Create First Listing
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing, index) => (
                <Card 
                  key={listing.id} 
                  className="group card-hover racing-stripes rounded-xl overflow-hidden border-0 shadow-md animate-zoom-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link href={`/listings/${listing.id}`}>
                    <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Car className="h-16 w-16" />
                        </div>
                      )}
                      {/* Racing Stripe Overlay */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />
                      {user && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToWishlist(listing.id);
                          }}
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 hover:bg-orange-500 hover:text-white transition-all shadow-lg hover:scale-110 backdrop-blur-sm"
                        >
                          <Heart className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4 bg-white">
                    <Link href={`/listings/${listing.id}`}>
                      <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors speed-lines">
                        {listing.title}
                      </h3>
                      <div className="flex gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs font-semibold bg-gray-100">
                          {listing.condition}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-semibold border-orange-500 text-orange-600">
                          {listing.rarity}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {formatPrice(listing.priceCents)}
                      </p>
                    </Link>
                  </CardContent>
                  {/* Bottom Racing Stripe */}
                  <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 group-hover:h-2 transition-all" />
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? 'default' : 'outline'}
                      onClick={() => setPage(i + 1)}
                      className="w-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
