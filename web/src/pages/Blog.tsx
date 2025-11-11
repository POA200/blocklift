import SimpleHeader from "@/components/simple-header"
import SimpleFooter from "@/components/simple-footer"

export default function Blog() {
  return (
    <div>
      <SimpleHeader />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">This is a placeholder for the blog. We'll publish updates, impact stories, and announcements here.</p>
      </main>
      <SimpleFooter />
    </div>
  )
}
