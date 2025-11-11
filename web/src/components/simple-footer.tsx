export default function SimpleFooter() {
  return (
    <footer className="w-full border-t border-border bg-background mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} BlockLift</div>
          <div>
            <a href="/" className="hover:underline">Home</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
