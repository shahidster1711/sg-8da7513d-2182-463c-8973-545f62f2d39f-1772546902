import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Heart, MessageSquare } from "lucide-react";
import { searchListings } from "@/services/listingService";
import { supabase } from "@/integrations/supabase/client";
import type { Listing, Category } from "@/types";
import { CATEGORIES } from "@/types";
import ListingCard from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";

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
    const { data } = await searchListings({}, userId || undefined, 0, 12);
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

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{" "}
              <span className="text-teal-600 dark:text-teal-400">
                AndamanBazaar
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Your trusted local marketplace for the Andaman and Nicobar Islands
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 text-lg"
                />
                <Button type="submit" size="lg" className="h-14 px-8">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <Package className="h-6 w-6 text-teal-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Listings
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recentListings.length}+
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <Heart className="h-6 w-6 text-teal-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Happy Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  1000+
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <MessageSquare className="h-6 w-6 text-teal-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Messages Sent
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  5000+
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Browse Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="p-6 bg-gradient-to-br from-teal-50 to-white dark:from-gray-800 dark:to-gray-850 rounded-lg border-2 border-teal-100 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all hover:shadow-lg"
                >
                  <p className="font-semibold text-gray-900 dark:text-white text-center">
                    {category}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Recent Listings
              </h2>
              <Link href="/search">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Join thousands of sellers on AndamanBazaar today
            </p>
            <Link href="/post">
              <Button size="lg" variant="secondary" className="h-14 px-8">
                Post Your First Listing
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}