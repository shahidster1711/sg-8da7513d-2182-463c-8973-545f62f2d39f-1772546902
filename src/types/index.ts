export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  location: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  condition: "new" | "used";
  images: string[];
  location: string;
  status: "active" | "sold" | "expired";
  created_at: string;
  updated_at: string;
  expires_at: string;
  profiles?: Profile;
  is_wishlisted?: boolean;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  listings?: Listing;
  buyer_profile?: Profile;
  seller_profile?: Profile;
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listings?: Listing;
}

export interface Review {
  id: string;
  reviewer_id: string;
  seller_id: string;
  listing_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface Report {
  id: string;
  reporter_id: string;
  listing_id: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
}

export type Category =
  | "Electronics"
  | "Furniture"
  | "Clothing & Accessories"
  | "Vehicles"
  | "Marine Equipment"
  | "Fresh Produce"
  | "Handicrafts & Souvenirs"
  | "Services"
  | "Jobs"
  | "Real Estate"
  | "Pets"
  | "Miscellaneous";

export type Island =
  | "Port Blair"
  | "Havelock (Swaraj Dweep)"
  | "Neil Island (Shaheed Dweep)"
  | "Baratang"
  | "Car Nicobar"
  | "Little Andaman"
  | "Diglipur"
  | "Rangat"
  | "Other";

export const CATEGORIES: Category[] = [
  "Electronics",
  "Furniture",
  "Clothing & Accessories",
  "Vehicles",
  "Marine Equipment",
  "Fresh Produce",
  "Handicrafts & Souvenirs",
  "Services",
  "Jobs",
  "Real Estate",
  "Pets",
  "Miscellaneous",
];

export const ISLANDS: Island[] = [
  "Port Blair",
  "Havelock (Swaraj Dweep)",
  "Neil Island (Shaheed Dweep)",
  "Baratang",
  "Car Nicobar",
  "Little Andaman",
  "Diglipur",
  "Rangat",
  "Other",
];

export interface SearchFilters {
  query?: string;
  category?: string;
  condition?: "new" | "used";
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "relevance";
}