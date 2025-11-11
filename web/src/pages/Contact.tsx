import SimpleHeader from "@/components/simple-header"
import SimpleFooter from "@/components/simple-footer"

export default function Contact() {
  return (
    <div>
      <SimpleHeader />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">For inquiries, partnerships, or support, reach out to hello@blocklift.example. This is a placeholder contact page.</p>
      </main>
      <SimpleFooter />
    </div>
  )
}
