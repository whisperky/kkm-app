import { useMutation } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export function useCheckBetaTester() {
  return useMutation({
    mutationKey: ["check-beta-tester"],
    mutationFn: (username?: string) =>
      baseInstance
        .get<{
          exists: boolean;
        }>(`/user-service/beta-testers/exists/${username || "undefined"}`)
        .then((res) => res.data),
  });
}

