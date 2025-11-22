import { useEffect, useState } from "react";
import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentRecord {
  reference: string;
  amountMinor: number;
  donorName: string;
  donorEmail: string;
  timestamp: number;
}

function formatAmount(minor: number) {
  return `₦${(minor / 100).toLocaleString()}`;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export default function ImpactChain() {
  const [latest, setLatest] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/payments/latest");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!cancelled) setLatest(json.data);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Seo
        title="Impact Chain"
        description="Trace education sponsorships with verifiable, on-chain records on the BlockLift Impact Chain."
      />
      <SimpleHeader />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-8">Impact Chain Dashboard</h1>
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Latest Sponsor Payment</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p className="text-sm">Loading latest payment...</p>}
              {!loading && error && (
                <p className="text-sm text-destructive">
                  No payment data: {error}
                </p>
              )}
              {!loading && latest && (
                <div className="space-y-2">
                  <p className="text-lg font-semibold flex items-center gap-2">
                    {formatAmount(latest.amountMinor)} <Badge>NGN</Badge>
                  </p>
                  <p className="text-sm">
                    Sponsor:{" "}
                    <span className="font-medium">{latest.donorName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Email: {latest.donorEmail}
                  </p>
                  <p className="text-xs">
                    Reference:{" "}
                    <span className="font-mono">{latest.reference}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recorded {timeAgo(latest.timestamp)}
                  </p>
                </div>
              )}
              {!loading && !error && !latest && (
                <p className="text-sm text-muted-foreground">
                  No payments recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Next</h2>
          <p className="text-sm text-muted-foreground max-w-prose">
            Upcoming: on-chain anchoring, cryptographic receipts, multi-currency
            support, and transparency explorer for education sponsorship flows.
          </p>
        </section>
      </main>
      <SimpleFooter />
    </div>
  );
}
