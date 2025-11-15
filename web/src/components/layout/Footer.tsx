import LogoSrc from "@/assets/images/BlockliftHeaderLogo.svg"
import { Link } from 'react-router-dom'
// Use Simple Icons CDN images for brand logos (white fill)

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h3 className="text-xl md:text-2xl font-semibold">Join BLOCKLIFT Community</h3>

              <div className="mt-6 flex items-center justify-center gap-6">
          <a
            href="https://x.com/blocklift_stx"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Blocklift on X"
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:opacity-90"
          >
            <img src="https://cdn.simpleicons.org/x/ffffff" alt="X" className="h-6 w-6" />
            <span className="hidden sm:inline text-sm">@blocklift_stx</span>
          </a>

          <a
            href="https://www.instagram.com/blocklift_stx"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Blocklift on Instagram"
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:opacity-90"
          >
            <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" className="h-6 w-6" />
            <span className="hidden sm:inline text-sm">@blocklift_stx</span>
          </a>

          <a
            href="https://www.tiktok.com/@blocklift_stx"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Blocklift on TikTok"
            className="inline-flex items-center gap-2 text-[var(--foreground)] hover:opacity-90"
          >
            <img src="https://cdn.simpleicons.org/tiktok/ffffff" alt="TikTok" className="h-6 w-6" />
            <span className="hidden sm:inline text-sm">@blocklift_stx</span>
          </a>
        </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={LogoSrc} alt="Blocklift" className="h-5 w-auto" />
              </div>
              <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} BLOCKLIFT
                <p className="text-primary">Powered by Stacks</p>
                </div>
              <div className="text-xs">
                <p className="text-muted-foreground">Contents in this page is proudly designed and developed by <a href="https://twitter.com/iPeter_crx" target="_blank" rel="noreferrer noopener" className="text-blue-400">iPeter_crx</a></p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Navigation</h4>
                <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/#about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/#how-it-works">How It Works</Link>
                  </li>
                  <li>
                    <Link to="/#gallery">Gallery</Link>
                  </li>
                  <li>
                    <Link to="/#education-cta">Education</Link>
                  </li>
                </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Transparency</h4>
                <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/dashboard">Impact-Chain Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/#verify">NFT Proof</Link>
                  </li>
                  <li>
                    <a href="https://github.com/POA200/blocklift" target="_blank" rel="noreferrer noopener">GitHub</a>
                  </li>
                </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Legal</h4>
                <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/legal/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/legal/terms">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Contact</h4>
                <ul className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Support</Link>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
