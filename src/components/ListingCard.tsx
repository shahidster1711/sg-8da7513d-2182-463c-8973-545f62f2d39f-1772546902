import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock } from "lucide-react";
import { toggleWishlist } from "@/services/wishlistService";
import { useToast } from "@/hooks/use-toast";
import type { Listing } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  listing: Listing;
  onWishlistChange?: () => void;
}

export default function ListingCard({ listing, onWishlistChange }: ListingCardProps) {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(listing.is_wishlisted || false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isTogglingWishlist) return;

    setIsTogglingWishlist(true);
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);

    const { error } = await toggleWishlist(listing.id);

    if (error) {
      setIsWishlisted(!newWishlistState);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } else {
      toast({
        title: newWishlistState ? "Added to wishlist" : "Removed from wishlist",
        description: newWishlistState
          ? "Item saved to your wishlist"
          : "Item removed from wishlist",
      });
      onWishlistChange?.();
    }

    setIsTogglingWishlist(false);
  }

  const imageUrl = listing.images?.[0] || "/placeholder-image.jpg";
  const sellerName = listing.profiles?.full_name || "Anonymous";

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 rounded-2xl">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isTogglingWishlist}
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 z-10"
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>

          {/* Condition Badge */}
          {listing.condition && (
            <Badge 
              className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 border-0 font-semibold"
            >
              {listing.condition === "new" ? "Brand New" : "Used"}
            </Badge>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              ₹{listing.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {listing.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
            </div>
            
            {listing.profiles?.is_verified && (
              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-600 border-0">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}