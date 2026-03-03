import { supabase } from "@/integrations/supabase/client";
import type { Listing, SearchFilters } from "@/types";

export async function createListing(listing: Partial<Listing>) {
  const { data, error } = await supabase
    .from("listings")
    .insert(listing)
    .select()
    .single();

  return { data, error };
}

export async function searchListings(
  filters: SearchFilters,
  userId?: string,
  page = 0,
  limit = 20
) {
  let query = supabase
    .from("listings")
    .select(`*, profiles:seller_id (*)`, { count: "exact" })
    .eq("status", "active");

  // Apply filters
  if (filters.query) {
    // Uses Supabase Full Text Search
    query = query.textSearch("title_description", filters.query);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.condition) {
    query = query.eq("condition", filters.condition);
  }

  if (filters.location) {
    query = query.eq("location", filters.location);
  }

  if (filters.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const from = page * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error searching listings:", error);
    return { data: [], count: 0, hasMore: false, error };
  }

  // If userId is provided, check wishlist status
  let listings = data as Listing[];
  if (userId && listings.length > 0) {
    const { data: wishlistData } = await supabase
      .from("wishlists")
      .select("listing_id")
      .eq("user_id", userId)
      .in(
        "listing_id",
        listings.map((l) => l.id)
      );

    const wishlistedIds = new Set(wishlistData?.map((w) => w.listing_id));
    listings = listings.map((l) => ({
      ...l,
      is_wishlisted: wishlistedIds.has(l.id),
    }));
  }

  return {
    data: listings,
    count,
    hasMore: (count || 0) > to + 1,
    error: null,
  };
}

export async function getListing(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select(`*, profiles:seller_id (*)`)
    .eq("id", id)
    .single();

  return { data: data as Listing, error };
}

export async function markAsSold(id: string, userId: string) {
  const { error } = await supabase
    .from("listings")
    .update({ status: "sold" })
    .eq("id", id)
    .eq("seller_id", userId);

  return { error };
}