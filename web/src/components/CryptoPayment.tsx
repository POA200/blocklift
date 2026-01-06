import { useState, useEffect } from "react";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
  request,
} from "@stacks/connect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";

const CryptoPayment: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [paying, setPaying] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const RECEIVER_ADDRESS = import.meta.env.VITE_STX_RECEIVER_ADDRESS;

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = () => {
      if (isConnected()) {
        const userData = getLocalStorage();
        console.log("User data from localStorage:", userData);

        // Find the STX address from the stored addresses
        if (userData?.addresses?.stx && userData.addresses.stx.length > 0) {
          // Find the address object with symbol 'STX' or just use first STX address
          const stxAddressObj =
            userData.addresses.stx.find(
              (addr: any) => addr.symbol === "STX" || !addr.symbol
            ) || userData.addresses.stx[0];

          console.log("STX address object from storage:", stxAddressObj);

          if (stxAddressObj && stxAddressObj.address) {
            const stxAddress = stxAddressObj.address;
            console.log("Extracted address from localStorage:", stxAddress);

            setWalletConnected(true);
            setWalletAddress(stxAddress);
            fetchBalance(stxAddress);
          }
        }
      }
    };

    checkConnection();
  }, []);

  // Fetch balance from Stacks API
  const fetchBalance = async (address: string) => {
    try {
      const url = `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`;
      console.log("Fetching balance from:", url);

      const res = await fetch(url);

      if (!res.ok) {
        console.error("Balance fetch failed:", res.status, res.statusText);
        setBalance(undefined);
        return;
      }

      const data = await res.json();
      console.log("Balance data:", data);

      // STX balance is in microstacks
      const stxBalance = Number(data.stx.balance) / 1e6;
      setBalance(stxBalance);
    } catch (e) {
      console.error("Error fetching balance:", e);
      setBalance(undefined);
    }
  };

  const handleConnectWallet = async () => {
    if (isConnected()) {
      console.log("Already authenticated");
      return;
    }

    setConnecting(true);
    try {
      const response = await connect();
      console.log("Connect response:", response);
      console.log("Addresses array:", response.addresses);

      // Find the STX address from the addresses array
      if (response.addresses && response.addresses.length > 0) {
        // Find the address object with symbol 'STX'
        const stxAddressObj = response.addresses.find(
          (addr: any) => addr.symbol === "STX"
        );

        console.log("STX address object:", stxAddressObj);

        if (stxAddressObj && stxAddressObj.address) {
          const stxAddress = stxAddressObj.address;
          console.log("Extracted STX address:", stxAddress);

          setWalletConnected(true);
          setWalletAddress(stxAddress);
          fetchBalance(stxAddress);
        } else {
          console.error("Could not find STX address in response");
        }
      } else {
        console.error("No addresses found in response");
      }
    } catch (e) {
      console.error("Connection failed:", e);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    setWalletConnected(false);
    setWalletAddress(undefined);
    setBalance(undefined);
    setAmount("");
    setError("");
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      setError("");
      return;
    }
    if (balance !== undefined && num > balance) {
      setError("Please input less than the amount in your wallet.");
    } else {
      setError("");
    }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      // Convert STX to microstacks
      const microAmount = Math.round(Number(amount) * 1e6).toString();

      const response = await request("stx_transferStx", {
        amount: microAmount,
        recipient: RECEIVER_ADDRESS,
        memo: "Blocklift donation",
      });

      console.log("Transaction ID:", response.txid);
      // Optionally show success message
    } catch (e) {
      console.error("Transaction failed:", e);
      setError("Transaction failed. Please try again.");
    }
    setPaying(false);
    setAmount("");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Stacks (STX) Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!walletConnected ? (
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleConnectWallet}
              disabled={connecting}
              variant="default"
            >
              {connecting ? "Connecting..." : "Connect Wallet (Stacks)"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Connect your Stacks wallet to sponsor with STX (Testnet).
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs break-all">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : ""}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDisconnectWallet}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Wallet Balance:</span>
              <span className="font-mono">
                {balance !== undefined ? `${balance} STX` : "..."}
              </span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Amount to Sponsor (STX)
              </label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                placeholder="Enter amount in STX"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                disabled={paying}
              />
              {error && (
                <div className="text-xs text-destructive mt-1">{error}</div>
              )}
            </div>
            <Button
              type="button"
              variant="default"
              className="w-full"
              disabled={
                paying ||
                !amount ||
                !!error ||
                isNaN(Number(amount)) ||
                Number(amount) <= 0 ||
                balance === undefined
              }
              onClick={handlePay}
            >
              {paying ? "Processing..." : "Pay with STX"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoPayment;
