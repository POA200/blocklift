import SimpleHeader from "@/components/simple-header"
import SimpleFooter from "@/components/simple-footer"
import { useEffect, useState } from "react"
import { fetchMetrics } from "@/lib/metrics"

export default function Dashboard() {
	const [metrics, setMetrics] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		fetchMetrics()
			.then((m) => {
				if (!mounted) return
				setMetrics(Array.isArray(m) ? m : [])
			})
			.catch(() => {})
			.finally(() => mounted && setLoading(false))
		return () => { mounted = false }
	}, [])

	return (
		<div>
			<SimpleHeader />
			<main className="max-w-6xl mx-auto px-6 py-12">
				<h1 className="text-2xl md:text-3xl font-semibold mb-4">Impact-Chain Dashboard</h1>
				<p className="text-sm text-[var(--muted-foreground)] mb-6">Latest verified metrics from the network (or the local mock server).</p>

				<div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
					<table className="w-full text-left">
						<thead className="bg-[var(--background)]">
							<tr>
								<th className="px-4 py-3 text-sm">Metric</th>
								<th className="px-4 py-3 text-sm">Value</th>
								<th className="px-4 py-3 text-sm">Description</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td className="px-4 py-6" colSpan={3}>Loading…</td></tr>
							) : metrics.length === 0 ? (
								<tr><td className="px-4 py-6" colSpan={3}>No metrics available.</td></tr>
							) : (
								metrics.map((m) => (
									<tr key={m.key} className="border-t border-[var(--border)]">
										<td className="px-4 py-3 align-top text-sm font-medium">{m.label}</td>
										<td className="px-4 py-3 align-top text-sm font-mono">{m.prefix ?? ''}{m.value}{m.suffix ?? ''}</td>
										<td className="px-4 py-3 align-top text-sm text-[var(--muted-foreground)]">{m.desc}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</main>
			<SimpleFooter />
		</div>
	)
}
