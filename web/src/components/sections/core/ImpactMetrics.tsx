
export default function ImpactMetrics() {
  const metrics = [
    {
      label: "Children Served",
      desc: "Across Lagos and Abuja (as of Q4 2025)",
      value: "5,000+",
    },
    {
      label: "Verified Donations",
      desc: "Total Impact Value Recorded on Stacks",
      value: "$12,500",
    },
    {
      label: "NGO Partners",
      desc: "Active Collaborators on the Ground",
      value: "3",
    },
    {
      label: "Countries",
      desc: "Currently operating in Nigeria, expanding soon",
      value: "1",
    },
  ]

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-extrabold">Impact Metrics</h2>
          <p className="text-sm md:text-lg text-muted-foreground">(Trust &amp; Credibility)</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center text-center">
            {metrics.map((m) => (
              <div key={m.label} className="p-4">
                <div className="text-lg font-medium text-primary mb-2">{m.label}</div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-2">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
