// import Card from "@/components/Card";
import BestSeller from "@/components/BestSeller";
import Carousel from "@/components/Carousel";
import SocialProof from "@/components/SocialProof";
import TrustBadges from "@/components/TrustBadges";
import ViewAllCollection from "@/components/ViewAllCollection";
import Divider from "@/components/Divider";

export default function Home() {
  return (
    <>
      <Carousel />
      <Divider text="Best Sellers" />
      <BestSeller />
      <Divider text="Collections" />
      <ViewAllCollection />
      <Divider text="What People Say" />
      <SocialProof />
      <Divider text="Trusted By Many" />
      <TrustBadges />
    </>
  )
}
