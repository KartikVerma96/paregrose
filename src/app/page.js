import BestSeller from "@/components/BestSeller";
import Carousel from "@/components/Carousel";
import SocialProof from "@/components/SocialProof";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import ViewAllCollection from "@/components/ViewAllCollection";
import ViewAllProducts from "@/components/ViewAllProducts";

export const metadata = {
  metadataBase: new URL('https://paregrose.com'),
  title: "Premium Ethnic Wear & Designer Fashion | Paregrose",
  description: "Shop the latest collection of premium ethnic wear at Paregrose. Discover exquisite sarees, lehengas, gowns, and traditional outfits for women. Free shipping on orders above ₹999. Best prices on designer ethnic wear.",
  keywords: [
    "premium ethnic wear",
    "designer sarees",
    "lehenga choli",
    "party wear gowns",
    "traditional outfits",
    "women fashion",
    "indian ethnic wear",
    "festive collection",
    "wedding wear",
    "ethnic fashion",
    "buy sarees online",
    "lehenga online shopping",
    "designer ethnic wear",
    "traditional indian clothing",
    "premium fashion india"
  ],
  authors: [{ name: "Paregrose" }],
  creator: "Paregrose",
  publisher: "Paregrose",
  openGraph: {
    title: "Paregrose - Premium Ethnic Wear & Designer Fashion",
    description: "Shop the latest collection of premium ethnic wear at Paregrose. Discover exquisite sarees, lehengas, gowns, and traditional outfits for women. Free shipping on orders above ₹999.",
    url: "https://paregrose.com",
    siteName: "Paregrose",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://paregrose.com/images/carousel/carousel_1.jpg",
        width: 1200,
        height: 630,
        alt: "Paregrose Premium Ethnic Wear Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paregrose - Premium Ethnic Wear & Designer Fashion",
    description: "Shop the latest collection of premium ethnic wear at Paregrose. Discover exquisite sarees, lehengas, gowns, and traditional outfits for women.",
    images: ["https://paregrose.com/images/carousel/carousel_1.jpg"],
    creator: "@paregrose",
    site: "@paregrose",
  },
  alternates: {
    canonical: "https://paregrose.com",
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
  category: "Fashion",
};

export default function Home() {
  return (
    <>
      <Carousel />
      <ViewAllProducts/>
      <BestSeller />
      <ViewAllCollection />
      <SocialProof />
      <TrustBadges />
      <Testimonials/>
    </>
  )
}
