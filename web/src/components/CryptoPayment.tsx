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
import { LogOut, CheckCircle, X, Copy, Check } from "lucide-react";

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
  const [successTxId, setSuccessTxId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
      // Mainnet API
      const url = `https://api.hiro.so/extended/v1/address/${address}/balances`;
      // Testnet API (deprecated)
      // const url = `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`;
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
      if (response.txid) {
        setSuccessTxId(response.txid);
      }
      setAmount("");
    } catch (e) {
      console.error("Transaction failed:", e);
      setError("Transaction failed. Please try again.");
    }
    setPaying(false);
  };

  const closeSuccessModal = () => {
    setSuccessTxId(null);
  };

  const getExplorerUrl = (txId: string) => {
    // Mainnet explorer
    return `https://explorer.stacks.co/txid/${txId}?chain=mainnet`;
    // Testnet explorer (deprecated)
    // return `https://testnet.explorer.stacks.co/txid/${txId}?chain=testnet`;
  };

  const handleCopyAddress = () => {
    if (RECEIVER_ADDRESS) {
      navigator.clipboard.writeText(RECEIVER_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto bg-background">
        <CardHeader>
          <CardTitle>Stacks (STX) Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!walletConnected ? (
            <div className="flex flex-col items-center gap-6">
              {/* Receiver Address Section */}
              <div className="w-full space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Send STX directly from your wallet
                </p>
                <div className="flex items-center gap-2 bg-background p-3 rounded border border-input">
                  <input
                    type="text"
                    value={RECEIVER_ADDRESS}
                    readOnly
                    className="flex-1 bg-transparent text-xs font-mono truncate outline-none"
                  />
                  <button
                    onClick={handleCopyAddress}
                    className="p-2 hover:bg-background rounded transition-colors flex-shrink-0"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="w-full border-t" />

              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-sm text-muted-foreground text-center">
                  Or connect your wallet for a seamless experience
                </p>
                <Button
                  onClick={handleConnectWallet}
                  disabled={connecting}
                  variant="default"
                >
                  {connecting ? "Connecting..." : "Connect Wallet (Stacks)"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs break-all">
                  {walletAddress
                    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                        -4
                      )}`
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

      {/* Success Modal */}
      {successTxId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full bg-background">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex justify-end w-full -mt-2 -mr-2">
                  <button
                    onClick={closeSuccessModal}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <CheckCircle className="h-16 w-16 text-green-500" />

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-600">
                    Payment Successful!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Thank you for your generous donation to Blocklift. Your
                    contribution helps us make a real impact.
                  </p>
                </div>

                <div className="w-full bg-muted p-3 rounded text-left space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Transaction Hash
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-mono break-all text-foreground flex-1">
                      {successTxId}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(successTxId);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="p-1 hover:bg-background rounded transition-colors flex-shrink-0"
                      title="Copy transaction hash"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button asChild className="w-full" variant="default">
                  <a
                    href={getExplorerUrl(successTxId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Stacks Explorer
                  </a>
                </Button>

                <Button
                  onClick={closeSuccessModal}
                  className="w-full"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CryptoPayment;
