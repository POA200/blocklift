import { Link } from "react-router-dom"
import LogoSrc from "@/assets/images/BlockliftHeaderLogo.svg"
import { ModeToggle } from "./mode-toggle"

export default function SimpleHeader() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3" aria-label="Blocklift home">
          <img src={LogoSrc} alt="Blocklift" className="h-5 w-auto" />
        </Link>

        <div className="flex items-center">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
