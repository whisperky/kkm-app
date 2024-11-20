import { useState, useCallback, useEffect } from 'react';
import useTelegramWebApp from './use-telegram';
import toast from 'react-hot-toast';

interface StarWalletState {
  address: string | null;
  isConnecting: boolean;
  isAvailable: boolean;
  error: string | null;
}

interface TransferParams {
  to: string;
  amount: string;
  currency?: string;
}

export function useStarWallet() {
  const webApp = useTelegramWebApp();
  const [state, setState] = useState<StarWalletState>({
    address: null,
    isConnecting: false,
    isAvailable: false,
    error: null,
  });

  // Check if Star Wallet is available when webApp is loaded
  useEffect(() => {
    if (webApp) {
      setState(prev => ({
        ...prev,
        isAvailable: !!webApp.StarWallet
      }));
    }
  }, [webApp]);

  // Connect to Star Wallet
  const connect = useCallback(async () => {
    if (!webApp?.StarWallet) {
      toast.error('Star Wallet is not available');
      return null;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const result = await webApp.StarWallet.connect();
      setState(prev => ({
        ...prev,
        address: result.address,
        isConnecting: false
      }));
      return result.address;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Star Wallet';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isConnecting: false
      }));
      toast.error(errorMessage);
      return null;
    }
  }, [webApp]);

  // Disconnect from Star Wallet
  const disconnect = useCallback(async () => {
    if (!webApp?.StarWallet) {
      return;
    }

    try {
      await webApp.StarWallet.disconnect();
      setState(prev => ({
        ...prev,
        address: null,
        error: null
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect from Star Wallet';
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
      toast.error(errorMessage);
    }
  }, [webApp]);

  // Transfer tokens using Star Wallet
  const transfer = useCallback(async ({ to, amount, currency }: TransferParams) => {
    if (!webApp?.StarWallet) {
      toast.error('Star Wallet is not available');
      return null;
    }

    if (!state.address) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      const result = await webApp.StarWallet.transfer({
        to,
        amount,
        currency
      });
      toast.success('Transfer successful');
      return result.transactionHash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transfer failed';
      toast.error(errorMessage);
      return null;
    }
  }, [webApp, state.address]);

  // Auto-connect if previously connected (optional)
  useEffect(() => {
    const autoConnect = async () => {
      const lastConnected = localStorage.getItem('star-wallet-connected');
      if (lastConnected === 'true') {
        await connect();
      }
    };

    if (state.isAvailable && !state.address) {
      autoConnect();
    }
  }, [state.isAvailable, state.address, connect]);

  // Save connection state to localStorage
  useEffect(() => {
    if (state.address) {
      localStorage.setItem('star-wallet-connected', 'true');
    } else {
      localStorage.removeItem('star-wallet-connected');
    }
  }, [state.address]);

  return {
    // State
    address: state.address,
    isConnecting: state.isConnecting,
    isAvailable: state.isAvailable,
    isConnected: !!state.address,
    error: state.error,

    // Methods
    connect,
    disconnect,
    transfer,

    // Utility getters
    shortAddress: state.address 
      ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}`
      : null
  };
}