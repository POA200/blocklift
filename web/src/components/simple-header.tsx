import { Link } from "react-router-dom"
import LogoSrc from "@/assets/images/BlockliftLogo.png"

export default function SimpleHeader() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link to="/hero" className="inline-flex items-center gap-3" aria-label="Blocklift home">
          <img src={LogoSrc} alt="Blocklift" className="h-8 w-auto" />
          <span className="text-sm font-semibold text-foreground">BLOCKLIFT</span>
        </Link>
      </div>
    </header>
  )
}
