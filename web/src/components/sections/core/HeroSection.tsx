import { Button } from "@/components/ui/button"
import HeroImgShape from "@/assets/images/BlockliftHeroImgShape.png"
import HeroImg from "@/assets/images/BlockliftHeroImgIcon.png"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function HeroSection() {
  return (
    <section id="hero" className="w-full bg-gradient-to-br from-primary/10 via-transparent to-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-18 md:py-60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image first on small screens, second on md+ */}
          <div className="flex items-center justify-center order-first md:order-2">
            <div className="relative w-full max-w-md">
              {/* base hero image (stacked below) - slightly reduced size for better composition */}
              <img
                src={HeroImg}
                alt="Blocklift hero"
                className="w-8/10 md:w-[92%] lg:w-[85%] max-w-[520px] h-auto object-contain relative z-0 mx-auto"
              />

              {/* decorative shape overlayed on top and gently spinning; respect reduced-motion */}
              <img
                src={HeroImgShape}
                alt="Blocklift hero shape"
                aria-hidden
                className="absolute inset-0 m-auto w-3/4 md:w-[85%] h-auto object-contain z-10 pointer-events-none spin-slow"
              />
            </div>
          </div>

          <div className="space-y-4 order-last md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Lifting Communities
              <br />
              Through Education
              <br />
              <span className="text-primary">Secured by Bitcoin.</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-xl">
              BlockLift is the blockchain-powered platform ensuring every donation of essential school supplies to African children is verified, traceable, and transparent on the Bitcoin Layer 2.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button variant="default" className="cursor-pointer w-full px-8 md:w-auto" asChild>
                <Link to="/sponsor" className="inline-flex items-center gap-2">
                  Sponsor an Impact Today
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="cursor-pointer w-full px-8 md:w-auto" asChild>
                <Link to="/dashboard">See Our Impact-Chain</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
