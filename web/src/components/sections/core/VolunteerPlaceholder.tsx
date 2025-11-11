export default function VolunteerPlaceholder() {
  return (
    <section id="volunteer" className="w-full bg-[var(--background)] text-[var(--foreground)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl font-semibold mb-2">Volunteer / Ambassador Sign-up (Placeholder)</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">We're collecting interest from volunteers and local ambassadors. This placeholder will be replaced by a sign-up form soon.</p>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-4">
          <p className="text-sm">If you'd like to volunteer today, email <a href="mailto:hello@blocklift.org" className="text-primary underline">hello@blocklift.org</a> (placeholder).</p>
        </div>
      </div>
    </section>
  )
}
