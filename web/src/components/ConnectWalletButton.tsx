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
  const hasConnected = useRef(false);

  useEffect(() => {
    if (isConnected()) {
      const userData = getLocalStorage();
      if (userData?.addresses) {
        const stx = userData.addresses.stx[0].address;
        setConnected(!!stx);
        setAddress(stx);
        if (!!stx && !hasConnected.current) {
          hasConnected.current = true;
          onConnect(stx);
        }
      }
    } else {
      setConnected(false);
      setAddress(undefined);
      hasConnected.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async () => {
    if (isConnected()) {
      console.log("Already authenticated");
      return;
    }

    setConnecting(true);
    try {
      const response = await connect();
      if (response.addresses) {
        const stx = response.addresses.stx[0].address;
        setConnected(!!stx);
        setAddress(stx);
        if (!!stx) {
          hasConnected.current = true;
          onConnect(stx);
        }
      }
    } catch (e) {
      console.error("Connection failed:", e);
    } finally {
      setConnecting(false);
    }
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
      {connecting ? "Connecting..." : "Connect Wallet (Stacks)"}
    </Button>
  );
};

export default ConnectWalletButton;
