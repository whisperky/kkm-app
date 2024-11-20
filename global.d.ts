interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      language_code?: string;
    };
    auth_date: number;
    hash: string;
  };
  ready: () => void;
  openLink: (_url: string) => void;
  StarWallet?: {
    connect: () => Promise<{ address: string }>;
    disconnect: () => Promise<void>;
    transfer: (params: {
      to: string;
      amount: string;
      currency?: string;
    }) => Promise<{ transactionHash: string }>;
  };
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}
