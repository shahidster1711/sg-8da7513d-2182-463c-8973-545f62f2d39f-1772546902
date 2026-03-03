import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  TrendingUp,
  Smartphone,
  Sofa,
  Shirt,
  Car,
  Anchor,
  Apple,
  Palette,
  Briefcase,
  Home as HomeIcon,
  PawPrint,
  Package,
  Sparkles,
  Shield,
  Zap,
  Users
} from "lucide-react";
import { searchListings } from "@/services/listingService";
import { supabase } from "@/integrations/supabase/client";
import type { Listing, Category } from "@/types";
import { CATEGORIES } from "@/types";
import ListingCard from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons: Record<Category, any> = {
  "Electronics": Smartphone,
  "Furniture": Sofa,
  "Clothing & Accessories": Shirt,
  "Vehicles": Car,
  "Marine Equipment": Anchor,
  "Fresh Produce": Apple,
  "Handicrafts & Souvenirs": Palette,
  "Services": Briefcase,
  "Jobs": Briefcase,
  "Real Estate": HomeIcon,
  "Pets": PawPrint,
  "Miscellaneous": Package,
};

const categoryColors: Record<Category, string> = {
  "Electronics": "from-blue-400 to-blue-600",
  "Furniture": "from-amber-400 to-orange-600",
  "Clothing & Accessories": "from-pink-400 to-rose-600",
  "Vehicles": "from-gray-400 to-gray-600",
  "Marine Equipment": "from-cyan-400 to-blue-600",
  "Fresh Produce": "from-green-400 to-emerald-600",
  "Handicrafts & Souvenirs": "from-purple-400 to-purple-600",
  "Services": "from-indigo-400 to-indigo-600",
  "Jobs": "from-teal-400 to-teal-600",
  "Real Estate": "from-red-400 to-red-600",
  "Pets": "from-yellow-400 to-orange-600",
  "Miscellaneous": "from-slate-400 to-slate-600",
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
    loadRecentListings();
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUserId(session?.user?.id || null);
  }

  async function loadRecentListings() {
    const { data } = await searchListings({}, userId || undefined, 0, 8);
    setRecentListings(data);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  function handleCategoryClick(category: Category) {
    router.push(`/search?category=${encodeURIComponent(category)}`);
  }

  return (
    <>
      <SEO
        title="AndamanBazaar - Buy & Sell in Andaman and Nicobar Islands"
        description="The hyperlocal marketplace for the Andaman and Nicobar Islands. Buy and sell electronics, furniture, vehicles, marine equipment, fresh produce, and more."
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        {/* Hero Section */}
        <section className="relative pt-8 pb-16 px-4 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-1.5">
              <Sparkles className="h-4 w-4 mr-1 inline" />
              Trusted by 10,000+ Islanders
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Your Islands
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Local Marketplace
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Buy, sell, and discover everything you need right here in the Andaman & Nicobar Islands
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-14 pr-32 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg dark:bg-gray-800 dark:border-gray-700"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {recentListings.length}K+
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Active Listings
                  </p>
                </div>
              </Card>
              
              <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    10K+
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Happy Users
                  </p>
                </div>
              </Card>
              
              <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    50K+
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Connections Made
                  </p>
                </div>
              </Card>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span>Instant Messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <span>Local Community</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Browse by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Find exactly what you're looking for
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((category) => {
                const Icon = categoryIcons[category];
                const colorClass = categoryColors[category];
                
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                        {category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Latest Listings
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Fresh picks just for you
                </p>
              </div>
              <Link href="/search">
                <Button variant="outline" className="rounded-full border-2 hover:bg-blue-50 dark:hover:bg-gray-800">
                  View All
                  <TrendingUp className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-56 w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of sellers on AndamanBazaar today. Post your first listing in minutes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/post">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-white text-blue-600 hover:bg-gray-100 shadow-2xl">
                  Post Your First Ad
                  <Package className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-white text-white hover:bg-white/10">
                  Start Browsing
                  <Search className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-white/90">
              <div className="text-center">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm">Free to List</p>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="text-center">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm">Support</p>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="text-center">
                <p className="text-2xl font-bold">Safe</p>
                <p className="text-sm">& Secure</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}