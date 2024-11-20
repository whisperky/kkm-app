"use client";

import "animate.css";
import React, { useContext, useEffect, useState } from "react";
import GoldenKokonut from "./golden-kokonut";
import { SocketContext } from "../../main-game-socket-context";
import Sabotaged from "./sabotaged";
import { MainGameContext } from "../../main-game-context";
import AnnouncementTimer from "./announcement-timer";
import Announcement from "./announcement";
import moment from "moment";
import DefaultBanners from "./defaults";

type TBannerEvent = "" | "hit-100000" | "sabotage" | "golden-kokonut";

export default function BannerLayout() {
  const { startProtectionTime, protectionStatus } = useContext(MainGameContext);
  const { socket, decompressAndDeserialize } = useContext(SocketContext);
  const [event, setEvent] = useState<TBannerEvent>("");
  const [bannerData, setBannerData] = useState<Record<string, any>>({});
  // events: hit-100000, sabotage, golden-kokonut
  // others: start-protection, activated-protection
  // fallback: did-you-know, explainer

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    socket?.on("golden-event", (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize?.(compressedData);
      setEvent("golden-kokonut");
      setBannerData(data);
    });

    socket?.on("sabotage-event", (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize?.(compressedData);
      console.log("sabotage event", data);
      setEvent("sabotage");

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setEvent("");
      }, 5000);

      return () => {
        socket?.off("golden-event");
        socket?.off("sabotage-event");
        if (timer) clearTimeout(timer);
      };
    });
  }, [decompressAndDeserialize, socket]);

  return (
    <div className="contain-content">
      {startProtectionTime &&
      moment(startProtectionTime).isBefore(moment().add(1, "minute")) ? (
        <AnnouncementTimer />
      ) : protectionStatus == "waiting" ? (
        <Announcement />
      ) : event == "golden-kokonut" ? (
        <GoldenKokonut username={bannerData?.doneBy} />
      ) : event == "sabotage" ? (
        <Sabotaged />
      ) : (
        <DefaultBanners />
      )}
    </div>
  );
}
