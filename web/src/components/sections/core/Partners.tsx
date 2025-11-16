import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { Users } from "lucide-react"
import labLogo from '@/assets/images/lab.jpg'
import flatLogo from '@/assets/images/flat.jpg'
import BoomLogo from '@/assets/images/Boom.jpg'

const partners = [
	{
		name: "Let Africa Build (LAB)",
		role: "Web3 Education Partner",
		metric: "200 Students Reached",
		xUrl: "https://x.com/LetAfricaBuild",
		url: "https://letafricabuild.com"
	},
	{
		name: "Flatearth Memecoin ($FLAT)",
		role: "Memecoin Partner",
		metric: "1M+ Tokens Donated",
		xUrl: "https://x.com/FlatEarthDev",
		url: "https://flatearthdev.xyz/"
	},
	{
		name: "Boom Wallet",
		role: "Bitcoin-native SocialFi. Marketplace, Chat & Community",
		metric: "Major Supporter",
		xUrl: "https://x.com/boom_wallet",
		url: "https://boom.money"
	},
	{
		name: "Local Ambassadors & Volunteers",
		role: "Field Verification",
		metric: "45 Active Ambassadors",
		xUrl: null,
		url: null
	},
]

export default function Parteners() {

	return (
		<section id="partners" tabIndex={-1} className="w-full text-foreground py-12 mb-12">
			<div className="max-w-7xl mx-auto px-6">
				<p className="text-md md:text-xl font-light text-center text-primary">Impact Network</p>
				<h2 className="text-4xl md:text-5xl font-semibold text-center mb-8 md:mb-12">Partners</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{partners.map((p, i) => (
						<Card key={i} className="px-6 py-8">
							<CardHeader className="flex items-center gap-4">
								{/* LAB, Flatearth logo, Boom logo or generic avatar */}
								{p.name.includes('Let Africa Build') ? (
									<img src={labLogo} alt="Let Africa Build logo" className="w-14 h-14 object-contain rounded-md bg-transparent" />
								) : p.name.includes('Flatearth') ? (
									<img src={flatLogo} alt="Flatearth memecoin" className="w-14 h-14 object-contain rounded-md bg-transparent" />
								) : p.name.includes('Boom') ? (
									<img src={BoomLogo} alt="Boom Wallet" className="w-14 h-14 object-contain rounded-md bg-transparent" />
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

							<CardContent className="">
								<p className="text-sm text-muted-foreground">{p.metric}</p>
							</CardContent>

							<CardFooter className="flex justify-between">
								{p.xUrl ? (
									<Button size="sm" variant="outline" onClick={() => window.open(p.xUrl, '_blank', 'noopener,noreferrer')}>View Partner</Button>
								) : (
									<Button size="sm" variant="outline" disabled>No X profile</Button>
								)}
								{p.url ? (
									<Button className="cursor-pointer" size="sm" variant="default" onClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')}>Visit Website</Button>
								) : (
									<Button size="sm" variant="outline" disabled>No website</Button>
								)}
							</CardFooter>
						</Card>
					))}
					</div>
			</div>
		</section>
	)
}
