export const WALLET_TYPES = {
  STAR: 'star',
  AVAX: 'avax',
} as const;

export const WALLET_ERRORS = {
  NOT_AVAILABLE: 'WALLET_NOT_AVAILABLE',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  USER_REJECTED: 'USER_REJECTED',
} as const;

export const ADDRESS_PATTERNS = {
  STAR: /^STAR[0-9A-Za-z]{32,44}$/,
  AVAX: /^0x[a-fA-F0-9]{40}$/,
}; 