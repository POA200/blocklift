import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Input } from "@/components/ui/input";

const PAYPAL_CURRENCY = "USD";
const PAYPAL_TIERS = [5, 10, 50];

interface PayPalPaymentProps {
  onSuccess?: (orderId: string) => void;
  onClose?: () => void;
  currency?: string;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  onSuccess = () => {},
  onClose = () => {},
  currency = PAYPAL_CURRENCY,
}) => {
  const [amountUsd, setAmountUsd] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [processing, setProcessing] = useState(false);
  const emailValid = /.+@.+\..+/.test(donorEmail);

  const handleTierSelect = (tier: number) => {
    setSelectedTier(tier);
    setAmountUsd(tier);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const numeric = Number(val.replace(/[^0-9.]/g, ""));
    if (!isNaN(numeric)) {
      setAmountUsd(numeric);
      setSelectedTier(null);
    } else {
      setAmountUsd(0);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-center">
          Donate via PayPal (USD)
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto text-center">
          Choose a USD donation amount or enter a custom value.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYPAL_TIERS.map((tier) => (
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
              <div className="text-2xl font-bold mb-3">${tier}</div>
              <p className="text-sm text-muted-foreground">
                Support impact logistics with a ${tier} donation.
              </p>
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Custom Amount (USD)
          </label>
          <Input
            type="number"
            min={1}
            placeholder="Enter amount in USD"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="w-full"
          />
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
      </section>
      <section className="flex justify-center">
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "checkout",
          }}
          disabled={processing || amountUsd <= 0 || !emailValid || !donorName}
          forceReRender={[amountUsd]}
          createOrder={async (_data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amountUsd.toFixed(2),
                  },
                  description: "BlockLift Impact Donation",
                },
              ],
              intent: "CAPTURE",
            });
          }}
          onApprove={async (data, actions) => {
            try {
              setProcessing(true);
              const order = await actions.order?.capture();
              const orderId = order?.id || data.orderID || "UNKNOWN-PAYPAL";
              onSuccess(orderId);
            } catch (e) {
              onClose();
            } finally {
              setProcessing(false);
            }
          }}
          onCancel={onClose}
          onError={onClose}
        />
      </section>
    </div>
  );
};

export default PayPalPayment;
