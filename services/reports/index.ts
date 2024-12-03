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

function getNextPageParam(lastPage: ILeaderboard, allPages: ILeaderboard[]) {
  const loadedCount = allPages.flatMap((page) => page.data).length;
  if (loadedCount >= lastPage.pagination.total) return undefined;
  return allPages.length + 1;
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
    select: (data) => {
      // Adjust the current rank and merge/sort data
      const allData = data.pages.flatMap((page) => page.data);
      const sortedData = allData.sort((a, b) => a.rank - b.rank); // Sort by rank

      // Adjust current rank by adding +1
      const updatedCurrent = {
        ...data.pages[0].current,
        rank: data.pages[0].current.rank + 1,
      };

      // Return modified data structure with updated `current` and `pages`
      return {
        ...data,
        pages: [{ ...data.pages[0], current: updatedCurrent, data: sortedData }],
      };
    },
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
              start: ((Number(pageParam) || 1)) * 20,
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
