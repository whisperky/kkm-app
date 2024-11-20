import type { WalletConnection, WalletError } from '../../src/types/wallet';
import { WALLET_ERRORS } from '../../src/lib/wallet/constants';

export class StarWalletService {
  private webApp: TelegramWebApp;

  constructor(webApp: TelegramWebApp) {
    this.webApp = webApp;
  }

  async connect(): Promise<WalletConnection> {
    try {
      if (!this.webApp?.StarWallet) {
        throw new Error(WALLET_ERRORS.NOT_AVAILABLE);
      }

      const { address } = await this.webApp.StarWallet.connect();
      
      return {
        address,
        type: 'star',
        connected: true
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): WalletError {
    // Handle specific error cases
    return {
      code: WALLET_ERRORS.CONNECTION_FAILED,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 