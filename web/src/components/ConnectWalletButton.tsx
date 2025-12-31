import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { connect, isConnected, getLocalStorage } from "@stacks/connect";

type Props = {
  onConnect: (address?: string) => void;
};

const ConnectWalletButton: React.FC<Props> = ({ onConnect }) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  // Avoid double-calling onConnect
  const hasConnected = useRef(false);
  useEffect(() => {
    if (isConnected()) {
      const userData = getLocalStorage();
      let stx: string | undefined = undefined;
      if (userData?.addresses?.stx) {
        const stxVal = userData.addresses.stx as any;
        if (Array.isArray(stxVal)) {
          stx = stxVal[0]?.address;
        } else if (
          typeof stxVal === "object" &&
          ("testnet" in stxVal || "mainnet" in stxVal)
        ) {
          stx = stxVal.testnet || stxVal.mainnet;
        }
      }
      setConnected(!!stx);
      setAddress(stx);
      if (!!stx && !hasConnected.current) {
        hasConnected.current = true;
        onConnect(stx);
      }
    } else {
      setConnected(false);
      setAddress(undefined);
      hasConnected.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const response = await connect({ network: "testnet" });
      let stx: string | undefined = undefined;
      const addresses: any = response?.addresses;
      if (addresses?.stx) {
        const stxVal = addresses.stx;
        if (Array.isArray(stxVal)) {
          stx = stxVal[0]?.address;
        } else if (
          typeof stxVal === "object" &&
          ("testnet" in stxVal || "mainnet" in stxVal)
        ) {
          stx = stxVal.testnet || stxVal.mainnet;
        }
      }
      setConnected(!!stx);
      setAddress(stx);
      if (!!stx) {
        hasConnected.current = true;
        onConnect(stx);
      }
    } catch (e) {
      setConnected(false);
      setAddress(undefined);
      hasConnected.current = false;
    }
    setConnecting(false);
  };

  if (connected && address) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground mb-2">
          Wallet Connected
        </span>
        <span className="font-mono text-xs break-all">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={connecting} variant="default">
      {connecting ? "Connecting..." : "Connect Wallet (Testnet)"}
    </Button>
  );
};

export default ConnectWalletButton;
