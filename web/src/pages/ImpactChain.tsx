import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import Seo from "@/components/Seo";

export default function ImpactChain() {
  return (
    <div>
      <Seo
        title="Impact Chain"
        description="Trace education sponsorships with verifiable, on-chain records on the BlockLift Impact Chain."
      />
      <SimpleHeader />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Impact Chain</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          This page will host the Impact-Chain dashboard and tracing tools. For
          now it's a placeholder that points to the Dashboard route.
        </p>
      </main>
      <SimpleFooter />
    </div>
  );
}
