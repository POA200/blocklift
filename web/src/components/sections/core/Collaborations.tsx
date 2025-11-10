import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/card"

const partners = [
	{
		name: "Let Africa Build (LAB)",
		role: "Web3 Education Partner",
		metric: "200 Students Reached",
	},
	{
		name: "Lagos Food Bank Initiative (LFBI)",
		role: "Food Distribution Partner",
		metric: "3,400 Meals/mo",
	},
	{
		name: "Local Ambassadors & Volunteers",
		role: "Field Verification",
		metric: "45 Active Ambassadors",
	},
	// Add placeholders to fill grid nicely on larger screens
	{ name: "Community Schools Hub", role: "Education Outreach", metric: "120 Students" },
	{ name: "Green Farms Collective", role: "Sustainability Partner", metric: "15 Farms" },
	{ name: "Microfinance Partners", role: "Donor Matching", metric: "$25K Matched" },
]

export default function Collaborations() {
	return (
		<section className="w-full text-foreground py-12 mb-12">
			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 md:mb-12">Impact Network</h2>

				<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
					{partners.map((p, i) => (
						<Card key={i} className="p-0">
							<CardHeader className="flex items-center gap-4 px-4 py-3">
								<div className="w-14 h-14 bg-zinc-800/40 rounded-md flex items-center justify-center shrink-0" aria-hidden>
									{/* image placeholder */}
									<svg className="w-8 h-8 text-zinc-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
										<path d="M7 14l3-4 2 3 3-4 2 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>

								<div>
									<CardTitle className="text-sm">{p.name}</CardTitle>
									<CardDescription className="text-xs text-[var(--muted-foreground)]">{p.role}</CardDescription>
								</div>
							</CardHeader>

							<CardContent className="px-4 pb-4 pt-0">
								<Badge className="text-xs font-medium" variant={"outline"}>{p.metric}</Badge>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
