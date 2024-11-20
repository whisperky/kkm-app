"use client";

import { useWalletManager } from "@/src/_hooks/use-wallet-manager";
import { Button } from "../ui/button";
import { formatWalletAddress } from "@/src/lib/wallet/helpers";

export function WalletConnectButton() {
  const { activeWallet, connect, disconnect, isConnected } = useWalletManager();

  return (
    <Button
      onClick={isConnected ? disconnect : () => connect("star")}
      className="mb-2 w-full bg-[#E5E1D3] text-base h-8 rounded-xl border-2 border-[#A07546] hover:bg-[#D5D1C3]"
    >
      {isConnected
        ? formatWalletAddress(activeWallet?.address || "")
        : "Connect Star Wallet"}
    </Button>
  );
}
