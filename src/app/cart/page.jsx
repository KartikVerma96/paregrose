import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartPageClient from "./CartPageClient";

export const metadata = {
  title: "Shopping Cart - Your Selected Items",
  description: "Review your selected ethnic wear items in your shopping cart. Complete your purchase with secure checkout and enjoy free shipping on orders above ₹999.",
  robots: {
    index: false, // Don't index cart pages
    follow: false,
  },
  openGraph: {
    title: "Shopping Cart - Your Selected Items | Paregrose",
    description: "Review your selected ethnic wear items in your shopping cart.",
    url: "https://paregrose.com/cart",
  },
};

export default function CartPage() {
  return <CartPageClient />;
}

