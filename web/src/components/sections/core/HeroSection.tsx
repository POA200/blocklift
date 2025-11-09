import { Button } from "@/components/ui/button"
import HeroImg from "@/assets/images/BlockliftHeroImage.png"
import { ArrowUpRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-primary/10 via-transparent to-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center">
          {/* Image first on small screens, second on md+ */}
          <div className="flex items-center justify-center order-first md:order-2">
            <div className="relative w-full max-w-md">
              <img src={HeroImg} alt="Blocklift hero" className="w-full h-auto object-contain" />
            </div>
          </div>

          <div className="space-y-4 order-last md:order-1">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Lifting Communities
              <br />
              Through Education
              <br />
              <span className="text-primary">Secured by Bitcoin.</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              BlockLift is the blockchain-powered platform ensuring every donation of essential school supplies to African children is verified, traceable, and transparent on the Bitcoin Layer 2.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button variant="default" className="cursor-pointer w-full px-8 md:w-auto">
                Sponsor an Impact Today
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="cursor-pointer w-full px-8 md:w-auto">
                See Our Impact-Chain
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
