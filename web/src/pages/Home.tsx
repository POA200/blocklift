import Layout from "../components/layout/Layout"
import HeroSection from "../components/sections/core/HeroSection"
import FocusAreasSection from "../components/sections/core/FocusAreasSection"
import ImpactMetrics from "../components/sections/core/ImpactMetrics"
import VerificationInput from "../components/sections/core/VerificationInput"
import HowItWorks from "../components/sections/core/HowItWorks"
import Collaborations from "../components/sections/core/Collaborations"
import BottomCta from "../components/sections/core/BottomCta"

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <ImpactMetrics />
      <VerificationInput />
      <FocusAreasSection />
      <HowItWorks />
      <Collaborations />
      <BottomCta />
    </Layout>
  )
}
