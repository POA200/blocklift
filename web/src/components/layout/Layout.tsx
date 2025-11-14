import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      {/* add top padding so fixed header + banner don't cover page content (header height ≈ 4rem, banner ≈ 0.75rem) */}
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </div>
  )
}
