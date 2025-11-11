import { useEffect, useState } from "react"
import { impactMetrics, fetchMetrics } from "@/lib/metrics"
import { Users, DollarSign, Package, MapPin } from "lucide-react"

function useCountUp(end: number, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (typeof window === "undefined") return
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      setValue(end)
      return
    }
    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min(1, (timestamp - start) / duration)
      setValue(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(end)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [end, duration])
  return value
}

function formatNumber(n: number) {
  return n.toLocaleString()
}

export default function ImpactMetrics() {
  const [metrics, setMetrics] = useState(() => impactMetrics)

  useEffect(() => {
    let mounted = true
    fetchMetrics().then((m) => {
      if (mounted && Array.isArray(m)) setMetrics(m)
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  return (
    <section id="impact" tabIndex={-1} className="w-full bg-[var(--background)] text-[var(--foreground)] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold">Impact Snapshot</h2>
          <p className="text-sm md:text-lg text-[var(--muted-foreground)]">Key verified results — front and center</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m) => {
              const current = useCountUp(m.value, 1300)
              const Icon = m.key === "children_equipped" ? Users : m.key === "verified_donations" ? DollarSign : m.key === "nft_proofs" ? Package : MapPin
              return (
                <div
                  key={m.key}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center shadow-sm"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 rounded-md bg-primary/10 text-[var(--primary)] inline-flex">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[var(--primary)] mb-2">{m.label}</div>
                  <div className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                    {m.prefix ? `${m.prefix}${formatNumber(current)}` : formatNumber(current)}{m.suffix ?? ""}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-3">{m.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
