import { useState } from "react"
import LogoSrc from "@/assets/images/BlockliftLogo.png"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ModeToggle } from "../mode-toggle"
import { ArrowUpRight } from "lucide-react"

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-border z-50 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: logo + nav (nav sits close to logo, ~24px gap) */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src={LogoSrc} alt="Blocklift" className="h-8 w-auto" />
              {/* Show brand text on all sizes (including mobile) */}
              <span className="ml-2 text-lg font-semibold text-foreground">BLOCKLIFT</span>
            </div>

            <nav className="hidden md:flex items-center gap-4">
              <a href="#about" className="text-sm text-foreground hover:text-primary">About</a>
              <a href="#impact" className="text-sm text-foreground hover:text-primary">Impact</a>
              <a href="#partners" className="text-sm text-foreground hover:text-primary">Partners</a>
              <a href="#impact-chain" className="text-sm text-foreground hover:text-primary">Dashboard</a>
            </nav>
          </div>

          {/* Right: action */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA + ModeToggle */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="default" className="cursor-pointer" asChild>
                <a href="#" className="inline-flex items-center gap-2">
                  Sponsor Impact
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <ModeToggle />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-foreground focus:outline-none"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, shown when open */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex flex-col gap-3">
              <a onClick={() => setOpen(false)} href="#about" className="text-sm text-foreground hover:text-foreground">About</a>
              <a onClick={() => setOpen(false)} href="#impact" className="text-sm text-foreground hover:text-foreground">Impact</a>
              <a onClick={() => setOpen(false)} href="#partners" className="text-sm text-foreground hover:text-foreground">Partners</a>
              <a onClick={() => setOpen(false)} href="#impact-chain" className="text-sm text-foreground hover:text-foreground">Dashboard</a>
              <div className="pt-2">
                <Button variant="default" className="w-full" asChild>
                  <a href="#" className="inline-flex items-center justify-between w-full">
                    <span>Sponsor Impact</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="pt-2">
                <ModeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
