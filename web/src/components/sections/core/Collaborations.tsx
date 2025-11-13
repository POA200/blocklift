import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { Users } from "lucide-react"
import labLogo from '@/assets/images/lab.jpg'
import flatLogo from '@/assets/images/flat.jpg'
import { useState } from 'react'
import FocusTrap from '@/components/ui/focus-trap'

const partners = [
	{
		name: "Let Africa Build (LAB)",
		role: "Web3 Education Partner",
		metric: "200 Students Reached",
	},
	{
		name: "Flatearth Memecoin ($FLAT)",
		role: "Memecoin Partner",
		metric: "1M+ Tokens Donated",
	},
	{
		name: "Local Ambassadors & Volunteers",
		role: "Field Verification",
		metric: "45 Active Ambassadors",
	},
]

export default function Collaborations() {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	const closeModal = () => setOpenIndex(null)

	return (
		<section id="partners" tabIndex={-1} className="w-full text-foreground py-12 mb-12">
			<div className="max-w-7xl mx-auto px-6">
				<p className="text-md md:text-xl font-light text-center text-primary">Impact Network</p>
				<h2 className="text-4xl md:text-5xl font-semibold text-center mb-8 md:mb-12">Partners</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{partners.map((p, i) => (
						<Card key={i} className="p-3">
							<CardHeader className="flex items-center gap-4 px-4 py-3">
								{/* LAB, Flatearth logo, or generic avatar */}
								{p.name.includes('Let Africa Build') ? (
									<img src={labLogo} alt="Let Africa Build logo" className="w-14 h-14 object-contain rounded-md bg-transparent" />
								) : p.name.includes('Flatearth') ? (
									<img src={flatLogo} alt="Flatearth memecoin" className="w-14 h-14 object-contain rounded-md bg-transparent" />
								) : (
									<div className="w-14 h-14 flex items-center justify-center rounded-md bg-primary/10">
										<Users className="w-7 h-7 text-primary" />
									</div>
								)}

								<div>
									<CardTitle className="text-sm">{p.name}</CardTitle>
									<CardDescription className="text-xs text-[var(--muted-foreground)]">{p.role}</CardDescription>
								</div>
							</CardHeader>

							<CardContent className="px-4">
								<p className="text-sm text-[var(--muted-foreground)]">{p.metric}</p>
							</CardContent>

							<CardFooter className="px-4 pt-2">
								<Button size="sm" variant="outline" onClick={() => setOpenIndex(i)}>View proof</Button>
							</CardFooter>
						</Card>
					))}
					</div>

					{openIndex !== null && (
						<div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
												<div className="max-w-xl w-full">
													<FocusTrap>
														<Card className="bg-[var(--surface)] border border-[var(--border)]">
															<CardHeader>
																<CardTitle>On-chain Proof — {partners[openIndex].name}</CardTitle>
																<CardDescription className="text-xs text-[var(--muted-foreground)]">Sample placeholder proof details for the selected partner.</CardDescription>
															</CardHeader>
															<CardContent>
																<ul className="list-disc pl-5 space-y-2 text-sm">
																	<li>Proof type: Donation receipt (on-chain)</li>
																	<li>Tx hash: <span className="font-mono">0xabc...123</span></li>
																	<li>Verified on: <span className="font-mono">Stacks Explorer</span></li>
																	<li>Notes: This is a placeholder — replace with real on-chain proof when available.</li>
																</ul>
															</CardContent>
															<CardFooter className="flex justify-end gap-2">
																<Button variant="ghost" onClick={closeModal}>Close</Button>
																<Button onClick={closeModal}>OK</Button>
															</CardFooter>
														</Card>
													</FocusTrap>
												</div>
						</div>
					)}
			</div>
		</section>
	)
}
