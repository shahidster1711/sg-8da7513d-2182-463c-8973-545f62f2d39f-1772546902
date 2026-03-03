import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { ListingCard } from "@/components/ListingCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { getProfile } from "@/services/profileService";
import type { Listing, Profile, Review } from "@/types";
import { MapPin, Star, CheckCircle2, Package } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchListings();
      fetchReviews();
    }
  }, [id]);

  async function fetchProfile() {
    const { data, error } = await getProfile(id as string);
    if (!error && data) {
      setProfile(data);
    }
  }

  async function fetchListings() {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    setListings(data || []);
  }

  async function fetchReviews() {
    const { data } = await supabase
      .from("reviews")
      .select(`*, reviewer:profiles!reviews_reviewer_id_fkey(*)`)
      .eq("seller_id", id)
      .order("created_at", { ascending: false });

    if (data) {
      setReviews(data as Review[]);
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAvgRating(avg);
      }
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${profile.full_name || "User"} - AndamanBazaar`}
        description={`View listings from ${profile.full_name || "this seller"}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="text-3xl">
                    {profile.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">
                      {profile.full_name || "Anonymous User"}
                    </h1>
                    {profile.is_verified && (
                      <CheckCircle2 className="h-6 w-6 text-teal-600" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {reviews.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {avgRating.toFixed(1)} ({reviews.length} reviews)
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{listings.length} active listings</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="listings">
                Listings ({listings.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listings">
              {listings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 dark:text-gray-400">
                    No active listings
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              {reviews.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 dark:text-gray-400">
                    No reviews yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.reviewer?.avatar_url || ""} />
                            <AvatarFallback>
                              {review.reviewer?.full_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium">
                                {review.reviewer?.full_name || "Anonymous"}
                              </p>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}