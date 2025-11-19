import Layout from "../components/layout/Layout";
import Seo from "@/components/Seo";
import HeroSection from "../components/sections/core/HeroSection";
import FocusAreasSection from "../components/sections/core/FocusAreasSection";
import ImpactMetrics from "../components/sections/core/ImpactMetrics";
import VerificationInput from "../components/sections/core/VerificationInput";
import HowItWorks from "../components/sections/core/HowItWorks";
import Partners from "../components/sections/core/Partners";
import ImpactGallery from "../components/sections/core/ImpactGallery";
import BottomCta from "../components/sections/core/BottomCta";
import ImpactVideos from "@/components/sections/core/ImpactVideos";
import EducationCta from "@/components/sections/core/EducationCta";

export default function Home() {
  return (
    <>
      <Seo
        title="Verified Education Impact Secured by Bitcoin"
        description="Lifting communities through verifiable, Bitcoin-secured education sponsorship. Transparent impact tracking on Stacks."
      />
      <Layout>
        <HeroSection />
        <ImpactMetrics />
        <VerificationInput />
        <FocusAreasSection />
        <HowItWorks />
        <Partners />
        <ImpactGallery />
        <ImpactVideos />
        <EducationCta />
        <BottomCta />
      </Layout>
    </>
  );
}
