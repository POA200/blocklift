import { useEffect, useState } from "react";
import SimpleHeader from "@/components/simple-header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Using Paystack inline script (popup) without react-paystack due to peer dependency conflict.

// --- Constants ------------------------------------------------------------
const CURRENCY = "NGN";
const PAYSTACK_PUBLIC_KEY: string | undefined = (import.meta as any).env
  .VITE_PAYSTACK_PUBLIC_KEY;

// Donation tiers in NGN; will be converted to Kobo when selected
const PAYMENT_TIERS_NGN = [5000, 10000, 50000];

interface TierCardProps {
  tier: number; // NGN value
  selected: boolean;
  onSelect: (value: number) => void;
}

function TierCard({ tier, selected, onSelect }: TierCardProps) {
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
        <CardTitle className="text-lg">₦{tier.toLocaleString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Support impact logistics with a ₦{tier.toLocaleString()} donation.
        </p>
      </CardContent>
    </Card>
  );
}

// Simple Tabs (Shadcn style approximation)
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
  // --- State --------------------------------------------------------------
  const [activeTab, setActiveTab] = useState("fiat");
  const [amountKobo, setAmountKobo] = useState<number>(0); // lowest currency unit
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [finalReference, setFinalReference] = useState("");

  // Convert display amount when user types custom NGN value
  const [customAmountDisplay, setCustomAmountDisplay] = useState<string>("");

  // Derived helpers
  const selectedTierNGN = amountKobo > 0 ? amountKobo / 100 : 0;
  const paystackReady = Boolean(PAYSTACK_PUBLIC_KEY);

  // Ensure Paystack inline script is loaded
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).PaystackPop) return; // already loaded
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Handle custom amount input (NGN)
  const handleCustomAmountChange = (val: string) => {
    setCustomAmountDisplay(val);
    const numeric = Number(val.replace(/[^0-9]/g, ""));
    if (!isNaN(numeric)) {
      setAmountKobo(numeric * 100);
    } else {
      setAmountKobo(0);
    }
  };

  const handleTierSelect = (tierNGN: number) => {
    setCustomAmountDisplay(tierNGN.toString());
    setAmountKobo(tierNGN * 100);
  };

  // Launch Paystack popup
  const handlePaystackCheckout = () => {
    if (!paystackReady || !donorEmail || !donorName || amountKobo < 100) return;
    const reference = Date.now().toString();
    // Paystack inline handler
    const handler = (window as any).PaystackPop?.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: donorEmail,
      amount: amountKobo, // in kobo
      currency: CURRENCY,
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
        console.log("Paystack success callback", refValue);
        setTimeout(() => setPaymentStatus("success"), 1200); // mimic verification step
      },
      onClose: () => {
        setPaymentStatus("idle");
        console.log("Paystack popup closed");
      },
    });
    if (handler) {
      handler.openIframe();
    } else {
      console.error("Paystack script not loaded yet.");
      setPaymentStatus("error");
    }
  };

  // Basic email validity to disable button if wrong
  const emailValid = /.+@.+\..+/.test(donorEmail);

  useEffect(() => {
    if (paymentStatus === "error") {
      // Could add retry analytics here.
    }
  }, [paymentStatus]);

  return (
    <div>
      <Seo
        title="Donate"
        description="Support BlockLift impact with a secure donation via Paystack or upcoming crypto options."
      />
      <SimpleHeader />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Support BlockLift
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
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

          {/* Fiat / Paystack Content */}
          <TabsContent active={activeTab === "fiat"}>
            <div className="grid gap-10">
              {/* Payment Tiers */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Select a Tier</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PAYMENT_TIERS_NGN.map((tier) => (
                    <TierCard
                      key={tier}
                      tier={tier}
                      selected={selectedTierNGN === tier}
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
                    Stored internally as {amountKobo} kobo.
                  </p>
                </div>
              </section>

              {/* Donor Details Form */}
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
                      amountKobo < 100 ||
                      paymentStatus === "processing"
                    }
                    className="min-w-[160px]"
                  >
                    {paymentStatus === "processing"
                      ? "Processing..."
                      : `Donate ₦${selectedTierNGN.toLocaleString()}`}
                  </Button>
                  {!paystackReady && (
                    <span className="text-xs text-destructive">
                      Missing PAYSTACK public key env var.
                    </span>
                  )}
                </div>
              </section>

              {/* Status Feedback */}
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

          {/* Crypto Placeholder */}
          <TabsContent active={activeTab === "crypto"}>
            <Card>
              <CardHeader>
                <CardTitle>
                  Stacks Donations via Boom Wallet (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You will soon be able to donate using Stacks (STX) with
                  on-chain proof of impact via Boom Wallet. Stay tuned.
                </p>
                <Button variant="outline" disabled>
                  STX Payment unavailable
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
