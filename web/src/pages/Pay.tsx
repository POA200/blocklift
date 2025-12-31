import { useEffect, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaystackPayment from "@/components/PaystackPayment";
import CryptoPayment from "@/components/CryptoPayment";
import PayPalPayment from "@/components/PayPalPayment";
import SimpleHeader from "@/components/simple-header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/Seo";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { navigate } from "@/lib/router";

const PAYPAL_CURRENCY = "USD";
const PAYPAL_CLIENT_ID: string | undefined = (import.meta as any).env
  ?.VITE_PAYPAL_CLIENT_ID;

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
  // All payment and donor info state is now managed in child components
  // paystackReady is now managed in child if needed
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).PaystackPop) return;
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID || "test",
        currency: PAYPAL_CURRENCY,
      }}
    >
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
              <TabsTrigger
                active={activeTab === "paypal"}
                onClick={() => setActiveTab("paypal")}
              >
                PayPal <CreditCard className="inline-block ml-1 h-4 w-4" />
              </TabsTrigger>
            </TabsList>
            <TabsContent active={activeTab === "fiat"}>
              <PaystackPayment />
            </TabsContent>
            <TabsContent active={activeTab === "crypto"}>
              <CryptoPayment />
            </TabsContent>
            <TabsContent active={activeTab === "paypal"}>
              <PayPalPayment />
            </TabsContent>
          </TabsRoot>
        </main>
        <Footer />
      </div>
    </PayPalScriptProvider>
  );
}
