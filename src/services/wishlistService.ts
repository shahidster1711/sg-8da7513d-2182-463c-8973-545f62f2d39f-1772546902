import { supabase } from "@/integrations/supabase/client";

export async function addToWishlist(userId: string, listingId: string) {
  const { error } = await supabase.from("wishlists").insert({
    user_id: userId,
    listing_id: listingId,
  });
  return { error };
}

export async function removeFromWishlist(userId: string, listingId: string) {
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);
  return { error };
}

export async function toggleWishlist(
  userId: string,
  listingId: string,
  currentStatus: boolean
) {
  if (currentStatus) {
    return removeFromWishlist(userId, listingId);
  } else {
    return addToWishlist(userId, listingId);
  }
}