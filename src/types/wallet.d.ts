export type WalletType = 'star' | 'avax';

export interface WalletConnection {
  address: string;
  type: WalletType;
  connected: boolean;
}

export interface WalletError {
  code: string;
  message: string;
} 