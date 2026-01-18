// import Card from "@/components/Card";
import BestSeller from "@/components/BestSeller";
import Carousel from "@/components/Carousel";
import SocialProof from "@/components/SocialProof";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import ViewAllCollection from "@/components/ViewAllCollection";
import ViewAllProducts from "@/components/ViewAllProducts";

export const metadata = {
  title: "Premium Ethnic Wear & Designer Fashion",
  description: "Shop the latest collection of premium ethnic wear at Paregrose. Discover exquisite sarees, lehengas, gowns, and traditional outfits for women. Free shipping on orders above ₹999.",
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
    "ethnic fashion"
  ],
  openGraph: {
    title: "Paregrose - Premium Ethnic Wear & Designer Fashion",
    description: "Shop the latest collection of premium ethnic wear at Paregrose. Discover exquisite sarees, lehengas, gowns, and traditional outfits for women.",
    url: "https://paregrose.com",
    images: [
      {
        url: "/images/carousel/carousel_1.jpg",
        width: 1200,
        height: 630,
        alt: "Paregrose Premium Ethnic Wear Collection",
      },
    ],
  },
  twitter: {
    title: "Paregrose - Premium Ethnic Wear & Designer Fashion",
    description: "Shop the latest collection of premium ethnic wear at Paregrose. Discover exquisite sarees, lehengas, gowns, and traditional outfits for women.",
    images: ["/images/carousel/carousel_1.jpg"],
  },
  alternates: {
    canonical: "https://paregrose.com",
  },
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
