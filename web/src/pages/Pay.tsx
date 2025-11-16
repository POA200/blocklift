import SimpleHeader from "@/components/simple-header"
import Footer from "@/components/layout/Footer"

export default function Pay() {
	return (
		<div>
			<SimpleHeader />
			<main className="max-w-4xl mx-auto px-6 py-20">
				<h1 className="text-3xl font-bold mb-4">Payment</h1>
				<p className="text-sm text-[var(--muted-foreground)] mb-4">This page will host the payment flow integration (Paystack/Boom).</p>
			</main>
			<Footer />
		</div>
	)
}
