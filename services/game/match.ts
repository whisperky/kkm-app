import { useMutation } from "@tanstack/react-query";
import { baseInstance } from "../axios";
import { IMatch } from "@/types/match";

export function useMatch() {
  return useMutation({
    mutationKey: ["get-match"],
    mutationFn: (id: string) =>
      baseInstance
        .get<{ data: IMatch }>(`/game-service/matches/${id}`)
        .then((res) => res.data),
  });
}

export function useSendMessage() {
  return useMutation({
    mutationKey: ["send-message"],
    mutationFn: ({
      sessionId,
      message,
      buttonText,
      buttonUrl,
    }: {
      sessionId: TSessionId;
      message: string;
      buttonText?: string;
      buttonUrl?: string;
    }) =>
      baseInstance
        .post(`/report-service/bot/test-send-message`, {
          userId: sessionId,
          buttonText,
          buttonUrl,
          message,
        })
        .then((res) => res.data),
  });
}
