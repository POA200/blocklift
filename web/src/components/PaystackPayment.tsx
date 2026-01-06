import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PAYSTACK_TIERS = [5000, 10000, 50000];
const CURRENCY_SYMBOL = "₦";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const PaystackPayment: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [finalReference, setFinalReference] = useState("");
  const emailValid = /.+@.+\..+/.test(donorEmail);
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      setPaystackReady(true);
      console.log("Paystack script loaded");
    };
    script.onerror = () => {
      console.error("Failed to load Paystack script");
      setPaystackReady(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleTierSelect = (tier: number) => {
    setSelectedTier(tier);
    setAmount(tier);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const numeric = Number(val.replace(/[^0-9.]/g, ""));
    if (!isNaN(numeric)) {
      setAmount(numeric);
      setSelectedTier(null);
    } else {
      setAmount(0);
    }
  };

  const handlePay = () => {
    if (!paystackReady || !emailValid || !donorName || amount < 100) {
      console.log("Payment validation failed", {
        paystackReady,
        emailValid,
        donorName,
        amount,
      });
      return;
    }

    if (!window.PaystackPop) {
      console.error("Paystack is not loaded");
      setPaymentStatus("error");
      return;
    }

    setProcessing(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: donorEmail,
      amount: amount * 100, // Convert to kobo
      currency: "NGN",
      ref: `ref-${Date.now()}`,
      onClose: () => {
        console.log("Payment window closed");
        setProcessing(false);
        setPaymentStatus("error");
      },
      onSuccess: (response: any) => {
        console.log("Payment successful", response);
        setFinalReference(response.reference);
        setPaymentStatus("success");
        setProcessing(false);
        // Reset form
        setTimeout(() => {
          setAmount(0);
          setCustomAmount("");
          setSelectedTier(null);
          setDonorEmail("");
          setDonorName("");
          setPaymentStatus("idle");
          setFinalReference("");
        }, 3000);
      },
    });
    handler.openIframe();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Select a Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYSTACK_TIERS.map((tier) => (
            <button
              key={tier}
              type="button"
              className={`p-6 border rounded-lg text-left transition-all hover:border-primary/50 ${
                selectedTier === tier
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              onClick={() => handleTierSelect(tier)}
            >
              <div className="text-2xl font-bold mb-3">
                {CURRENCY_SYMBOL}
                {tier.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Support impact logistics with a {CURRENCY_SYMBOL}
                {tier.toLocaleString()} donation.
              </p>
            </button>
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
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Stored internally as {amount * 100} kobo.
          </p>
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Donor Info</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            onClick={handlePay}
            disabled={
              !paystackReady ||
              !emailValid ||
              !donorName ||
              amount < 100 ||
              processing
            }
            className="w-fit bg-orange-700 hover:bg-orange-800 text-white"
          >
            {processing
              ? "Processing..."
              : amount > 0
              ? `Donate ${CURRENCY_SYMBOL}${amount.toLocaleString()}`
              : `Donate (${CURRENCY_SYMBOL})`}
          </Button>
          {!paystackReady && (
            <span className="text-xs text-destructive">
              Payment system not ready. Please try again later.
            </span>
          )}
        </div>
        {paymentStatus === "success" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full bg-background">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex justify-end w-full -mt-2 -mr-2">
                    <button
                      onClick={() => setPaymentStatus("idle")}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <CheckCircle className="h-16 w-16 text-green-500" />

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-green-600">
                      Donation Successful!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for your generous donation to Blocklift. Your
                      contribution helps us make a real impact.
                    </p>
                  </div>

                  <div className="w-full bg-muted p-3 rounded text-left space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Transaction Reference
                    </p>
                    <p className="text-xs font-mono break-all text-foreground">
                      {finalReference}
                    </p>
                  </div>

                  <Button
                    onClick={() => setPaymentStatus("idle")}
                    className="w-full"
                    variant="default"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {paymentStatus === "error" && (
          <div className="text-destructive text-sm mt-2">
            Something went wrong. Please retry or contact support.
          </div>
        )}
      </section>
    </div>
  );
};

export default PaystackPayment;
