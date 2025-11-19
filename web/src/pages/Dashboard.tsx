import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import { useEffect, useMemo, useState } from "react";
import { fetchMetrics } from "@/lib/metrics";
import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { waitForTxConfirmed } from "@/components/sections/core/VerificationInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, DollarSign, Package, MapPin } from "lucide-react";
import Seo from "@/components/Seo";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<
    null | "idle" | "loading" | "success" | "error"
  >(null);
  const [verifyMsg, setVerifyMsg] = useState<string>("");

  // tx feed state
  const [txs, setTxs] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txFilter, setTxFilter] = useState<"all" | "success" | "pending">(
    "all"
  );

  const { metrics: liveMetrics, loading: liveLoading } = useImpactMetrics();

  useEffect(() => {
    let mounted = true;
    // Prefer on-chain metrics; fallback to API while loading
    if (liveLoading) {
      fetchMetrics()
        .then((m) => {
          if (!mounted) return;
          setMetrics(Array.isArray(m) ? m : []);
        })
        .catch(() => {})
        .finally(() => mounted && setLoading(false));
    } else {
      setMetrics(liveMetrics);
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [liveMetrics, liveLoading]);

  // Fetch recent transactions for the contract
  useEffect(() => {
    const principal =
      (import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined) || "";
    if (!principal) {
      setTxLoading(false);
      return;
    }
    const network =
      (import.meta.env.VITE_NETWORK as string | undefined) || "mainnet";
    const base = `https://api.${network}.hiro.so`;
    const url = `${base}/extended/v1/address/${principal}/transactions?limit=25`;
    setTxLoading(true);
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((json) => {
        const items = Array.isArray(json?.results) ? json.results : [];
        const filtered = items.filter(
          (t: any) => t.tx_type === "contract_call"
        );
        setTxs(filtered);
      })
      .catch(() => setTxs([]))
      .finally(() => setTxLoading(false));
  }, []);

  const visibleTxs = useMemo(() => {
    if (txFilter === "all") return txs;
    if (txFilter === "success")
      return txs.filter((t) => t.tx_status === "success");
    return txs.filter((t) => t.tx_status !== "success");
  }, [txs, txFilter]);

  const startVerify = async () => {
    const id = verifyInput.trim();
    if (!id) return;
    setVerifyStatus("loading");
    setVerifyMsg("Checking on Stacks…");
    try {
      await waitForTxConfirmed(id);
      setVerifyStatus("success");
      setVerifyMsg("Confirmed on Stacks");
    } catch (e: any) {
      setVerifyStatus("error");
      setVerifyMsg(e?.message || "Unable to verify");
    }
  };

  return (
    <div>
      <Seo
        title="Impact-Chain Dashboard"
        description="Live on-chain distributions, verified impact, and transaction feed powered by Stacks and secured by Bitcoin."
      />
      <Seo
        title="Impact-Chain Dashboard"
        description="Live impact metrics and on-chain distributions tracked on Stacks."
      />
      <SimpleHeader />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Impact-Chain Dashboard
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Live metrics and on-chain distributions.
            </p>
          </div>
        </div>

        {/* Metrics + Verify row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(loading ? new Array(3).fill(null) : metrics)
            .slice(0, 3)
            .map((m: any, i: number) => (
              <Card
                key={m?.key ?? i}
                className="bg-[var(--surface)] border border-[var(--border)]"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-[var(--primary)] inline-flex">
                      {(() => {
                        const key = m?.key || "";
                        const Icon =
                          key === "children_equipped"
                            ? Users
                            : key === "verified_donations"
                            ? DollarSign
                            : key === "nft_proofs"
                            ? Package
                            : MapPin;
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </div>
                    <CardTitle className="text-sm text-[var(--muted-foreground)]">
                      {typeof m?.label === "string" &&
                      /blockchain\s*records/i.test(m.label)
                        ? "NFT Proofs Minted"
                        : m?.label ?? "—"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">
                    {m ? (
                      <span className="font-mono">
                        {m.prefix ?? ""}
                        {m.value?.toLocaleString?.() ?? m.value ?? "—"}
                        {m.suffix ?? ""}
                      </span>
                    ) : (
                      <span className="opacity-40">Loading…</span>
                    )}
                  </div>
                  {m?.desc ? (
                    <p className="text-xs mt-1 text-[var(--muted-foreground)]">
                      {m.desc}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}

          {/* Verify Card */}
          <Card className="bg-[var(--surface)] border border-[var(--border)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Verify Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Tx Hash"
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      startVerify();
                    }
                  }}
                />
                <Button
                  onClick={startVerify}
                  disabled={verifyStatus === "loading"}
                >
                  Verify
                </Button>
              </div>
              {verifyStatus && (
                <div className="mt-2 text-xs">
                  {verifyStatus === "loading" ? (
                    <span className="text-[var(--muted-foreground)]">
                      {verifyMsg}
                    </span>
                  ) : verifyStatus === "success" ? (
                    <span className="text-emerald-500">
                      {verifyMsg}
                      {(() => {
                        const id = verifyInput.trim();
                        if (!id) return null;
                        const network =
                          (import.meta.env.VITE_NETWORK as
                            | string
                            | undefined) || "mainnet";
                        const href = `https://explorer.stacks.co/txid/${id}?chain=${network}`;
                        return (
                          <>
                            {" "}
                            <a
                              className="underline text-[var(--primary)]"
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View on Explorer
                            </a>
                          </>
                        );
                      })()}
                    </span>
                  ) : verifyStatus === "error" ? (
                    <span className="text-destructive">{verifyMsg}</span>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transactions Feed */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-[var(--muted-foreground)]">
            Latest Blockchain Distributions
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant={txFilter === "all" ? "default" : "ghost"}
              onClick={() => setTxFilter("all")}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={txFilter === "success" ? "default" : "ghost"}
              onClick={() => setTxFilter("success")}
            >
              Verified
            </Button>
            <Button
              size="sm"
              variant={txFilter === "pending" ? "default" : "ghost"}
              onClick={() => setTxFilter("pending")}
            >
              Pending
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {txLoading ? (
            <Card className="bg-[var(--surface)] border border-[var(--border)]">
              <CardContent className="py-6">Loading…</CardContent>
            </Card>
          ) : visibleTxs.length === 0 ? (
            <Card className="bg-[var(--surface)] border border-[var(--border)]">
              <CardContent className="py-6">
                No recent distributions.
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible>
              {visibleTxs.map((tx: any) => {
                const network =
                  (import.meta.env.VITE_NETWORK as string | undefined) ||
                  "mainnet";
                const href = `https://explorer.stacks.co/txid/${tx.tx_id}?chain=${network}`;
                const school =
                  tx.contract_call?.function_name?.replace(/[-_]/g, " ") ||
                  "Distribution";
                const status = tx.tx_status;
                const badge =
                  status === "success" ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-600/90">
                      Verified
                    </Badge>
                  ) : status === "pending" ? (
                    <Badge className="bg-orange-500 hover:bg-orange-500/90">
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{status}</Badge>
                  );
                return (
                  <Card
                    key={tx.tx_id}
                    className="bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <AccordionItem value={tx.tx_id}>
                      <AccordionTrigger className="px-4">
                        <div className="flex items-center gap-3 w-full">
                          <div className="font-medium flex-1 text-left">
                            {school}
                          </div>
                          <div className="text-sm text-[var(--muted-foreground)] mr-2">
                            {new Date(
                              tx.burn_block_time * 1000
                            ).toLocaleString?.() || ""}
                          </div>
                          {badge}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="pt-0 px-4 pb-4">
                          <div className="text-sm mb-2 text-[var(--muted-foreground)]">
                            Function:{" "}
                            <span className="text-[var(--foreground)] font-mono">
                              {tx.contract_call?.function_name}
                            </span>
                          </div>
                          <div className="text-sm mb-3 break-all">
                            Tx:{" "}
                            <a
                              className="text-[var(--primary)] underline"
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {tx.tx_id}
                            </a>
                          </div>
                          <div className="text-xs text-[var(--muted-foreground)]">
                            Args:{" "}
                            <span className="font-mono break-all">
                              {JSON.stringify(
                                tx.contract_call?.function_args?.map(
                                  (a: any) => a?.repr ?? a
                                ),
                                null,
                                0
                              )}
                            </span>
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                );
              })}
            </Accordion>
          )}
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
}
