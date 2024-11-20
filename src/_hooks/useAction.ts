import { baseInstance } from "@/services/axios";
import { useCallback, useContext } from "react";
import { GeneralContext } from "../app/general-context";

export default function useActions() {
  const { sessionId } = useContext(GeneralContext);

  const saveAction = useCallback(
    async (name: string, details: { [key: string]: any } = {}) => {
      baseInstance
        .post(`/activity-service/activities`, {
          sessionId,
          activityType: name,
          pointsEarned: 0,
          details,
          metadata: {},
        })
        .then((response) => {
          console.log(`Action ${name} tracked for session ${sessionId}`);
          return response.data;
        })
        .catch((error) => {
          console.error("Failed to track action:", error);
        });

      return true;
    },
    [sessionId]
  );

  return { saveAction };
}
