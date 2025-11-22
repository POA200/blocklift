import { useEffect, useState } from "react";
import SimpleHeader from "@/components/simple-header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { navigate } from "@/lib/router";

// Constants
const PAYSTACK_PUBLIC_KEY: string | undefined = (import.meta as any).env
  .VITE_PAYSTACK_PUBLIC_KEY;
const PAYMENT_TIERS: number[] = [5000, 10000, 50000];

interface TierCardProps {
  tier: number;
  selected: boolean;
  currencySymbol: string;
  onSelect: (value: number) => void;
}
function TierCard({ tier, selected, currencySymbol, onSelect }: TierCardProps) {
  return (
    <Card
      onClick={() => onSelect(tier)}
      className={
        "cursor-pointer transition-colors select-none" +
        (selected
          ? " border-primary ring-2 ring-primary/50 bg-accent"
          : " hover:bg-accent/40")
      }
    >
      <CardHeader>
        <CardTitle className="text-lg">
          {currencySymbol}
          {tier.toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Support impact logistics with a {currencySymbol}
          {tier.toLocaleString()} donation.
        </p>
      </CardContent>
    </Card>
  );
}

function TabsRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6" data-slot="tabs-root">
      {children}
    </div>
  );
}
function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="tabs-list"
      className="flex items-center gap-2 rounded-md bg-muted/40 p-1"
      role="tablist"
    >
      {children}
    </div>
  );
}
interface TabsTriggerProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
function TabsTrigger({ active, onClick, children }: TabsTriggerProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      onClick={onClick}
      className={
        "px-4 py-2 text-sm rounded-md transition-colors" +
        (active
          ? " bg-background shadow-sm border border-border"
          : " text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
function TabsContent({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  if (!active) return null;
  return <div data-slot="tabs-content">{children}</div>;
}

export default function Pay() {
  const [activeTab, setActiveTab] = useState("fiat");
  const [amountMinor, setAmountMinor] = useState(0); // kobo
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [finalReference, setFinalReference] = useState("");
  const [customAmountDisplay, setCustomAmountDisplay] = useState("");

  const paystackReady = Boolean(PAYSTACK_PUBLIC_KEY);
  const selectedTierAmount = amountMinor > 0 ? amountMinor / 100 : 0;
  const currencySymbol = "₦";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).PaystackPop) return;
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountDisplay(val);
    const numeric = Number(val.replace(/[^0-9]/g, ""));
    if (!isNaN(numeric)) setAmountMinor(numeric * 100);
    else setAmountMinor(0);
  };
  const handleTierSelect = (tier: number) => {
    setCustomAmountDisplay(String(tier));
    setAmountMinor(tier * 100);
  };
  // Removed currency switching (NGN only)
  const handlePaystackCheckout = () => {
    if (!paystackReady || !donorEmail || !donorName || amountMinor < 100)
      return;
    const reference = Date.now().toString();
    const handler = (window as any).PaystackPop?.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: donorEmail,
      amount: amountMinor,
      currency: "NGN",
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: donorName,
          },
        ],
      },
      callback: (response: any) => {
        const refValue = response?.reference || reference;
        setFinalReference(refValue);
        setPaymentStatus("processing");
        // Record payment asynchronously
        fetch("http://localhost:3000/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: refValue,
            amountMinor,
            donorName,
            donorEmail,
          }),
        })
          .catch(() => {})
          .finally(() => setTimeout(() => setPaymentStatus("success"), 1200));
      },
      onClose: () => {
        setPaymentStatus("idle");
      },
    });
    if (handler) handler.openIframe();
    else setPaymentStatus("error");
  };
  const emailValid = /.+@.+\..+/.test(donorEmail);

  return (
    <div>
      <Seo
        title="Donate"
        description="Support BlockLift impact with a secure donation via Paystack or upcoming crypto options."
      />
      <SimpleHeader />
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        {/* Return Button */}
        <div className="max-w-3xl mx-auto -mt-6 mb-10 text-left">
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
            Back
          </Button>
        </div>
        <header className="space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Support BlockLift
          </h1>
          <p className="text-sm md:text-base text-foreground max-w-2xl mx-auto">
            Choose a donation tier or enter a custom amount. Your transaction
            reference helps us create verifiable on-chain impact records.
          </p>
        </header>
        <TabsRoot>
          <TabsList>
            <TabsTrigger
              active={activeTab === "fiat"}
              onClick={() => setActiveTab("fiat")}
            >
              Fiat (Paystack)
            </TabsTrigger>
            <TabsTrigger
              active={activeTab === "crypto"}
              onClick={() => setActiveTab("crypto")}
            >
              Crypto (Stacks)
            </TabsTrigger>
          </TabsList>
          <TabsContent active={activeTab === "fiat"}>
            <div className="grid gap-10">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Select a Tier</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PAYMENT_TIERS.map((tier) => (
                    <TierCard
                      key={tier}
                      tier={tier}
                      selected={selectedTierAmount === tier}
                      currencySymbol={currencySymbol}
                      onSelect={handleTierSelect}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Custom Amount (NGN)
                  </label>
                  <Input
                    type="number"
                    min={100}
                    placeholder="Enter amount in NGN"
                    value={customAmountDisplay}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Stored internally as {amountMinor} kobo.
                  </p>
                </div>
              </section>
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Donor Info</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    type="button"
                    variant="default"
                    onClick={handlePaystackCheckout}
                    disabled={
                      !paystackReady ||
                      !emailValid ||
                      !donorName ||
                      amountMinor < 100 ||
                      paymentStatus === "processing"
                    }
                    className="min-w-[160px]"
                  >
                    {paymentStatus === "processing"
                      ? "Processing..."
                      : selectedTierAmount > 0
                      ? `Donate ${currencySymbol}${selectedTierAmount.toLocaleString()}`
                      : `Donate (${currencySymbol})`}
                  </Button>
                  {!paystackReady && (
                    <span className="text-xs text-destructive">
                      Payment system not ready. Please try again later.
                    </span>
                  )}
                </div>
              </section>
              <section>
                {paymentStatus === "success" && (
                  <Card className="border-green-500">
                    <CardHeader>
                      <CardTitle className="text-green-600 dark:text-green-400">
                        Donation Successful
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-foreground">
                        Reference:{" "}
                        <span className="font-mono">{finalReference}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You can track verifiable impact soon. Visit the
                        dashboard to explore metrics.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/dashboard")}
                      >
                        Go to Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )}
                {paymentStatus === "processing" && (
                  <Card className="border-primary animate-pulse">
                    <CardHeader>
                      <CardTitle>Processing Donation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Verifying transaction reference{" "}
                        <span className="font-mono">{finalReference}</span>...
                      </p>
                    </CardContent>
                  </Card>
                )}
                {paymentStatus === "idle" && finalReference && (
                  <Card className="border-warning">
                    <CardHeader>
                      <CardTitle>Payment Closed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        You closed the payment window. Reference{" "}
                        <span className="font-mono">{finalReference}</span> was
                        generated but not confirmed.
                      </p>
                    </CardContent>
                  </Card>
                )}
                {paymentStatus === "error" && (
                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Something went wrong. Please retry or contact support.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>
          </TabsContent>
          <TabsContent active={activeTab === "crypto"}>
            <Card>
              <CardHeader>
                <CardTitle>Stacks Donations (Coming Soon)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Soon you can donate using Stacks (STX) with on-chain proof of
                  impact. Stay tuned.
                </p>
                <Button variant="outline" disabled>
                  STX Payment Unavailable
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </TabsRoot>
      </main>
      <Footer />
    </div>
  );
}
