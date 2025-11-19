import SimpleHeader from "@/components/simple-header"
import SimpleFooter from "@/components/simple-footer"
import Seo from "@/components/Seo"

export default function Blog() {
  return (
    <div>
      <Seo
        title="Blog"
        description="Updates, impact stories, and announcements from the BlockLift team."
      />
      <SimpleHeader />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">This is a placeholder for the blog. We'll publish updates, impact stories, and announcements here.</p>
      </main>
      <SimpleFooter />
    </div>
  )
}
