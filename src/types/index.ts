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

export const ISLANDS = [
  "Port Blair",
  "Havelock",
  "Neil Island",
  "Baratang",
  "Diglipur",
  "Mayabunder",
  "Rangat",
  "Car Nicobar",
  "Great Nicobar",
  "Little Andaman",
  "Other",
] as const;

export type Island = (typeof ISLANDS)[number];

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  location: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: "new" | "used";
  images: string[];
  location: string;
  status: "active" | "sold" | "expired";
  created_at: string;
  updated_at: string;
  is_wishlisted?: boolean; // Virtual field for UI
  profiles?: Profile; // Joined seller profile
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

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  last_message?: Message;
  listing?: Listing;
  other_user?: Profile;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  condition?: "new" | "used";
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "relevance";
}