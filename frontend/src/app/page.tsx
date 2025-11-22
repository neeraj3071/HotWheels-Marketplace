import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, Heart, MessageCircle, Search, TrendingUp, Users, Zap, Award, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Racing Theme */}
      <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-orange-500 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl animate-speed-in">
            {/* Hot Wheels Logo Style Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
              <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold tracking-wider">FASTEST MARKETPLACE IN THE GAME</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl leading-tight">
              Race Into The
              <span className="block gradient-text bg-gradient-to-r from-yellow-300 via-orange-200 to-white bg-clip-text text-transparent">
                Hot Wheels Marketplace
              </span>
            </h1>
            <p className="mb-8 text-xl text-white/90 md:text-2xl">
              🏁 Buy, sell, and trade rare Hot Wheels cars with collectors worldwide. 
              Find that missing piece for your collection at lightning speed!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-yellow-300 hover:text-orange-700 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-pulse-glow">
                <Link href="/listings">
                  <Car className="mr-2 h-5 w-5" />
                  Browse Cars Now
                </Link>
              </Button>
              <Button asChild size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-orange-600 font-bold backdrop-blur-sm transition-all hover:scale-105">
                <Link href="/register" className="hover:text-orange-600">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Collection
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated Car Icon */}
        <div className="absolute bottom-0 right-0 opacity-20 animate-tire-spin">
          <Car className="h-64 w-64" />
        </div>
      </section>

      {/* Features Section with Racing Theme */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Track Lines Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(to right, #ff6b35 1px, transparent 1px)`,
            backgroundSize: '40px 100%'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-zoom-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Why Race With Us?</span>
            </h2>
            <p className="text-gray-600 text-lg">The fastest way to find, trade, and collect Hot Wheels</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Search className="h-10 w-10 text-orange-500" />}
              title="Turbo Search"
              description="Find your dream car in seconds with our lightning-fast search and filters."
              delay="0.1s"
            />
            <FeatureCard
              icon={<Heart className="h-10 w-10 text-red-500" />}
              title="Wishlist Garage"
              description="Park your dream cars in your wishlist and get notified when they're available."
              delay="0.2s"
            />
            <FeatureCard
              icon={<MessageCircle className="h-10 w-10 text-blue-500" />}
              title="Pit Stop Chat"
              description="Connect instantly with sellers through our real-time messaging system."
              delay="0.3s"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-green-500" />}
              title="Race-Ready Pricing"
              description="Transparent marketplace with competitive pricing for the best deals."
              delay="0.4s"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-purple-500" />}
              title="Collector's Club"
              description="Join thousands of passionate Hot Wheels collectors worldwide."
              delay="0.5s"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-indigo-500" />}
              title="Verified Track"
              description="All listings are verified and moderated for quality and authenticity."
              delay="0.6s"
            />
          </div>
        </div>
      </section>

      {/* CTA Section with Racing Flag Pattern */}
      <section className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 py-20 text-white relative overflow-hidden animate-racing-stripe">
        {/* Checkered Flag Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(45deg, #000 25%, transparent 25%),
              linear-gradient(-45deg, #000 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #000 75%),
              linear-gradient(-45deg, transparent 75%, #000 75%)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
              <Award className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-bold tracking-wider">JOIN THE FASTEST GROWING COMMUNITY</span>
            </div>
            
            <h2 className="mb-4 text-4xl md:text-5xl font-bold animate-zoom-in">Ready to Start Your Collection?</h2>
            <p className="mb-8 text-xl text-white/90">
              🏆 Join our racing community and discover rare Hot Wheels cars today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-yellow-300 hover:text-orange-700 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Link href="/register">
                  <Zap className="mr-2 h-5 w-5" />
                  Create Free Account
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold backdrop-blur-sm transition-all hover:scale-105">
                <Link href="/listings">
                  <Car className="mr-2 h-5 w-5" />
                  View All Cars
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold text-orange-600 text-lg">Hot Wheels Marketplace</h3>
              <p className="text-sm text-gray-600">
                The premier destination for Hot Wheels collectors worldwide.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/listings" className="hover:text-orange-600">Browse Listings</Link></li>
                <li><Link href="/sell" className="hover:text-orange-600">Sell Your Cars</Link></li>
                <li><Link href="/categories" className="hover:text-orange-600">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Community</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-orange-600">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-orange-600">Contact</Link></li>
                <li><Link href="/help" className="hover:text-orange-600">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/terms" className="hover:text-orange-600">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Hot Wheels Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}

function FeatureCard({ icon, title, description, delay = '0s' }: FeatureCardProps) {
  return (
    <div 
      className="rounded-xl bg-white p-6 shadow-lg card-hover racing-stripes border-t-4 border-orange-500 group"
      style={{ animationDelay: delay }}
    >
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="mb-2 text-xl font-bold group-hover:text-orange-600 transition-colors">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 h-1 w-0 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-500" />
    </div>
  );
}
