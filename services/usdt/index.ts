/** @format */

import { useMutation, useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export interface IUsdt {
  id: string;
  sessionId: TSessionId;
  total: number;
  created_at: Date;
  updated_at: Date;
}

export function useAddUsdt({
  sessionId,
  onSuccess,
}: {
  sessionId: TSessionId;
  onSuccess?: () => Promise<unknown>;
}) {
  return useMutation({
    mutationKey: ["usdt-add", sessionId],
    mutationFn: (amount: number = 0) =>
      baseInstance
        .post(`/bonus-service/usdt/user/${sessionId}/add`, {
          amount,
          source: "bonus",
        })
        .then((res) => res.data),
    onSuccess,
  });
}

export function useUsdt({ sessionId }: { sessionId: TSessionId }) {
  return useQuery({
    queryKey: ["usdt", sessionId],
    queryFn: () =>
      baseInstance
        .get<{ data: IUsdt }>(`/bonus-service/usdt/user/${sessionId}`)
        .then((res) => res.data),
  });
}
