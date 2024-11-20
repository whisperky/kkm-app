"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import WebApp from "@twa-dev/sdk";
import useTelegramWebApp from "@/src/_hooks/use-telegram";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import {
  IGetUser,
  useGetUser,
  useInitialPoints,
  useUpdateUser,
} from "@/services/user";
import { useUsdt } from "@/services/usdt";
import { usePathname, useRouter } from "next/navigation";
import { IBonusCompletion, useBonusCompletion } from "@/services/bonus";
import { useCheckBetaTester } from "@/services/beta-testers";

// const response = {
//   // Test invoice link format: https://t.me/invoice/test_invoice_[random_string]
//   invoiceLink: "https://t.me/$gU_iUlVi8UXaAAAAl43xRZv1W4M",
// };

export interface IGeneralContext {
  webApp?: TelegramWebApp | null;
  user?: IUser | null;
  username?: TSessionId;
  photo_url?: string;
  sessionId?: TSessionId;
  gameId?: TGameId;
  myScore?: number;
  addMyScore?: (_score: number) => void;
  isLoadingMyScore?: boolean;
  myUsdt?: number;
  addMyUsdt?: (_score: number) => void;
  isLoadingMyUsdt?: boolean;
  updateUser?: (_updates: Partial<IUser>) => void;
  getUserData?: (
    _options?: RefetchOptions
  ) => Promise<QueryObserverResult<{ data: IGetUser }, Error>>;
  completionStatus?: IBonusCompletion;
  getCompletionStatus?: (
    _options?: RefetchOptions
  ) => Promise<QueryObserverResult<{ data: IBonusCompletion }, Error>>;
  isMuted?: boolean;
  handleToggleMute?: () => void;
}

export const GeneralContext = createContext<IGeneralContext>({});

// const randomId = Math.floor(Math.random() * 1000000);

export function GeneralContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const webApp = useTelegramWebApp();
  const router = useRouter();
  const pathName = usePathname();
  const sessionId = useMemo(
    () => (webApp?.initDataUnsafe?.user?.id as TSessionId) || 20002?.toString(),
    [webApp?.initDataUnsafe?.user?.id]
  );
  const username = useMemo(
    () =>
      (webApp?.initDataUnsafe?.user?.username as TSessionId) || "benndalton2",
    [webApp?.initDataUnsafe?.user?.username]
  );
  const photo_url = useMemo(
    () => (webApp?.initDataUnsafe?.user?.photo_url as TSessionId) || "",
    [webApp?.initDataUnsafe?.user?.photo_url]
  );
  const gameId = process.env.NEXT_PUBLIC_1M1_MINI_ID as TGameId;
  const [user, setUser] = useState<IUser | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [myUsdt, setMyUsdt] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<
    IBonusCompletion | undefined
  >();

  // Queries
  const { mutateAsync: checkBetaTester } = useCheckBetaTester();
  const { data: userData, refetch: getUserData } = useGetUser(sessionId);
  const { mutateAsync: updateUserFn } = useUpdateUser();
  const { data: initialPoints, isLoading: isLoadingMyScore } =
    useInitialPoints(sessionId);
  const { data: initialUsdt, isLoading: isLoadingMyUsdt } = useUsdt({
    sessionId,
  });
  const { data: completionStatusData } = useBonusCompletion({ sessionId });

  const addMyScore = useCallback((amount: number) => {
    setMyScore((p) => p + (Number(amount) || 0));
  }, []);

  const addMyUsdt = useCallback((amount: number) => {
    setMyUsdt((p) => Math.abs(p + (Number(amount) || 0)));
  }, []);

  const updateUser = useCallback((updates: Partial<IUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : (updates as IUser)));
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((p) => !p);
  }, []);

  useEffect(() => {
    console.log(myScore);
  }, [myScore]);

  // Telegram WebApp effect
  useEffect(() => {
    WebApp?.ready?.();
    WebApp?.expand?.();

    const backButton = WebApp?.BackButton;
    backButton.onClick(() => {
      try {
        router.push("..");
      } catch (err) {
        router.push("/");
      }
    });

    if (backButton && pathName !== "/") backButton.show?.();
    else backButton.hide?.();

    const handleViewportChange = () => WebApp?.expand?.();
    WebApp.onEvent("viewportChanged", handleViewportChange);
    return () => WebApp.offEvent("viewportChanged", handleViewportChange);
  }, [router, pathName]);

  // useEffect(() => {
  //   console.log("WebApp", WebApp, response.invoiceLink);
  //   WebApp?.openInvoice(response.invoiceLink, (status: any) => {
  //     if (status === "paid") {
  //       //
  //       console.log("paid");
  //     } else {
  //       console.log("not paid", status);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    addMyScore(Number(initialPoints?.total) || 0);
  }, [addMyScore, initialPoints?.total]);

  useEffect(() => {
    addMyUsdt(Number(initialUsdt?.data?.total) || 0);
  }, [addMyUsdt, initialUsdt?.data?.total]);

  useEffect(() => {
    if (!userData?.data?.user) return;

    const update = async () => {
      updateUser({ username: `${username || ""}` });
    };

    updateUser(userData.data.user);
    if (userData?.data?.user?.username !== username) update?.();
  }, [updateUser, updateUserFn, userData?.data?.user, username]);

  useEffect(() => {
    if (completionStatusData?.data) {
      const bonuses = completionStatusData?.data?.bonuses?.filter((one) =>
        one?.userBonuses?.some((two) => two?.status == "claimed")
      );
      setCompletionStatus({ ...completionStatusData.data, bonuses });
    }
  }, [completionStatusData?.data]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const check = async () => {
      const pathName = window.location.pathname;
      if (pathName !== "/not-tester" && pathName !== "/not-mobile") {
        if (!username) {
          timeoutId = setTimeout(() => {
            window.location.assign("/not-tester");
          }, 5000);
        } else {
          clearTimeout(timeoutId);
          const tempTesters = await checkBetaTester(`${username}`);
          if (tempTesters && !tempTesters?.exists) {
            window.location.assign("/not-tester");
          }
        }
      }
    };
    check();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [checkBetaTester, username]);

  const contextValue = useMemo(
    () => ({
      webApp,
      photo_url,
      username,
      sessionId,
      user,
      updateUser,
      getUserData,
      gameId,
      myScore,
      addMyScore,
      isLoadingMyScore,
      completionStatus,
      myUsdt,
      addMyUsdt,
      isLoadingMyUsdt,
      isMuted,
      handleToggleMute,
    }),
    [
      webApp,
      photo_url,
      username,
      sessionId,
      user,
      updateUser,
      getUserData,
      gameId,
      myScore,
      addMyScore,
      isLoadingMyScore,
      completionStatus,
      myUsdt,
      addMyUsdt,
      isLoadingMyUsdt,
      isMuted,
      handleToggleMute,
    ]
  );

  return (
    <GeneralContext.Provider value={contextValue}>
      {children}
    </GeneralContext.Provider>
  );
}
