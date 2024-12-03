"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MatchContext } from "../_context/match";
import { SocketContext } from "../_context/socket";
import { GeneralContext } from "@/src/app/general-context";
import React from "react";
import { BoxContext } from "../_context/boxContext";

interface ICheckboxButtonProps {
  index: number;
  className?: string;
}

export default function CheckboxButton({
  index,
  className,
}: ICheckboxButtonProps) {
  const { playClickAudio } = useContext(BoxContext)
  const { sessionId, username } = useContext(GeneralContext);
  const { sendMessage } = useContext(SocketContext);
  const { checkedBoxes, myCheckedBoxes, toggleBox, match, matchId } =
    useContext(MatchContext);

  const [checked, setChecked] = useState(checkedBoxes?.has(index));
  const [myCheck, setMyCheck] = useState(myCheckedBoxes?.has(index));

  const checkKoko = useCallback(
    (koko: PvPGameKokoType, _wasMine: boolean) => {
      if (typeof playClickAudio !== "undefined") playClickAudio();

      const message = {
        roomId: matchId,
        username,
        sessionId: `${sessionId}`,
        photoUrl: ``,
        boxId: Number(koko?.key),
        isChecked: !koko?.checked,
        timestamp: new Date().toISOString(),
      };
      console.log("Sending checkbox state message:", message);
      sendMessage?.("checkbox-update", message);
      // const score = Number(koko?.score) || 1;
      const checked = !koko?.checked;
      const myChecked = checked ? true : myCheck;

      // addMyScore?.(checked ? score : wasMine ? -1 : 0);
      toggleBox?.(koko.key, {
        checked,
        mine: myChecked,
        changeTotal: true,
        matchId: koko?.matchId,
      });
    },
    [matchId, myCheck, playClickAudio, sendMessage, sessionId, toggleBox, username]
  );

  useEffect(() => {
    setChecked(checkedBoxes?.has(index));
  }, [checkedBoxes, index]);

  useEffect(() => {
    setMyCheck(myCheckedBoxes?.has(index));
  }, [myCheckedBoxes, index]);

  const handleClick = useCallback(() => {
    if (typeof playClickAudio !== "undefined") playClickAudio();

    const newCheckedState = !checked;
    setChecked(newCheckedState);
    setMyCheck(newCheckedState);
    checkKoko(
      { key: index, score: 1, checked: !newCheckedState, matchId: match?.id },
      myCheck ?? false
    );
  }, [match?.id, checked, checkKoko, index, myCheck, playClickAudio]);

  return (
    <>
      {checked ? (
        <div
          koko-id={index}
          className={cn(
            "relative select-none size-6 text-[1.3rem] text-center flex justify-center items-center p-2 py-[6px] w-full h-9",
            className
          )}
          onClick={handleClick}
        >
          <div
            className={`outline flex text-md items-center p-0.5 outline-2 ${
              myCheck
                ? "outline-[#25a825] bg-[#25a825]/20"
                : "outline-red-700 bg-red-700/20"
            } -outline-offset-2 rounded-full`}
          >
            🥥
          </div>
        </div>
      ) : (
        <div
          koko-id={index}
          onClick={handleClick}
          className="flex justify-center items-center p-[6px] w-full"
        >
          <div
            className="
              cursor-pointer select-none p-2 size-6 rounded-full
              bg-gradient-to-b from-[#FFFFFF] to-[#F4F4F0]
              shadow-[inset_0_0_0_1px_#A07546,inset_0_0.25rem_0.2rem_#ADA389,inset_0_-0.25rem_0.2rem_#fff]
              outline outline-2 outline-[#634127] outline-offset-0"
          />
        </div>
      )}
    </>
  );
}

export function LoaderCheckboxButton({ index }: ICheckboxButtonProps) {
  return (
    <>
      <div
        koko-id={index}
        className="flex justify-center items-center p-2 w-full"
      >
        <div
          className="
              cursor-pointer select-none p-2 size-6 rounded-full
              bg-gradient-to-b from-[#FFFFFF] to-[#F4F4F0]
              shadow-[inset_0_0_0_1px_#A07546,inset_0_0.25rem_0.2rem_#ADA389,inset_0_-0.25rem_0.2rem_#fff]
              outline outline-2 outline-[#634127] outline-offset-0"
        />
      </div>
    </>
  );
}
