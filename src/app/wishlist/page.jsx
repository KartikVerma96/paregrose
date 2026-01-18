import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import WishlistPageClient from "./WishlistPageClient";

export const metadata = {
  title: "My Wishlist - Saved Ethnic Wear Items",
  description: "View your saved ethnic wear items in your wishlist. Keep track of your favorite sarees, lehengas, and traditional outfits for future purchase.",
  robots: {
    index: false, // Don't index wishlist pages
    follow: false,
  },
  openGraph: {
    title: "My Wishlist - Saved Ethnic Wear Items | Paregrose",
    description: "View your saved ethnic wear items in your wishlist.",
    url: "https://paregrose.com/wishlist",
  },
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}

