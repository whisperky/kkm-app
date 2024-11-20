"use client";

import { Button } from "@/src/_components/ui/button";
import { SocketContext } from "../../main-game-socket-context";
import React, { useCallback, useContext, useEffect } from "react";
import { Dialog, DialogContent } from "@/src/_components/ui/dialog";
import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";

interface IData {
  source?: string;
  points?: number;
  checks?: number;
  next?: IData;
}

export default function StreakNotifications() {
  const { socket, decompressAndDeserialize } = useContext(SocketContext);
  const [data, setData] = React.useState<IData[]>([]);
  // {
  //   source: "source",
  //   points: 100,
  //   checks: 80,
  //   next: {
  //     source: "source",
  //     points: 100,
  //     checks: 80,
  //   }
  // }

  const close = useCallback((source: string) => {
    setData((p) => [...p.filter((d) => d.source != source)]);
  }, []);

  useEffect(() => {
    socket?.on("add-point", (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize?.(compressedData);
      const { source } = data;
      if (!["streak", "streak_sabotage"]?.includes(source)) return;

      setData((p) => [...p, data?.data]);
    });
  }, [decompressAndDeserialize, socket]);
  return data?.map((one) => (
    <Dialog open onOpenChange={() => close(`${one?.source}`)} key={one?.source}>
      <DialogContent
        title="Streak!"
        containerClassName="text-[#5F3F57] text-lg font-[700] h-full flex flex-col"
      >
        <BoxMain className="p-2 pt-4 h-full from-[#ffe3c2] to-[#ffe3c2] rounded-t-[1.2rem]">
          <BoxContent className="pt-0 mt-0 max-h-fit h-full p-3 rounded-3xl overflow-auto space-y-3 flex-col">
            <p className="text-[#7A5B69] text-center">
              You&apos;re on a{" "}
              {one?.source == "streak_sabotage" ? "🥷 Sabotage" : "🔥 Koko"} Streak!
            </p>
            <div>
              <h1 className="font-[800] text-6xl text-center">+{one?.points}</h1>
              <p className="font-bold text-2xl text-center">Bonus Points</p>
            </div>
            {one?.next?.points && (
              <div className="contain-content overflow-hidden text-center">
                <h2 className="bg-[#7A5B6980] text-white rounded-t-md">
                  {one?.source == "streak_sabotage" ? "🥷" : "🔥"} Next Reward:
                </h2>
                <p className="bg-[#E9C9A5] p-3 rounded-b-md">
                  +{one?.next?.points} points after <br />
                  checking {one?.next?.checks} 🥥
                </p>
              </div>
            )}
            <Button
              className="bg-green hover:bg-emerald-500 text-white text-2xl font-bold btn-animate !shadow-[0_0.15rem] !shadow-[#2C7C4C]"
              onClick={() => close(`${one?.source}`)}
            >
              Cool!
            </Button>
          </BoxContent>
        </BoxMain>
      </DialogContent>
    </Dialog>
  ));
}
