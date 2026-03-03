import { supabase } from "@/integrations/supabase/client";
import type { Listing, SearchFilters } from "@/types";

export async function createListing(
  listing: Omit<Listing, "id" | "created_at" | "updated_at" | "expires_at" | "status">
): Promise<{ data: Listing | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("listings")
      .insert({
        seller_id: listing.seller_id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        images: listing.images,
        location: listing.location,
      })
      .select("*, profiles!listings_seller_id_fkey(id, full_name, avatar_url, location, is_verified)")
      .single();

    if (error) throw error;
    return { data: data as Listing, error: null };
  } catch (error) {
    console.error("Error creating listing:", error);
    return { data: null, error: error as Error };
  }
}

export async function updateListing(
  id: string,
  updates: Partial<Listing>
): Promise<{ data: Listing | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("listings")
      .update(updates)
      .eq("id", id)
      .select("*, profiles!listings_seller_id_fkey(id, full_name, avatar_url, location, is_verified)")
      .single();

    if (error) throw error;
    return { data: data as Listing, error: null };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { data: null, error: error as Error };
  }
}

export async function deleteListing(
  id: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return { error: error as Error };
  }
}

export async function getListing(
  id: string,
  userId?: string
): Promise<{ data: Listing | null; error: Error | null }> {
  try {
    let query = supabase
      .from("listings")
      .select("*, profiles!listings_seller_id_fkey(id, full_name, avatar_url, location, is_verified)")
      .eq("id", id)
      .single();

    const { data, error } = await query;

    if (error) throw error;

    // Check if wishlisted by current user
    if (userId && data) {
      const { data: wishlistData } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", userId)
        .eq("listing_id", id)
        .maybeSingle();

      (data as Listing).is_wishlisted = !!wishlistData;
    }

    return { data: data as Listing, error: null };
  } catch (error) {
    console.error("Error fetching listing:", error);
    return { data: null, error: error as Error };
  }
}

export async function searchListings(
  filters: SearchFilters,
  userId?: string,
  page: number = 0,
  pageSize: number = 20
): Promise<{ data: Listing[]; error: Error | null; hasMore: boolean }> {
  try {
    let query = supabase
      .from("listings")
      .select("*, profiles!listings_seller_id_fkey(id, full_name, avatar_url, location, is_verified)", {
        count: "exact",
      })
      .eq("status", "active");

    // Apply filters
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
      );
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (filters.condition) {
      query = query.eq("condition", filters.condition);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters.location) {
      query = query.eq("location", filters.location);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "relevance":
        // For relevance, we'll use created_at as fallback
        query = query.order("created_at", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Pagination
    const from = page * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const listings = (data || []) as Listing[];

    // Check wishlist status for each listing if user is logged in
    if (userId && listings.length > 0) {
      const listingIds = listings.map((l) => l.id);
      const { data: wishlistData } = await supabase
        .from("wishlists")
        .select("listing_id")
        .eq("user_id", userId)
        .in("listing_id", listingIds);

      const wishlistedIds = new Set(
        (wishlistData || []).map((w) => w.listing_id)
      );

      listings.forEach((listing) => {
        listing.is_wishlisted = wishlistedIds.has(listing.id);
      });
    }

    const hasMore = count ? from + listings.length < count : false;

    return { data: listings, error: null, hasMore };
  } catch (error) {
    console.error("Error searching listings:", error);
    return { data: [], error: error as Error, hasMore: false };
  }
}

export async function getUserListings(
  userId: string,
  page: number = 0,
  pageSize: number = 20
): Promise<{ data: Listing[]; error: Error | null; hasMore: boolean }> {
  try {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("listings")
      .select("*, profiles!listings_seller_id_fkey(id, full_name, avatar_url, location, is_verified)", {
        count: "exact",
      })
      .eq("seller_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const listings = (data || []) as Listing[];
    const hasMore = count ? from + listings.length < count : false;

    return { data: listings, error: null, hasMore };
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return { data: [], error: error as Error, hasMore: false };
  }
}

export async function markAsSold(
  id: string
): Promise<{ error: Error | null }> {
  return updateListing(id, { status: "sold" }).then(({ error }) => ({ error }));
}

export async function renewListing(
  id: string
): Promise<{ error: Error | null }> {
  try {
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 30);

    const { error } = await supabase
      .from("listings")
      .update({
        status: "active",
        expires_at: newExpiresAt.toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error renewing listing:", error);
    return { error: error as Error };
  }
}