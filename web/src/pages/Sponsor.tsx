import SimpleHeader from "@/components/simple-header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

export default function Sponsor() {
  return (
    <div>
      <SimpleHeader />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Sponsor an Impact</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Thank you for choosing to sponsor a verified impact.
          </p>
          <p className="mb-4"></p>
          <Button asChild>
            <Link to="/pay">Continue to payment</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
