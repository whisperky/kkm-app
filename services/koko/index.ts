import { useMutation, useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export interface IGetKoko {
  boxes: {
    data: Omit<MainGameKokoType, "value">[];
    total: number;
    size: number;
    start: number;
    end: number;
  };
}

export function useGetKokos() {
  return useMutation({
    mutationKey: ["koko"],
    mutationFn: () =>
      baseInstance
        .get<{
          data: IGetKoko;
        }>(`/points-service/koko`, { params: { start: 0, size: 200 } })
        .then((res) => res.data),
  });
}
export function useGetTotalCheckedKokos() {
  return useQuery({
    queryKey: ["get-total-checked-kokos"],
    queryFn: () =>
      baseInstance
        .get<{
          data: { totalChecked: number };
        }>(`/points-service/koko/count/checked`)
        .then((res) => res.data),
  });
}

export function useGetMyTotalCheckedKokos() {
  return useMutation({
    mutationKey: ["get-my-total-checked-kokos"],
    mutationFn: ({ sessionId = "undefined" }: { sessionId: TSessionId }) =>
      baseInstance
        .get<{
          data: { totalChecked: number };
        }>(`/points-service/koko/count/checked`, { params: { sessionId } })
        .then((res) => res.data),
  });
}

export function useGetUncheckedKokosGap() {
  return useQuery({
    queryKey: ["get-unchecked-kokos-gap"],
    queryFn: () =>
      baseInstance
        .get<{
          data: { gaps: [number, number] };
        }>(`/points-service/koko/unchecked/gap`)
        .then((res) => res.data),
  });
}

export function useAddPoints() {
  return useMutation({
    mutationKey: ["add-points"],
    mutationFn: ({
      sessionId = "undefined",
      amount = 0,
    }: {
      sessionId: TSessionId;
      amount: number;
    }) =>
      baseInstance
        .post(`/points-service/points/${sessionId}/add`, { amount })
        .then((res) => res.data),
  });
}

export function useBuySpins({
  onSuccess,
}: {
  onSuccess?: (_data: any) => Promise<unknown> | void;
}) {
  return useMutation({
    mutationKey: ["add-points"],
    mutationFn: ({
      sessionId = "undefined",
      amount = 0,
    }: {
      sessionId: TSessionId;
      amount: number;
    }) =>
      baseInstance
        .post(`/points-service/points/${sessionId}/buy/spins`, { amount })
        .then((res) => res.data),
    onSuccess,
  });
}

export interface IDayType {
  id: string;
  sessionId: string;
  startProtectionTime: string | null;
  protectionDurationInMinutes: number;
  remainingProtectionTime: number;
  currentDay: number;
  protectionUsedToday: boolean;
  created_at: Date;
  updated_at: Date;
}
export interface IProtections {
  current: [IDayType];
  prev: [IDayType];
}

type TRankEntry = {
  id: string;
  sessionId: string;
  game_match_id: string;
  rank: number;
  score: number;
  created_at: string;
  updated_at: string;
};

type TRankResponse = {
  data: TRankEntry[];
};

export function useGetProtections({ sessionId }: { sessionId: TSessionId }) {
  return useQuery({
    queryKey: ["get-protections"],
    queryFn: () =>
      baseInstance
        .get<{ data: IProtections }>(
          `/points-service/koko/protection/days/${sessionId}`
        )
        .then((res) => res.data),
  });
}

export function useGetRankByMatchId({ matchId }: { matchId: string }) {
  return useQuery({
    queryKey: ["get-rank-by-match-id", matchId],
    queryFn: () =>
      baseInstance
        .get<{ data:TRankResponse }>(
          `/game-service/kokos/rank/${matchId}`
        )
        .then((res) => res.data),
  });
}
export function useGetGoldenKokos() {
  return useQuery({
    queryKey: ["get-golden-kokos"],
    queryFn: () =>
      baseInstance
        .get<{ data: {key: string}[] }>(
          `/points-service/koko/daily-golden-kokos`
          // `/koko/daily-golden-kokos`
        )
        .then((res) => new Set(res.data.data.flatMap(one => one.key)) ),
  });
}

export function useClaimProtection() {
  return useMutation({
    mutationKey: ["claim-protections"],
    mutationFn: ({ sessionId }: { sessionId: TSessionId }) =>
      baseInstance
        .post<{
          message: string;
          currentDay: number;
          remainingTime: number;
        }>(`/points-service/koko/${sessionId}/activate`)
        .then((res) => res.data),
  });
}

export function useActivateTimer() {
  return useMutation({
    mutationKey: ["activate-timer"],
    mutationFn: ({ sessionId }: { sessionId: TSessionId }) =>
      baseInstance
        .post<{
          message: string;
          currentDay: number;
          remainingTime: number;
        }>(`/points-service/koko/activateTimer/${sessionId}`)
        .then((res) => res.data),
  });
}
