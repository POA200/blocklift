import SimpleHeader from "@/components/simple-header"
import SimpleFooter from "@/components/simple-footer"

export default function Sponsor() {
  return (
    <div>
      <SimpleHeader />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Sponsor an Impact</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">Thank you for choosing to sponsor a verified impact. This is a minimal sponsor page that will be hooked into the payment flow.</p>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
          <p className="mb-4">We don't yet have a full sponsor flow in this prototype. You can integrate with the /pay flow or a separate payment provider here.</p>
          <a href="/pay" className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md">Continue to payment</a>
        </div>
      </main>
      <SimpleFooter />
    </div>
  )
}
