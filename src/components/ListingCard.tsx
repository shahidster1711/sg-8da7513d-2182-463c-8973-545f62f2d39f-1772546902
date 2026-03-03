import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleWishlist } from "@/services/wishlistService";
import { supabase } from "@/integrations/supabase/client";
import type { Listing } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  listing: Listing;
  onWishlistChange?: () => void;
}

export default function ListingCard({
  listing,
  onWishlistChange,
}: ListingCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(
    listing.is_wishlisted || false
  );
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/auth/login";
      return;
    }

    setIsTogglingWishlist(true);
    const newState = !isWishlisted;
    setIsWishlisted(newState); // Optimistic update

    const { error } = await toggleWishlist(
      session.user.id,
      listing.id,
      isWishlisted
    );

    if (error) {
      setIsWishlisted(!newState); // Revert on error
      console.error("Error toggling wishlist:", error);
    } else {
      onWishlistChange?.();
    }

    setIsTogglingWishlist(false);
  }

  const imageUrl = listing.images?.[0] || "/og-image.png";
  const timeAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
  });

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleWishlistToggle}
            disabled={isTogglingWishlist}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Badge
            className="absolute bottom-2 left-2"
            variant={listing.condition === "new" ? "default" : "secondary"}
          >
            {listing.condition}
          </Badge>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            ₹{listing.price.toLocaleString("en-IN")}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{listing.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
            {listing.profiles?.is_verified && (
              <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs">Verified</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}