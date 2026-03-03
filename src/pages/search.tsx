import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import { searchListings } from "@/services/listingService";
import { supabase } from "@/integrations/supabase/client";
import type { Listing, SearchFilters } from "@/types";
import { CATEGORIES, ISLANDS } from "@/types";
import ListingCard from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Search() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: (router.query.q as string) || "",
    category: (router.query.category as string) || "",
    condition: router.query.condition as "new" | "used" | undefined,
    minPrice: router.query.minPrice ? Number(router.query.minPrice) : undefined,
    maxPrice: router.query.maxPrice ? Number(router.query.maxPrice) : undefined,
    location: (router.query.location as string) || "",
    sortBy: (router.query.sortBy as any) || "newest",
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    performSearch(0, true);
  }, [filters, userId]);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUserId(session?.user?.id || null);
  }

  async function performSearch(pageNum: number, reset: boolean = false) {
    setLoading(true);

    const { data, hasMore: more } = await searchListings(
      filters,
      userId || undefined,
      pageNum,
      20
    );

    if (reset) {
      setListings(data);
    } else {
      setListings((prev) => [...prev, ...data]);
    }

    setHasMore(more);
    setPage(pageNum);
    setLoading(false);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateUrlAndSearch();
  }

  function updateUrlAndSearch() {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.category) params.set("category", filters.category);
    if (filters.condition) params.set("condition", filters.condition);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.location) params.set("location", filters.location);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    router.push(`/search?${params.toString()}`, undefined, { shallow: true });
    performSearch(0, true);
  }

  function clearFilters() {
    setFilters({
      query: "",
      category: "",
      condition: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      location: "",
      sortBy: "newest",
    });
  }

  function loadMore() {
    performSearch(page + 1, false);
  }

  return (
    <>
      <SEO
        title="Search - AndamanBazaar"
        description="Search for products and services in the Andaman and Nicobar Islands"
      />

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <Card className="p-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for anything..."
                value={filters.query}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                className="flex-1"
              />
              <Button type="submit">
                <SearchIcon className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </form>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, location: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Islands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Islands</SelectItem>
                      {ISLANDS.map((island) => (
                        <SelectItem key={island} value={island}>
                          {island}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select
                    value={filters.condition || ""}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        condition: value ? (value as "new" | "used") : undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Condition</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Min Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3 flex gap-2">
                  <Button onClick={updateUrlAndSearch} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Results */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {listings.length} {listings.length === 1 ? "result" : "results"} found
            </h2>
          </div>

          {loading && page === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onWishlistToggle={() => performSearch(0, true)}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <Button onClick={loadMore} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No listings found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}