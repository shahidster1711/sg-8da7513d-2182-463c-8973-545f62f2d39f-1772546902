import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { getListing, markAsSold } from "@/services/listingService";
import { toggleWishlist } from "@/services/wishlistService";
import type { Listing } from "@/types";
import {
  Heart,
  MapPin,
  Calendar,
  MessageCircle,
  Share2,
  Flag,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  }

  async function fetchListing() {
    setLoading(true);
    const { data, error } = await getListing(id as string);

    if (error || !data) {
      toast({
        title: "Error",
        description: "Listing not found",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    setListing(data);

    // Check wishlist status
    if (user) {
      const { data: wishlistData } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", data.id)
        .maybeSingle();

      setIsWishlisted(!!wishlistData);
    }

    setLoading(false);
  }

  async function handleWishlistToggle() {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const newStatus = !isWishlisted;
    setIsWishlisted(newStatus);

    const { error } = await toggleWishlist(user.id, listing!.id, isWishlisted);

    if (error) {
      setIsWishlisted(!newStatus);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  }

  async function handleMarkAsSold() {
    if (!user || !listing) return;

    const { error } = await markAsSold(listing.id, user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as sold",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Listing marked as sold",
      });
      fetchListing();
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Listing link copied to clipboard",
      });
    }
  }

  function handleContact() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/messages?listing=${listing?.id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const isOwner = user?.id === listing.seller_id;

  return (
    <>
      <SEO
        title={`${listing.title} - AndamanBazaar`}
        description={listing.description}
        image={listing.images[0]}
      />

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {listing.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden ${
                        selectedImage === idx
                          ? "ring-2 ring-teal-500"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${listing.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          listing.condition === "new" ? "default" : "secondary"
                        }
                      >
                        {listing.condition === "new" ? "New" : "Used"}
                      </Badge>
                      <Badge variant="outline">{listing.category}</Badge>
                      {listing.status === "sold" && (
                        <Badge variant="destructive" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Sold
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-4">
                  ₹{listing.price.toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(listing.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              {!isOwner && listing.status === "active" && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleContact}
                    className="flex-1"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contact Seller
                  </Button>
                  <Button
                    onClick={handleWishlistToggle}
                    variant="outline"
                    size="lg"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isWishlisted ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button onClick={handleShare} variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {isOwner && listing.status === "active" && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleMarkAsSold}
                    className="flex-1"
                    size="lg"
                  >
                    Mark as Sold
                  </Button>
                  <Button
                    onClick={() => router.push(`/listings/${listing.id}/edit`)}
                    variant="outline"
                    size="lg"
                  >
                    Edit
                  </Button>
                </div>
              )}

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              <Separator />

              {/* Seller Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                  <Link
                    href={`/profile/${listing.seller_id}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={listing.profiles?.avatar_url || ""} />
                      <AvatarFallback>
                        {listing.profiles?.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {listing.profiles?.full_name || "Anonymous"}
                        </p>
                        {listing.profiles?.is_verified && (
                          <CheckCircle2 className="h-4 w-4 text-teal-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {listing.profiles?.location || "Andaman & Nicobar"}
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Report */}
              {!isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                  onClick={() => router.push(`/report/${listing.id}`)}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report this listing
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}