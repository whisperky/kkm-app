/* eslint-disable complexity */
"use client";

import Image from "next/image";
import ShieldIcon from "@/src/_assets/icons/shield.svg";
import { MainGameContext } from "../../main-game-context";
import { SocketContext } from "../../main-game-socket-context";
import { RangeColorMap } from "@/src/_utils/background-pixers";
import { useCallback, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useActivateTimer } from "@/services/koko";
import toast from "react-hot-toast";
import GoldenKokoIcon from "./golden-koko.png";
import useActions from "@/src/_hooks/useAction";

interface ICheckboxButtonProps {
  index: number;
  score: number;
  className?: string;
  cellColorRange?: RangeColorMap;
  playClickAudio?: () => void;
}

export default function CheckboxButton({
  index,
  score,
  cellColorRange,
  playClickAudio,
}: ICheckboxButtonProps) {
  const {
    checkedBoxes,
    myCheckedBoxes,
    protectedBoxes,
    refreshProtection,
    sessionId,
    addMyScore,
    freezing,
    toggleBox,
    protectionStatus,
    checkedGoldenKokos,
    goldenKokos,
    setCheckedGoldenKokos,
    setProtectedBoxes,
  } = useContext(MainGameContext);

  const { sendMessage, socket, decompressAndDeserialize } =
    useContext(SocketContext);
  const [checked, setChecked] = useState(checkedBoxes?.has(index));
  const [myCheck, setMyCheck] = useState(myCheckedBoxes?.has(index));
  const [isGoldenKoko, setIsGoldenKoko] = useState(
    checkedGoldenKokos?.has(index.toString())
  );
  const [isProtected, setIsProtected] = useState(protectedBoxes?.has(index));
  const { mutateAsync: activateProtection } = useActivateTimer();
  const { saveAction } = useActions();

  const checkKoko = useCallback(
    (koko: MainGameKokoType, wasMine: boolean) => {
      if (typeof playClickAudio !== "undefined") {
        playClickAudio();
      }
      sendMessage?.("check-koko", {
        ...koko,
        sessionId,
      });

      const score = Number(koko?.score) || 1;
      const checked = !koko?.checked;
      const myChecked = checked ? true : myCheck;

      addMyScore?.(checked ? score : wasMine ? -1 : 0);
      toggleBox?.(
        koko.key,
        checked,
        myChecked,
        true,
        isProtected || protectionStatus == "active"
      );
    },
    [
      addMyScore,
      isProtected,
      myCheck,
      playClickAudio,
      protectionStatus,
      sendMessage,
      sessionId,
      toggleBox,
    ]
  );

  useEffect(() => {
    setChecked(checkedBoxes?.has(index));
  }, [checkedBoxes, index]);

  useEffect(() => {
    setMyCheck(myCheckedBoxes?.has(index));
  }, [myCheckedBoxes, index]);

  useEffect(() => {
    setIsGoldenKoko(checkedGoldenKokos?.has(index.toString()));
  }, [checkedGoldenKokos, index]);

  useEffect(() => {
    setIsProtected(protectedBoxes?.has(index));
  }, [protectedBoxes, index]);

  useEffect(() => {
    const handleGoldenEvent = (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize?.(compressedData);
      if (data && data.key === index) {
        setIsGoldenKoko(!data.checked);
        setCheckedGoldenKokos?.((prev) => {
          const newSet = new Set(prev);
          if (data.checked) {
            newSet.delete(index.toString());
          } else {
            newSet.add(index.toString());
          }
          return newSet;
        });
      }
    };

    socket?.on("golden-event", handleGoldenEvent);
    return () => {
      socket?.off("golden-event", handleGoldenEvent);
    };
  }, [decompressAndDeserialize, socket, index, setCheckedGoldenKokos]);

  useEffect(() => {
    const handleProtectedEvent = (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize?.(compressedData);
      if (data && data.key === index) {
        setIsProtected(true);
        setProtectedBoxes?.((prev) => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
      }
    };
    socket?.on("protected-koko", handleProtectedEvent);
    return () => {
      socket?.off("protected-koko", handleProtectedEvent);
    };
  }, [decompressAndDeserialize, socket, index, setProtectedBoxes]);

  const handleClick = useCallback(async () => {
    if (freezing) return;
    if (checked && isProtected) return;
    if (goldenKokos?.has(index.toString())) return;
    // if (isProtected && !myCheckedBoxes?.has(index)) return;

    try {
      if (protectionStatus == "waiting") {
        saveAction("dailyBonus_pointProtection_use");
        await activateProtection({ sessionId });
        refreshProtection?.();
        toast.success("Protection activated");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }

    const newCheckedState = !checked;
    setChecked(newCheckedState);
    setMyCheck(newCheckedState);
    checkKoko(
      { key: index, score, checked: !newCheckedState },
      myCheck ?? false
    );
  }, [
    freezing,
    checked,
    isProtected,
    goldenKokos,
    index,
    checkKoko,
    score,
    myCheck,
    protectionStatus,
    saveAction,
    activateProtection,
    sessionId,
    refreshProtection,
  ]);

  return (
    <>
      {checked ? (
        <div
          koko-id={index}
          className="relative select-none size-6 text-[1.3rem] text-center flex justify-center items-center p-2 py-5 w-full"
          style={{ backgroundColor: `${cellColorRange?.getLineColor(index)}` }}
          onClick={handleClick}
        >
          <div
            className={cn(
              "outline flex items-center p-0.5 outline-2 -outline-offset-2 rounded-full",
              myCheck
                ? "outline-[#25a825] bg-[#25a825]/20"
                : "outline-red-700 bg-red-700/20"
            )}
          >
            {isGoldenKoko ? (
              <Image
                alt="Golden Koko"
                src={GoldenKokoIcon}
                height={24}
                width={24}
                priority
              />
            ) : (
              <>
                🥥
                {isProtected && (
                  <div
                    className={cn(
                      "bg-[linear-gradient(180deg,_#00C9FF_0%,_#0095FF_113.89%)] flex items-center justify-center absolute bottom-0 right-0 rounded-full p-0.5 border-[3px]",
                      myCheck ? "border-[#25a825]" : "border-red-700"
                    )}
                  >
                    <Image
                      src={ShieldIcon}
                      alt="koko shield"
                      className="size-3"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          koko-id={index}
          onClick={handleClick}
          className="flex justify-center items-center p-2 w-full"
          style={{ backgroundColor: `${cellColorRange?.getLineColor(index)}` }}
        >
          <div className="cursor-pointer select-none p-2 size-6 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F4F4F0] shadow-[inset_0_0_0_1px_#A07546,inset_0_0.25rem_0.2rem_#ADA389,inset_0_-0.25rem_0.2rem_#fff] outline outline-2 outline-[#634127] outline-offset-0" />
        </div>
      )}
    </>
  );
}
