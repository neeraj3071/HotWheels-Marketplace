'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, Mail, Car } from 'lucide-react';
import { api } from '@/lib/api';
import { User, Listing } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function ProfilePage() {
  const params = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProfile();
      fetchUserListings();
    }
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get<User>(`/users/${params.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchUserListings = async () => {
    try {
      const response = await api.get<Listing[]>(`/users/${params.id}/listings`);
      setListings(response.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatarUrl || profile.profilePicture} />
                <AvatarFallback className="text-4xl">
                  {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{profile.displayName || profile.username}</h1>
                <p className="text-gray-600 mb-4">@{profile.username}</p>
                {profile.bio && <p className="text-gray-700 mb-4">{profile.bio}</p>}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {isOwnProfile ? profile.email : 'Contact via messages'}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(profile.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    {listings.length} Listings
                  </div>
                </div>
                {isOwnProfile && (
                  <Button asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {isOwnProfile ? 'My Listings' : `${profile.displayName}'s Listings`}
            </h2>
            {isOwnProfile && (
              <Button asChild>
                <Link href="/listings/create">Create New Listing</Link>
              </Button>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                {isOwnProfile ? "You haven't created any listings yet" : 'No listings available'}
              </p>
              {isOwnProfile && (
                <Button asChild>
                  <Link href="/listings/create">Create First Listing</Link>
                </Button>
              )}
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
                      <p className="text-2xl font-bold text-orange-600">
                        {formatPrice(listing.priceCents)}
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
