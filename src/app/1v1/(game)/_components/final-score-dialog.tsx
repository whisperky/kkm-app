"use client";

import { Button } from "@/src/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/src/_components/ui/dialog";
import React, { useCallback, useEffect, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import DialogContainer from "@/src/_components/shared/dialog-container";
import { StarsIcons } from "@/src/_components/icons";
import { cn } from "@/lib/utils";
import { MatchContext } from "../_context/match";
import { SocketContext } from "../_context/socket";
import { GeneralContext } from "@/src/app/general-context";
import useActions from "@/src/_hooks/useAction";

export default function FinalScoreDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { saveAction } = useActions();

  const { sessionId } = useContext(GeneralContext);
  const { finalScoreData: data, setFinalScoreData } = useContext(SocketContext);
  const { resetMatch } = useContext(MatchContext);
  const winner = useMemo(
    () => data?.winnerId == sessionId,
    [data?.winnerId, sessionId]
  );

  const close = useCallback(() => {
    setOpen(false);
    router.push("/1v1");
  }, [router]);

  useEffect(() => {
    if (data) {
      setTimeout(() => setOpen(true), 1000);
    }
  }, [data]);

  const handlePlayAgain = useCallback(() => {
    saveAction("miniMatch_playAgain_click");
    setTimeout(async () => {
      await Promise.all([
        resetMatch?.(),
        setFinalScoreData?.(null),
        setOpen(false),
      ]);
      router.replace("/1v1/waiting");
    }, 500);
  }, [resetMatch, router, saveAction, setFinalScoreData]);

  if (!data) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="!overflow-visible z-50" asChild>
        <div>
          {winner && (
            <div className="flex justify-center items-center h-0 w-full">
              <StarsIcons className="absolute -translate-y-8 w-10/12 h-auto z-[1]" />
              <div className="absolute translate-y-32 size-[150dvw] bg-radient-ellipse-c from-[#ffe598] from-16% to-[#FFC100]/0 to-70%" />
            </div>
          )}
          <DialogContainer
            title="Final Score"
            size="lg"
            className="text-center text-[#5F3F57] text-lg font-[700] px-2 flex flex-col gap-2 h-full"
          >
            <DialogHeader className="block text-center text-2xl font-[400] text-[#745061] font-bumper-sticker tracking-wide">
              {data?.winnerId == "Draw"
                ? "It's a Draw!"
                : winner
                ? "You Win!"
                : "You Lose!"}
            </DialogHeader>
            <div className="rounded-2xl p-3 bg-[#E6CDB1] grid gap-2">
              <div
                className={cn(
                  `items-center rounded-xl contain-content border-2 border-solid`,
                  data?.winnerId == data?.playerOne?.sessionId
                    ? "bg-[#FFC721] border-[#FFD245]"
                    : "bg-[#C69EEF] border-[#F0E2FF]"
                )}
              >
                <p className="bg-black/15 text-white p-2 py-1 flex items-center justify-between">
                  <span className="text-start">{data?.playerOne?.name}</span>
                  <span className="text-nowrap">{data?.playerOne?.score} 🥥</span>
                </p>
                <div className="p-2 text-sm">
                  <p className="font-bold text-xs text-start">Reward</p>
                  {data?.winnerId == data?.playerOne?.sessionId && (
                    <p className="flex justify-between">
                      <span className="text-start">Victory Bonus</span>{" "}
                      <span className="text-end">+3,500 Points</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span className="text-start">Participation Bonus</span>{" "}
                    <span className="text-end">+1,500 Points</span>
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  `items-center rounded-xl contain-content border-2 border-solid`,
                  data?.winnerId == data?.playerTwo?.sessionId
                    ? "bg-[#FFC721] border-[#FFD245]"
                    : "bg-[#C69EEF] border-[#F0E2FF]"
                )}
              >
                <p className="bg-black/15 text-white p-2 py-1 flex items-center justify-between">
                  <span className="text-start">{data?.playerTwo?.name}</span>
                  <span className="text-nowrap">{data?.playerTwo?.score} 🥥</span>
                </p>
                <div className="p-2 text-sm">
                  {data?.winnerId == data?.playerTwo?.sessionId && (
                    <p className="flex justify-between">
                      <span className="text-start">Victory Bonus</span>{" "}
                      <span className="text-end">+3,500 Points</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span className="text-start">Participation Bonus</span>{" "}
                    <span className="text-end">+1,500 Points</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Button
                className="bg-green hover:bg-green/80 text-white text-xl font-bold btn-animate !shadow-[0_0.15rem] !shadow-[#2C7C4C]"
                onClick={handlePlayAgain}
              >
                Play Again!
              </Button>
              <Button
                className="bg-green hover:bg-green/80 text-white text-base font-bold btn-animate !shadow-[0_0.15rem] !shadow-[#2C7C4C]"
                onClick={() => close()}
              >
                Back to menu
              </Button>
            </div>
          </DialogContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
