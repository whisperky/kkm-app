import { useInfiniteQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export interface ILeaderboard {
  current: {
    rank: number;
    value: number;
  };
  data: {
    value: number;
    rank: number;
    user: {
      id: string;
      username: string;
    };
  }[];
  pagination: {
    total: number;
    size: number;
    start: number;
    end: number;
  };
}

function getNextPageParam(
  lastPage: ILeaderboard,
  allPages: ILeaderboard[] = []
) {
  const loadedCount = allPages?.flatMap?.((page) => page?.data)?.length;

  if (loadedCount >= 100 || loadedCount >= lastPage?.pagination?.total)
    return undefined;
  return (allPages?.length || 0) + 1;
}

export function useTopScores(sessionId: TSessionId) {
  return useInfiniteQuery<ILeaderboard, Error>({
    queryKey: ["top-score", sessionId],
    queryFn: ({ pageParam = 1 }) =>
      baseInstance
        .get<ILeaderboard>(`/report-service/reports/top-scorers/${sessionId}`, {
          params: {
            page: pageParam,
            start: ((Number(pageParam) || 1) - 1) * 20,
            size: 20,
          },
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useTopSabotage(sessionId: TSessionId) {
  return useInfiniteQuery<ILeaderboard, Error>({
    queryKey: ["top-sabotage", sessionId],
    queryFn: ({ pageParam = 1 }) =>
      baseInstance
        .get<ILeaderboard>(
          `/report-service/reports/top-sabotages/${sessionId}`,
          {
            params: {
              page: pageParam,
              start: ((Number(pageParam) || 1) - 1) * 20,
              size: 20,
            },
          }
        )
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam,
  });
}

export function useTopInvites(sessionId: TSessionId) {
  return useInfiniteQuery<ILeaderboard, Error>({
    queryKey: ["top-invites", sessionId],
    queryFn: ({ pageParam = 1 }) =>
      baseInstance
        .get<ILeaderboard>(
          `/report-service/reports/top-inviters/${sessionId}`,
          {
            params: {
              page: pageParam,
              start: ((Number(pageParam) || 1) - 1) * 20,
              size: 20,
            },
          }
        )
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam,
  });
}
