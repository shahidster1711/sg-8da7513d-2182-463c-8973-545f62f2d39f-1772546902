import { supabase } from "@/integrations/supabase/client";
import type { Listing } from "@/types";

export async function addToWishlist(
  userId: string,
  listingId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from("wishlists")
      .insert({ user_id: userId, listing_id: listingId });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return { error: error as Error };
  }
}

export async function removeFromWishlist(
  userId: string,
  listingId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("listing_id", listingId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { error: error as Error };
  }
}

export async function getWishlist(
  userId: string,
  page: number = 0,
  pageSize: number = 20
): Promise<{ data: Listing[]; error: Error | null; hasMore: boolean }> {
  try {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("wishlists")
      .select(
        "*, listings!wishlists_listing_id_fkey(*, profiles!listings_seller_id_fkey(id, full_name, avatar_url, location, is_verified))",
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const listings = (data || [])
      .map((item) => item.listings)
      .filter((listing) => listing !== null)
      .map((listing) => ({ ...listing, is_wishlisted: true })) as Listing[];

    const hasMore = count ? from + listings.length < count : false;

    return { data: listings, error: null, hasMore };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { data: [], error: error as Error, hasMore: false };
  }
}

export async function toggleWishlist(
  userId: string,
  listingId: string,
  isWishlisted: boolean
): Promise<{ error: Error | null }> {
  if (isWishlisted) {
    return removeFromWishlist(userId, listingId);
  } else {
    return addToWishlist(userId, listingId);
  }
}