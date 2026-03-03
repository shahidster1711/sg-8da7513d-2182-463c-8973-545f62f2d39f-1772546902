import { supabase } from "@/integrations/supabase/client";
import type { Review } from "@/types";

export async function createReview(
  reviewerId: string,
  sellerId: string,
  listingId: string,
  rating: number,
  comment: string
): Promise<{ data: Review | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        reviewer_id: reviewerId,
        seller_id: sellerId,
        listing_id: listingId,
        rating: rating,
        comment: comment,
      })
      .select("*, profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url)")
      .single();

    if (error) throw error;
    return { data: data as Review, error: null };
  } catch (error) {
    console.error("Error creating review:", error);
    return { data: null, error: error as Error };
  }
}

export async function getSellerReviews(
  sellerId: string
): Promise<{ data: Review[]; error: Error | null; averageRating: number }> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url)")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const reviews = (data || []) as Review[];
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return { data: reviews, error: null, averageRating };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { data: [], error: error as Error, averageRating: 0 };
  }
}

export async function updateReview(
  id: string,
  rating: number,
  comment: string
): Promise<{ data: Review | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("id", id)
      .select("*, profiles!reviews_reviewer_id_fkey(id, full_name, avatar_url)")
      .single();

    if (error) throw error;
    return { data: data as Review, error: null };
  } catch (error) {
    console.error("Error updating review:", error);
    return { data: null, error: error as Error };
  }
}

export async function deleteReview(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error: error as Error };
  }
}