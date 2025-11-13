import AdsBanner from "./AdsBanner"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AdsBanner />
      <Header />
      {/* add top padding so fixed header doesn't cover page content (header height = 4rem) */}
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
