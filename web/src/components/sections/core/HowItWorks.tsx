import BlHowitworksimg from "@/assets/images/BlHowitworksimg.png"
import { Lock, MapPin, Zap, Eye } from "lucide-react"

export default function HowItWorks() {
  return (
    <section id="how-it-works" tabIndex={-1} className="w-full bg-[var(--background)] text-[var(--foreground)] py-16 md:py-24 mb-12">
      <style>{`
        .pulse-soft { animation: pulse-soft 1s ease-in-out infinite; transform-origin: center; }
        @keyframes pulse-soft {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
          50% { transform: scale(1.035); box-shadow: 0 18px 40px rgba(0,0,0,0.25); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-soft { animation: none !important; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Content */}
          <div className="w-full md:w-1/2 order-first md:order-last mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-2 text-foreground">
              How It Works:
            </h2>
            <p className="text-sm md:text-lg text-primary font-medium mb-6 md:mb-12">The Transparency Chain</p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary p-3">
                  <Lock />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Donate Securely</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Make a donation using fiat (Paystack) or crypto (Boom Wallet/Stacks).</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary p-3">
                  <MapPin />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Field Verification</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Our partners and Local Ambassadors procure materials and verify delivery on the ground.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary p-3">
                  <Zap />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">NFT Proof of Impact</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">The verification data is instantly written to the Stacks Layer 2, minting a unique NFT receipt for the donor.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary p-3">
                  <Eye />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Auditable Transparency</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">View the transaction hash and NFT on the Impact-Chain Dashboard to trace your donation from payment to verified delivery.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center order-last md:order-first">
            <div className="relative flex items-center justify-center">
              <div className="rounded-full p-6 md:p-10 border-4 border-[var(--primary)] pulse-soft">
                <img src={BlHowitworksimg} alt="How it works" className="w-48 md:w-80 block rounded-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
