/** @format */

import { useMutation, useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export interface ISpin {
  id: string;
  sessionId: TSessionId;
  total: number;
  created_at: Date;
  updated_at: Date;
}

export interface ISpinnerLog {
  id: string;
  sessionId: TSessionId;
  parentId: string;
  amount: number;
  source: string;
  created_at: Date;
  updated_at: Date;
}

type SpinnerProps = {
  spins?: number;
  source?: string;
};
export function useSpinner({
  sessionId,
  onSuccess,
}: {
  sessionId: TSessionId;
  onSuccess?: () => Promise<unknown> | void;
}) {
  return useMutation({
    mutationKey: ["spinner", sessionId],
    mutationFn: async (props: SpinnerProps = {}) => {
      const { spins = -1, source = "spin" } = props || {};
      const res = await baseInstance.post(
        `/bonus-service/spins/user/${sessionId}/add`,
        {
          spins,
          source,
        }
      );
      return res.data;
    },
    onSuccess,
  });
}

export function useClaimDaily({
  sessionId,
  onSuccess,
}: {
  sessionId: TSessionId;
  onSuccess?: (
    _data: any,
    _variables: void,
    _context: unknown
  ) => Promise<unknown>;
}) {
  return useMutation({
    mutationKey: ["daily-claim", sessionId],
    mutationFn: () =>
      baseInstance
        .post<{ data: ISpin }>(
          `/bonus-service/spins/user/${sessionId}/daily-claim`
        )
        .then((res) => res.data),
    onSuccess,
  });
}

export function useSpins({ sessionId }: { sessionId: TSessionId }) {
  return useQuery({
    queryKey: ["spins", sessionId],
    queryFn: () =>
      baseInstance
        .get<{ data: ISpin }>(`/bonus-service/spins/user/${sessionId}`)
        .then((res) => res.data),
  });
}

export function useDailySpins({ sessionId }: { sessionId: TSessionId }) {
  return useQuery({
    queryKey: ["daily-spins", sessionId],
    queryFn: () =>
      baseInstance
        .get<{ data: ISpinnerLog[] }>(
          `/bonus-service/spins/user/${sessionId}/daily/today`
        )
        .then((res) => res.data),
  });
}

export type TRandom = {
  kokos: number;
  type: string;
  value: number;
};

type TRandomOut = {
  data: {
    selected: TRandom;
    all: TRandom[];
  };
};

export function useRandomSpin({
  onSuccess,
}: {
  onSuccess?: () => Promise<unknown> | void;
}) {
  return useMutation({
    mutationKey: ["spinner-prob"],
    mutationFn: async ({ sessionId }: { sessionId: TSessionId }) => {
      const res = await baseInstance.get<TRandomOut>(
        `/bonus-service/spins/random-spin`,
        { params: { sessionId } }
      );
      return res.data;
    },
    onSuccess,
  });
}
