import { ADDRESS_PATTERNS } from './constants';
import type { WalletType } from '../../types/wallet';

export const getWalletType = (address: string): WalletType | null => {
  if (ADDRESS_PATTERNS.STAR.test(address)) return 'star';
  if (ADDRESS_PATTERNS.AVAX.test(address)) return 'avax';
  return null;
};

export const formatWalletAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}; 