import SimpleHeader from "@/components/simple-header";
import SimpleFooter from "@/components/simple-footer";
import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Users,
  DollarSign,
  Package,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Clock,
  School,
  X,
} from "lucide-react";
import Seo from "@/components/Seo";
import { navigate } from "@/lib/router";

// Type definitions
interface Distribution {
  id: string;
  schoolName: string;
  location: string;
  status: "verified" | "pending";
  studentsImpacted: number;
  timeAgo: string;
  txId: string;
  supplies: string[];
  principal: string;
  establishedYear: number;
  totalStudents: number;
  totalSuppliesDistributed: number;
  imageSrc: string;
  isActive: boolean;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<
    null | "idle" | "loading" | "success" | "error"
  >(null);
  const [verifyMsg, setVerifyMsg] = useState<string>("");

  // Distribution state
  const [txFilter, setTxFilter] = useState<"all" | "verified" | "pending">(
    "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDistribution, setSelectedDistribution] =
    useState<Distribution | null>(null);

  const apiUrl =
    (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

  // Filter distributions
  const visibleDistributions =
    txFilter === "all"
      ? distributions
      : distributions.filter((d) => d.status === txFilter);

  const { metrics: liveMetrics, loading: liveLoading } = useImpactMetrics();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        console.log(
          "Dashboard: Fetching distributions from:",
          `${apiUrl}/api/admin/distributions`
        );
        // Fetch distributions from API
        const distRes = await fetch(`${apiUrl}/api/admin/distributions`);
        console.log("Dashboard: Response status:", distRes.status, distRes.ok);
        if (distRes.ok) {
          const distData = await distRes.json();
          console.log("Dashboard: Fetched distributions:", distData.length);
          if (mounted) {
            setDistributions(distData);
          }
        } else {
          console.error(
            "Dashboard: Failed to fetch distributions:",
            distRes.status,
            distRes.statusText
          );
        }
      } catch (err) {
        console.error("Dashboard: Error fetching distributions:", err);
      }
    };

    // Prefer on-chain metrics; fallback to API while loading
    if (liveLoading) {
      fetchMetrics()
        .then((m) => {
          if (!mounted) return;
          setMetrics(Array.isArray(m) ? m : []);
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) {
            setLoading(false);
          }
        });
    } else {
      setMetrics(liveMetrics);
      setLoading(false);
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [liveMetrics, liveLoading, apiUrl]);

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
        {/* Return Button */}
        <div className="-mt-2 mb-4 text-left">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (typeof window === "undefined") return;
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate("/");
              }
            }}
            aria-label="Return to previous page"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
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

        {/* Distributions Feed */}
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
              variant={txFilter === "verified" ? "default" : "ghost"}
              onClick={() => setTxFilter("verified")}
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
          {visibleDistributions.length === 0 ? (
            <Card className="bg-[var(--surface)] border border-[var(--border)]">
              <CardContent className="py-6">
                No distributions found.
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible>
              {visibleDistributions.map((dist) => {
                const badge =
                  dist.status === "verified" ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-600/90">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-500 hover:bg-orange-500/90">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  );
                return (
                  <Card
                    key={dist.id}
                    className="bg-[var(--surface)] border border-[var(--border)] cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => {
                      setSelectedDistribution(dist);
                      setIsModalOpen(true);
                    }}
                  >
                    <AccordionItem value={dist.id}>
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center gap-3 w-full">
                          <School className="h-5 w-5 text-primary" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{dist.schoolName}</div>
                            <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {dist.location}
                            </div>
                          </div>
                          <div className="text-sm text-[var(--muted-foreground)] mr-2">
                            {dist.timeAgo}
                          </div>
                          {badge}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent onClick={(e) => e.stopPropagation()}>
                        <CardContent className="pt-0 px-4 pb-4">
                          <div className="text-sm mb-2">
                            <span className="text-[var(--muted-foreground)]">
                              Students Impacted:{" "}
                            </span>
                            <span className="font-semibold">
                              {dist.studentsImpacted}
                            </span>
                          </div>
                          <div className="text-sm mb-2">
                            <span className="text-[var(--muted-foreground)]">
                              Supplies:{" "}
                            </span>
                            <span>{dist.supplies.join(", ")}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-[var(--muted-foreground)]">
                              Tx ID:{" "}
                            </span>
                            <span className="font-mono text-xs">
                              {dist.txId}
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

        {/* Distribution Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            {selectedDistribution && (
              <>
                <div className="w-full h-48 bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={selectedDistribution.imageSrc}
                    alt={selectedDistribution.schoolName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <DialogHeader className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-2xl flex items-center gap-2">
                        <School className="h-6 w-6 text-primary" />
                        {selectedDistribution.schoolName}
                      </DialogTitle>
                      <DialogDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-4 w-4" />
                        {selectedDistribution.location}
                      </DialogDescription>
                    </div>
                    {selectedDistribution.isActive && (
                      <Badge className="bg-emerald-600">Active</Badge>
                    )}
                  </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <Card className="border-2 border-primary/20">
                    <CardContent className="p-2 text-center">
                      <Users className="mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold text-foreground">
                        {selectedDistribution.totalStudents}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total Students
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-primary/20">
                    <CardContent className="p-2 text-center">
                      <Package className="mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold text-foreground">
                        {selectedDistribution.totalSuppliesDistributed}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Supplies Distributed
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Principal
                    </span>
                    <span className="font-medium">
                      {selectedDistribution.principal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Established
                    </span>
                    <span className="font-medium">
                      {selectedDistribution.establishedYear}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Last Distribution
                    </span>
                    <span className="font-medium">
                      {selectedDistribution.timeAgo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    {selectedDistribution.status === "verified" ? (
                      <Badge className="bg-emerald-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="py-2">
                    <span className="text-sm text-muted-foreground block mb-2">
                      Recent Supplies
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedDistribution.supplies.map((supply, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Package className="h-3 w-3 mr-1" />
                          {supply}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="cursor-pointer w-full"
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <SimpleFooter />
    </div>
  );
}
