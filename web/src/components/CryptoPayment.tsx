import { useState, useEffect } from "react";
import { STACKS_TESTNET, defaultUrlFromNetwork } from "@stacks/network";
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
  const RECEIVER_ADDRESS = "ST2BWMDQ6FFHCRGRP1VCAXHSMYTDY8J0T0G16627R";

  // Check if already connected on mount
  useEffect(() => {
    if (isConnected()) {
      const userData = getLocalStorage();
      if (userData?.addresses?.stx && userData.addresses.stx.length > 0) {
        const stxAddress = userData.addresses.stx[0].address;
        setWalletConnected(true);
        setWalletAddress(stxAddress);
        fetchBalance(stxAddress);
      }
    }
  }, []);

  // Fetch balance from Stacks API
  const fetchBalance = async (address: string) => {
    try {
      const url = `${defaultUrlFromNetwork(
        STACKS_TESTNET
      )}/extended/v1/address/${address}/balances`;
      const res = await fetch(url);
      const data = await res.json();
      // STX balance is in microstacks
      setBalance(Number(data.stx.balance) / 1e6);
    } catch (e) {
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
      if (response.addresses && response.addresses.length > 0) {
        const stxAddress = response.addresses[0].address;
        setWalletConnected(true);
        setWalletAddress(stxAddress);
        fetchBalance(stxAddress);
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
