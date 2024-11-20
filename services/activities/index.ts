import { useMutation } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export function useTelegramShare() {
  return useMutation({
    mutationKey: ["telegram share Activity"],
    mutationFn: ({ sessionId }: { sessionId: TSessionId }) =>
      baseInstance
        .post(`/activity-service/activities/telegram-share`, {
          sessionId,
        })
        .then((res) => res.data),
  });
}

export function useCopyInvite() {
  return useMutation({
    mutationKey: ["copy invite Activity"],
    mutationFn: ({ sessionId }: { sessionId: TSessionId }) =>
      baseInstance
        .post(`/activity-service/activities/copy-invite`, {
          sessionId,
        })
        .then((res) => res.data),
  });
}
