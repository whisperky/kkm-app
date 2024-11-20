import { useState, useEffect } from "react";

// const getRandomAfterOneSecond = (): Promise<number> =>
//   new Promise((resolve) => setTimeout(() => resolve(10001), 1000));

const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (window?.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      setWebApp(window.Telegram.WebApp);
    }
  }, []);

  return webApp;
};

export default useTelegramWebApp;
