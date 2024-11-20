"use client";

import { GeneralContext } from "@/src/app/general-context";
import { IMatch } from "@/types/match";
import { useParams } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TOpponent = {
  sessionId?: TSessionId;
  username?: string;
  photo_url?: string;
  isBot?: boolean;
};

export type TMatch = IMatch;

export interface IPlayer {
  photo_url: string;
  sessionId: string;
  username: string;
}

export interface IMatchContext {
  matchId?: string;
  match?: TMatch;
  setMatch?: Setter<TMatch>;

  matchDuration?: number;
  setMatchDuration?: Setter<number>;

  opponent?: TOpponent;

  checkedBoxes?: Set<number>;
  setCheckedBoxes?: Setter<Set<number>>;
  protectedBoxes?: Set<number>;
  setProtectedBoxes?: Setter<Set<number>>;
  myCheckedBoxes?: Set<number>;
  setMyCheckedBoxes?: Setter<Set<number>>;
  totalCheckedKokos?: number;
  setTotalCheckedKokos?: Setter<number>;
  myTotalCheckedKokos?: number;
  setMyTotalCheckedKokos?: Setter<number>;
  players?: IPlayer[];
  setPlayers?: Setter<IPlayer[]>;

  toggleBox?: (
    _key: number,
    _props: {
      matchId?: string;
      checked?: boolean;
      mine?: boolean;
      changeTotal?: boolean;
      isProtected?: boolean;
    }
  ) => void;
  resetMatch?: (_half?: boolean) => Promise<void>;
}

export const MatchContext = createContext<IMatchContext>({});

export function MatchContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  // variables
  const { sessionId } = useContext(GeneralContext);
  const [match, setMatch] = useState<TMatch>({});
  const [checkedBoxes, setCheckedBoxes] = useState(() => new Set<number>());
  const [protectedBoxes, setProtectedBoxes] = useState(() => new Set<number>());
  const [myCheckedBoxes, setMyCheckedBoxes] = useState(() => new Set<number>());
  const [totalCheckedKokos, setTotalCheckedKokos] = useState(0);
  const [myTotalCheckedKokos, setMyTotalCheckedKokos] = useState(0);
  const [matchDuration, setMatchDuration] = useState(0);
  const [matchId, setMatchId] = useState("");
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const opponent = useMemo<IPlayer>(
    () => players?.filter((one) => one?.sessionId !== sessionId)?.[0],
    [players, sessionId]
  );

  // other var
  const params = useParams();

  const toggleBox = useCallback(
    (
      key: number,
      props: {
        matchId?: string;
        checked?: boolean;
        mine?: boolean;
        changeTotal?: boolean;
        isProtected?: boolean;
      }
    ) => {
      const id = decodeURIComponent(params?.id?.toString?.() || "");
      const { checked, mine, changeTotal, isProtected } = props;
      console.log("toggleBox", key, matchId, id);

      if (matchId !== id) return;

      const updateSet = (
        setter: React.Dispatch<React.SetStateAction<Set<number>>>
      ) =>
        setter((prev) => {
          const newSet = new Set(prev);
          checked ? newSet.add(Number(key)) : newSet.delete(Number(key));
          return newSet;
        });

      const updateTotal = (
        setter: React.Dispatch<React.SetStateAction<number>>
      ) => setter((prev) => prev + (checked ? 1 : -1));

      updateSet(setCheckedBoxes);
      if (mine || !checked) updateSet(setMyCheckedBoxes);

      if (isProtected) {
        if (checked) updateSet(setProtectedBoxes);
        else if (mine) updateSet(setProtectedBoxes);
      }

      if (changeTotal) {
        updateTotal(setTotalCheckedKokos);
        if (mine) updateTotal(setMyTotalCheckedKokos);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchId, params?.id]
  );

  const resetMatch = useCallback(async (half: boolean = false) => {
    await Promise.all([
      !half && setPlayers([]),
      !half && setCheckedBoxes(new Set()),
      !half && setMyCheckedBoxes(new Set()),
      setMatch({}),
      setProtectedBoxes(new Set()),
      setTotalCheckedKokos(0),
      setMyTotalCheckedKokos(0),
      setMatchDuration(0),
      setMatchId(""),
    ]);
  }, []);

  // effects
  useEffect(() => {
    const id = decodeURIComponent(params?.id?.toString?.() || "");

    console.log("params", id);
    setMatchId(`${id}`);
  }, [params?.id]);

  return (
    <MatchContext.Provider
      value={{
        matchId,
        match,
        setMatch,
        matchDuration,
        setMatchDuration,
        opponent,

        checkedBoxes,
        setCheckedBoxes,
        protectedBoxes,
        setProtectedBoxes,
        myCheckedBoxes,
        setMyCheckedBoxes,
        totalCheckedKokos,
        setTotalCheckedKokos,
        myTotalCheckedKokos,
        setMyTotalCheckedKokos,

        toggleBox,
        resetMatch,

        players,
        setPlayers,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}
