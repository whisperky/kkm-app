"use client";

import React, { useContext } from "react";
import { BannerBox, OpponentStatusBar } from "./banner";
import { MatchContext } from "../_context/match";
import { GeneralContext } from "@/src/app/general-context";

export default function Banner() {
  const { sessionId } = useContext(GeneralContext);
  const { myCheckedBoxes, checkedBoxes, players } = useContext(MatchContext);

  return (
    <BannerBox remains={101 - (checkedBoxes?.size || 0)}>
      {[players?.[0], players?.[1]]?.map?.((player, index) => (
        <OpponentStatusBar
          key={`${player?.sessionId}-${index}`}
          current={index == 0}
          isMe={player?.sessionId == sessionId}
          username={`${player?.username || ""}`}
          kokos={
            player?.sessionId == sessionId
              ? myCheckedBoxes?.size || 0
              : (checkedBoxes?.size || 0) - (myCheckedBoxes?.size || 0)
          }
        />
      ))}
    </BannerBox>
  );
}
