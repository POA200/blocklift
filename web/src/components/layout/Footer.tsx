import LogoSrc from "@/assets/images/BlockliftLogo.png"
// Use Simple Icons CDN images for brand logos (white fill)
const SI_BASE = "https://cdn.simpleicons.org"

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-4 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <h3 className="text-xl md:text-2xl font-semibold">Join BLOCKLIFT Community</h3>

              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <a href="#" aria-label="X" className="text-muted-foreground hover:text-foreground">
                  <img src={`${SI_BASE}/x/FFFFFF`} alt="X" className="h-6 w-6" />
                </a>
                <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                  <img src={`${SI_BASE}/instagram/FFFFFF`} alt="Instagram" className="h-6 w-6" />
                </a>
                <a href="#" aria-label="TikTok" className="text-muted-foreground hover:text-foreground">
                  <img src={`${SI_BASE}/tiktok/FFFFFF`} alt="TikTok" className="h-6 w-6" />
                </a>
              </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={LogoSrc} alt="Blocklift" className="h-8 w-auto" />
                <span className="text-lg font-semibold">BLOCKLIFT</span>
              </div>
              <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} BLOCKLIFT, All Rights Reserved
                <p>Powered by Stacks</p></div>
              <div className="text-xs text-muted-foreground">
                <p>Contents in this page is proudly designed and developed by iPeter_crx on X(Twitter)</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Core Focus Areas</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Transparency</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Impact-Chain Dashboard</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">NFT Proof</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
