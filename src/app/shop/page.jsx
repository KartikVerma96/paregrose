import ShopPageClient from "./ShopPageClient";

export const metadata = {
  title: "Shop - Premium Ethnic Wear Collection",
  description: "Browse our complete collection of premium ethnic wear including sarees, lehengas, gowns, and traditional outfits. Shop by category, size, and price with free shipping on orders above ₹999.",
  keywords: [
    "shop ethnic wear",
    "buy sarees online",
    "lehenga collection",
    "gown shopping",
    "traditional wear",
    "ethnic fashion",
    "indian clothing",
    "women fashion store",
    "online shopping",
    "premium fashion"
  ],
  openGraph: {
    title: "Shop - Premium Ethnic Wear Collection | Paregrose",
    description: "Browse our complete collection of premium ethnic wear including sarees, lehengas, gowns, and traditional outfits.",
    url: "https://paregrose.com/shop",
    images: [
      {
        url: "/images/carousel/pic_1.jpg",
        width: 1200,
        height: 630,
        alt: "Paregrose Ethnic Wear Collection",
      },
    ],
  },
  twitter: {
    title: "Shop - Premium Ethnic Wear Collection | Paregrose",
    description: "Browse our complete collection of premium ethnic wear including sarees, lehengas, gowns, and traditional outfits.",
    images: ["/images/carousel/pic_1.jpg"],
  },
  alternates: {
    canonical: "https://paregrose.com/shop",
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}

