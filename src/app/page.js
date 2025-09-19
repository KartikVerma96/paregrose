// import Card from "@/components/Card";
import BestSeller from "@/components/BestSeller";
import Carousel from "@/components/Carousel";
import SocialProof from "@/components/SocialProof";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import ViewAllCollection from "@/components/ViewAllCollection";
import ViewAllProducts from "@/components/ViewAllProducts";

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
