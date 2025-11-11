import SimpleHeader from "@/components/simple-header"
import SimpleFooter from "@/components/simple-footer"

export default function Pay() {
	return (
		<div>
			<SimpleHeader />
			<main className="max-w-4xl mx-auto px-6 py-20">
				<h1 className="text-3xl font-bold mb-4">Payment</h1>
				<p className="text-sm text-[var(--muted-foreground)] mb-4">This page will host the payment flow integration (Paystack/crypto). For now it's a placeholder.</p>
			</main>
			<SimpleFooter />
		</div>
	)
}
