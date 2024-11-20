"use client";

import { IBonusCompletion, useFreezingKokos } from "@/services/bonus";
import {
  IGetKoko,
  useGetGoldenKokos,
  useGetKokos,
  useGetMyTotalCheckedKokos,
  useGetProtections,
  useGetTotalCheckedKokos,
} from "@/services/koko";
import { IGetUser } from "@/services/user";
import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import { GeneralContext } from "../general-context";
import moment from "moment";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IMainGameContext {
  webApp?: TelegramWebApp | null;

  user?: IUser | null;
  username?: TSessionId;
  sessionId?: TSessionId;
  checkedBoxes?: Set<number>;
  totalCheckedKokos?: number;
  myTotalCheckedKokos?: number;
  myCheckedBoxes?: Set<number>;
  protectedBoxes?: Set<number>;
  freezing?: boolean;

  setMyCheckedBoxes?: Setter<Set<number>>;
  setProtectedBoxes?: Setter<Set<number>>;
  setMyTotalCheckedKokos?: Setter<number>;
  setFreezing?: Setter<boolean>;
  setCheckedBoxes?: Setter<Set<number>>;
  setTotalCheckedKokos?: Setter<number>;
  toggleBox?: (
    _key: number,
    _checked?: boolean,
    _mine?: boolean,
    _changeTotal?: boolean,
    _isProtected?: boolean,
    _isGoldenKoko?: boolean
  ) => void;
  updateUser?: (_updates: Partial<IUser>) => void;
  myScore?: number;
  addMyScore?: (_score: number) => void;
  startProtectionTime?: string | null;
  setStartProtectionTime?: Setter<string | null>;
  protectionStatus?: "" | "waiting" | "active";
  setProtectionStatus?: Setter<"" | "waiting" | "active">;
  protectionDuration?: number;
  setProtectionDuration?: Setter<number>;
  destroyProtect?: () => void;
  refreshProtection?: () => Promise<any>;
  checkedGoldenKokos?: Set<string>;
  goldenKokos?: Set<string>;
  setCheckedGoldenKokos?: Setter<Set<string>>;

  completionStatus?: IBonusCompletion;
  getCompletionStatus?: (
    _options?: RefetchOptions
  ) => Promise<QueryObserverResult<{ data: IBonusCompletion }, Error>>;

  initialKoko?: InfiniteData<{ data: IGetKoko }, unknown>;
  getUserData?: (
    _options?: RefetchOptions
  ) => Promise<QueryObserverResult<{ data: IGetUser }, Error>>;
}

export const MainGameContext = createContext<IMainGameContext>({});

// const randomId = Math.floor(Math.random() * 10000);

export function MainGameContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    webApp,
    user,
    updateUser,
    username,
    sessionId,
    myScore,
    addMyScore,
    getUserData,
    completionStatus,
    getCompletionStatus,
  } = useContext(GeneralContext);

  const [checkedBoxes, setCheckedBoxes] = useState(() => new Set<number>());
  const [protectedBoxes, setProtectedBoxes] = useState(() => new Set<number>());
  const [checkedGoldenKokos, setCheckedGoldenKokos] = useState(
    () => new Set<string>()
  );
  const [myCheckedBoxes, setMyCheckedBoxes] = useState(() => new Set<number>());
  const [totalCheckedKokos, setTotalCheckedKokos] = useState(0);
  const [myTotalCheckedKokos, setMyTotalCheckedKokos] = useState(0);
  const [freezing, setFreezing] = useState(false);
  const [protectionStatus, setProtectionStatus] = useState<
    "" | "waiting" | "active"
  >("");
  const [protectionDuration, setProtectionDuration] = useState(0);
  const [startProtectionTime, setStartProtectionTime] = useState<string | null>(
    null
  );

  // queries
  const { mutateAsync: getInitialKokos } = useGetKokos();
  const { data: initialTotalCheckedKokos } = useGetTotalCheckedKokos();
  const { mutateAsync: getMyInitialTotalCheckedKokos } =
    useGetMyTotalCheckedKokos();
  const { mutateAsync: freezeKoko } = useFreezingKokos();
  const { data: myProtections, refetch: refreshProtection } = useGetProtections(
    { sessionId }
  );
  const { data: goldenKokos } = useGetGoldenKokos();

  // functions
  const toggleBox = useCallback(
    (
      key: number,
      checked?: boolean,
      mine?: boolean,
      changeTotal?: boolean,
      isProtected?: boolean
    ) => {
      const updateSet = (
        setter: React.Dispatch<React.SetStateAction<Set<number>>>
      ) => {
        setter((prev) => {
          const newSet = new Set(prev);
          checked ? newSet.add(Number(key)) : newSet.delete(Number(key));
          return newSet;
        });
      };

      const updateTotal = (
        setter: React.Dispatch<React.SetStateAction<number>>
      ) => {
        setter((prev) => prev + (checked ? 1 : -1));
      };

      updateSet(setCheckedBoxes);
      if (mine) updateSet(setMyCheckedBoxes);
      if (isProtected) {
        console.log("protected");

        updateSet(setProtectedBoxes);
      }

      if (goldenKokos && goldenKokos.has(key.toString())) {
        setCheckedGoldenKokos((prev) => {
          const newSet = new Set(prev);
          checked ? newSet.add(key.toString()) : newSet.delete(key.toString());
          return newSet;
        });
      }

      if (changeTotal) {
        // console.log("Total checked kokos", key, checked, mine, isProtected);
        updateTotal(setTotalCheckedKokos);
        if (mine) updateTotal(setMyTotalCheckedKokos);
      }
    },
    [goldenKokos]
  );

  const destroyProtect = useCallback(() => {
    setProtectionDuration(0);
    setProtectionStatus("");
    setStartProtectionTime(null);
  }, []);

  // effects
  useEffect(() => {
    const get = async () => {
      const data = await getInitialKokos();
      data?.data?.boxes?.data?.forEach(
        (box) =>
          toggleBox &&
          toggleBox(
            box?.key,
            !!box?.checked,
            box?.lastCheckedByUserId == sessionId,
            false,
            box?.isPermanentlyProtected
          )
      );
    };
    get();
  }, [getInitialKokos, sessionId, toggleBox, goldenKokos]);

  useEffect(() => {
    const initialTotalChecked =
      initialTotalCheckedKokos?.data?.totalChecked ?? 0;
    if (initialTotalChecked !== 0) {
      setTotalCheckedKokos(initialTotalChecked);
    }
  }, [initialTotalCheckedKokos]);

  useEffect(() => {
    if (!sessionId) return;

    const getData = async () => {
      const data = await getMyInitialTotalCheckedKokos({ sessionId });
      setMyTotalCheckedKokos(data?.data?.totalChecked || 0);
    };

    getData?.();
  }, [getMyInitialTotalCheckedKokos, sessionId]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await freezeKoko();
      if (data.some((one: any) => one.isFrozen === true)) {
        setFreezing(true);
      }
    };
    fetchData();
  }, [freezeKoko]);

  useEffect(() => {
    if (!myProtections?.data) return;
    const currentProtection = myProtections?.data?.current?.[0];

    const startAt = currentProtection?.startProtectionTime;
    const duration = currentProtection?.protectionDurationInMinutes || 0;
    const isWaiting = !startAt && !!currentProtection?.created_at;

    console.log("myProtections", currentProtection);
    console.log("protectionWaiting", isWaiting);

    const timeTodestroy = (endsAt: string) => {
      const timeout = moment(endsAt).diff(moment(), "milliseconds");
      if (timeout > 0) setProtectionStatus("active");
      setTimeout(() => destroyProtect(), timeout > 0 ? timeout : 0);
    };

    setStartProtectionTime(startAt);
    setProtectionDuration(duration);
    setProtectionStatus(isWaiting ? "waiting" : "");

    if (startAt && !isWaiting) {
      const endAt = moment(startAt).add(duration, "minutes");
      timeTodestroy(endAt.toISOString());
    }
  }, [destroyProtect, myProtections?.data]);

  const contextValue = useMemo(
    () => ({
      webApp,

      user,
      updateUser,
      username,
      sessionId,
      myScore,
      addMyScore,
      freezing,
      completionStatus,
      getCompletionStatus,
      checkedBoxes,
      totalCheckedKokos,
      myTotalCheckedKokos,
      myCheckedBoxes,
      toggleBox,
      getUserData,
      protectedBoxes,
      setProtectedBoxes,
      setFreezing,
      startProtectionTime,
      setStartProtectionTime,
      protectionDuration,
      setProtectionDuration,
      destroyProtect,
      refreshProtection,
      protectionStatus,
      setProtectionStatus,
      setMyCheckedBoxes,
      setMyTotalCheckedKokos,
      setCheckedBoxes,
      setTotalCheckedKokos,
      goldenKokos,
      checkedGoldenKokos,
      setCheckedGoldenKokos,
    }),
    [
      webApp,
      user,
      updateUser,
      username,
      sessionId,
      myScore,
      addMyScore,
      freezing,
      completionStatus,
      getCompletionStatus,
      checkedBoxes,
      totalCheckedKokos,
      myTotalCheckedKokos,
      myCheckedBoxes,
      toggleBox,
      getUserData,
      protectedBoxes,
      startProtectionTime,
      protectionDuration,
      destroyProtect,
      refreshProtection,
      protectionStatus,
      goldenKokos,
      checkedGoldenKokos,
    ]
  );

  return (
    <MainGameContext.Provider value={contextValue}>
      {children}
    </MainGameContext.Provider>
  );
}
