import ShopPageClient from "./ShopPageClient";

export const metadata = {
  metadataBase: new URL('https://paregrose.com'),
  title: "Shop - Premium Ethnic Wear Collection | Paregrose",
  description: "Browse our complete collection of premium ethnic wear including sarees, lehengas, gowns, and traditional outfits. Shop by category, size, color, and price with free shipping on orders above ₹999. Best prices on designer ethnic wear.",
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
    "premium fashion",
    "ethnic wear online",
    "designer sarees online",
    "traditional indian wear"
  ],
  openGraph: {
    title: "Shop - Premium Ethnic Wear Collection | Paregrose",
    description: "Browse our complete collection of premium ethnic wear including sarees, lehengas, gowns, and traditional outfits. Shop by category, size, and price.",
    url: "https://paregrose.com/shop",
    siteName: "Paregrose",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://paregrose.com/images/carousel/pic_1.jpg",
        width: 1200,
        height: 630,
        alt: "Paregrose Ethnic Wear Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop - Premium Ethnic Wear Collection | Paregrose",
    description: "Browse our complete collection of premium ethnic wear including sarees, lehengas, gowns, and traditional outfits.",
    images: ["https://paregrose.com/images/carousel/pic_1.jpg"],
    creator: "@paregrose",
    site: "@paregrose",
  },
  alternates: {
    canonical: "https://paregrose.com/shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}

