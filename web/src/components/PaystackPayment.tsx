import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAYSTACK_TIERS = [5000, 10000, 50000];
const CURRENCY_SYMBOL = "₦";

const PaystackPayment: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paystackReady] = useState(true); // You may want to check env or script
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [finalReference, setFinalReference] = useState("");
  const emailValid = /.+@.+\..+/.test(donorEmail);

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
    if (!paystackReady || !emailValid || !donorName || amount < 100) return;
    setProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setFinalReference(Date.now().toString());
      setPaymentStatus("success");
      setProcessing(false);
    }, 1200);
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
              ? `Donate (${CURRENCY_SYMBOL})`
              : `Donate (${CURRENCY_SYMBOL})`}
          </Button>
          {!paystackReady && (
            <span className="text-xs text-destructive">
              Payment system not ready. Please try again later.
            </span>
          )}
        </div>
        {paymentStatus === "success" && (
          <div className="text-green-500 text-sm mt-2">
            Donation successful! Reference:{" "}
            <span className="font-mono">{finalReference}</span>
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
