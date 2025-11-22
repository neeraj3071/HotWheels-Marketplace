'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, Heart, MessageCircle, User, LogOut, Plus, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuthStore } from '@/store/auth';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-md">
      {/* Racing Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-racing-stripe" />
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-600 hover:text-orange-700 transition-colors group">
            <div className="relative">
              <Car className="h-6 w-6 group-hover:animate-tire-spin transition-transform" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Hot Wheels MP
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search Hot Wheels..."
                className="w-full rounded-lg border-2 border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-300 transition-all"
                onClick={() => router.push('/listings')}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:flex hover:text-orange-600 hover:bg-orange-50">
              <Link href="/listings">Browse</Link>
            </Button>

            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild className="hover:text-red-600 hover:bg-red-50 transition-all hover:scale-110">
                  <Link href="/wishlist">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="hover:text-blue-600 hover:bg-blue-50 transition-all hover:scale-110">
                  <Link href="/messages">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="sm" className="hidden sm:flex bg-orange-600 hover:bg-orange-700 font-bold transition-all hover:scale-105">
                  <Link href="/listings/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Sell
                  </Link>
                </Button>

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-orange-50 transition-all hover:scale-105"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-orange-200 hover:ring-orange-400 transition-all">
                        <AvatarImage src={user.avatarUrl || user.profilePicture || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                          {user.displayName?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator with pulse */}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse" />
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-bold text-gray-900">{user.displayName}</span>
                      {user.role === 'ADMIN' && (
                        <span className="text-xs bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">Admin</span>
                      )}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-xl z-50 animate-zoom-in overflow-hidden">
                      {/* Racing stripe on top */}
                      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />
                      
                      <div className="border-b px-4 py-3 bg-gradient-to-br from-orange-50 to-red-50">
                        <p className="font-bold text-gray-900">{user.displayName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full">
                            Administrator
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        {user.id && (
                          <Link
                            href={`/profile/${user.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                        )}
                        <Link
                          href="/profile/edit"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Edit Profile
                        </Link>
                        <Link
                          href="/my-listings"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Car className="h-4 w-4" />
                          My Listings
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 font-bold hover:from-orange-100 hover:to-red-100 border-t transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t font-semibold transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:text-orange-600">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-orange-600 hover:bg-orange-700 font-bold transition-all hover:scale-105">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
