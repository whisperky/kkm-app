"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ShieldIcon from "../../../../_assets/icons/shield.svg";
import Image from "next/image";
import { MainGameContext } from "../../main-game-context";
import moment from "moment";

export default function AnnouncementTimer() {
  const { startProtectionTime, protectionDuration, destroyProtect } =
    useContext(MainGameContext);
  const [seconds, setSeconds] = useState(45);
  const totalDuration = useMemo(
    () => (protectionDuration || 0) * 60,
    [protectionDuration]
  );
  const widthPercentage = useMemo(
    () => (totalDuration > 0 ? (seconds / totalDuration) * 100 : 0),
    [seconds, totalDuration]
  );

  const getTimeToEnd = useCallback(() => {
    return moment(startProtectionTime).add(protectionDuration, "minutes");
  }, [protectionDuration, startProtectionTime]);

  const getIntervalToEnd = useCallback(() => {
    return getTimeToEnd().diff(moment(), 'seconds');
  }, [getTimeToEnd]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval);
          destroyProtect?.()
          return 0;
        }
        const time = getIntervalToEnd();
        return time >= 0 ? time : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [destroyProtect, getIntervalToEnd]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}s`;
  };

  return (
    <div className="bg-[#415A92] px-4 space-x-2 relative h-12 py-2 flex justify-center items-center text-white">
      <div>
        <Image
          src={ShieldIcon}
          alt="Shield Icon"
          width={20}
          height={40}
          className="size-8"
        />
      </div>
      <div className="h-6 w-full z-20 p-0.5 rounded-full bg-[#302C54] shadow-[inset_0_3px_1px_#0003] overflow-hidden">
        <div
          className="h-full flex items-center rounded-l-full bg-[#2EAFD2] shadow-[3px_0_1px_#0003]"
          style={{
            width: `${widthPercentage}%`,
          }}
        >
          <div className="text-xs font-made-tommy absolute z-10 px-2 font-bold leading-3">
            {`Active! ${formatTime(seconds)}`}
          </div>
        </div>
      </div>
    </div>
  );
}
