import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import ListingCard from "@/components/ListingCard";
import { supabase } from "@/integrations/supabase/client";
import type { Listing } from "@/types";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
    } else {
      setUser(session.user);
    }
  }

  async function fetchWishlist() {
    const { data, error } = await supabase
      .from("wishlists")
      .select(`
        listing_id,
        listings (
          *,
          profiles:seller_id (*)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const wishlistListings = data
        .map((item: any) => ({
          ...item.listings,
          is_wishlisted: true,
        }))
        .filter(Boolean);
      setListings(wishlistListings);
    }

    setLoading(false);
  }

  if (!user || loading) {
    return null;
  }

  return (
    <>
      <SEO
        title="My Wishlist - AndamanBazaar"
        description="View your saved listings"
      />

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-teal-600 fill-teal-600" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-20 w-20 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-semibold mb-2">No saved items yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start adding items to your wishlist to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onWishlistChange={fetchWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}