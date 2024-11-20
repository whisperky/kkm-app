"use client";

import toast from "react-hot-toast";
import { baseInstance } from "@/services/axios";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/src/_components/ui/button";
import { useCheckUserBonus2 } from "@/services/bonus";
import { MainGameContext } from "../../main-game-context";
import { SocketContext } from "../../main-game-socket-context";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/src/_components/ui/dialog";
import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";

export default function ResetBonusNotifications() {
  const { sessionId, user } = useContext(MainGameContext);
  const { socket } = useContext(SocketContext);
  const [open, setOpen] = useState(false);

  const { data: userbonus } = useCheckUserBonus2({
    userId: sessionId,
    bonusName: "reset",
  });

  const { mutateAsync: addPoints, isPending } = useMutation({
    onSuccess: () => {
      toast.success("Bonus added successfully");
      setOpen(false);
    },
    onError: (error: any) => {
      console.log(error);
      toast.error("You have already claimed this bonus");
      setOpen(false);
    },
    mutationFn: () =>
      baseInstance
        .post("/bonus-service/bonus/add-bonus-points", {
          sessionId,
          bonusName: "reset",
        })
        .then((res) => res.data),
  });

  useEffect(() => {
    socket?.on("reset-game", () => {
      setOpen(true);
    });

    return () => {
      socket?.off("reset-game");
    };
  }, [socket]);

  useEffect(() => {
    if (
      userbonus?.data?.status !== "claimed" &&
      userbonus?.data?.bonus?.created_at &&
      user?.created_at &&
      new Date(userbonus?.data?.bonus?.created_at) > new Date(user?.created_at)
    ) {
      setOpen(true);
    }
  }, [userbonus, user]);

  const close = useCallback(() => {
    addPoints();
  }, [addPoints]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title="Congrats!"
        containerClassName="text-[#5F3F57] text-lg font-[700] h-full flex flex-col"
      >
        <BoxMain className="p-2 pt-4 h-full from-[#ffe3c2] to-[#ffe3c2] rounded-t-[1.2rem]">
          <BoxContent className="pt-0 mt-0 max-h-fit h-full p-3 rounded-3xl overflow-auto space-y-3 flex-col">
            <p className="text-[#7A5B69] text-center">
              You were part of the first One Million and One Kokos! Here is your
              reward.
            </p>
            <div className="text-center">
              <h1 className="font-[800] text-6xl">+{(10000)?.toLocaleString()}</h1>
              <p className="font-bold text-2xl">Bonus Points</p>
            </div>
            <p className="text-[#7A5B69] text-center">
              Remember! Kokos will convert🔥 The board is now reset. Get more Kokos
              before Season 1!
            </p>
            <Button
              disabled={isPending}
              className="bg-green hover:bg-emerald-500 text-white text-2xl font-bold btn-animate !shadow-[0_0.15rem] !shadow-[#2C7C4C]"
              onClick={close}
            >
              Claim
            </Button>
          </BoxContent>
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
