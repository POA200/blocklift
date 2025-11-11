import SimpleHeader from "@/components/simple-header"
import SimpleFooter from "@/components/simple-footer"

export default function About() {
  return (
    <div>
      <SimpleHeader />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">About BlockLift</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">BlockLift brings verifiable, auditable donations to communities using a Bitcoin Layer 2. This placeholder page will be replaced with full content about our mission, team, and partners.</p>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
          <p className="text-sm">More details coming soon.</p>
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}
