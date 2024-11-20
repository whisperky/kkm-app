import { useMutation, useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export interface IGetUser {
  user: IUser;
  totalPoints?: ITotalPoints;
}

export function useGetUser(sessionId: TSessionId) {
  return useQuery({
    queryKey: ["user", sessionId],
    queryFn: () =>
      baseInstance
        .get<{ data: IGetUser }>(
          `/user-service/users/${sessionId || "undefined"}`,
          {
            params: { getPoints: true },
          }
        )
        .then((res) => res.data),
  });
}

export interface IInitialPoints {
  sessionId: TSessionId;
  total: string;
}

export function useInitialPoints(sessionId: TSessionId) {
  return useQuery({
    queryKey: ["user-points", sessionId],
    queryFn: () =>
      baseInstance
        .get<IInitialPoints>(
          `/points-service/points/${sessionId || "undefined"}/total`
        )
        .then((res) => res.data),
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationKey: ["user-update"],
    mutationFn: ({
      sessionId,
      body,
    }: {
      sessionId: TSessionId;
      body: Partial<IUser>;
    }) =>
      baseInstance
        .patch(`/user-service/users/${sessionId}`, body)
        .then((res) => res.data),
  });
}
