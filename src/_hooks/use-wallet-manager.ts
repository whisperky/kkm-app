import { useState, useCallback } from 'react';
import { useStarWallet } from '@/src/_hooks/use-star-wallet';
import type { WalletConnection, WalletType } from '@/src/types/wallet';

export function useWalletManager() {
  const [activeWallet, setActiveWallet] = useState<WalletConnection | null>(null);
  const starWallet = useStarWallet();

  const connect = useCallback(async (type: WalletType) => {
    let connection: WalletConnection | null = null;

    switch (type) {
      case 'star':
        connection = await starWallet.connect() as unknown as WalletConnection;
        break;

      case "avax":
        // Handle AVAX wallet connection
        break;

      default:
        throw new Error('Unsupported wallet type');
    }

    if (connection) {
      setActiveWallet(connection);
    }
    return connection;
  }, [starWallet]);

  const disconnect = useCallback(async () => {
    if (activeWallet?.type === 'star') {
      await starWallet.disconnect();
    }
    setActiveWallet(null);
  }, [activeWallet, starWallet]);

  return {
    activeWallet,
    connect,
    disconnect,
    isConnected: !!activeWallet?.connected
  };
} 