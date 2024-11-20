"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";
import {
  ImageStarRiseIcon,
  LockClosedIcon,
  LockOpenedIcon,
} from "@/src/_components/icons";
import TaskCard from "../task-card";
import { Button } from "@/src/_components/ui/button";
import ClaimNFTDialog from "./claim-nft-dialog";
import { baseInstance } from "@/services/axios";
import { BonusContent } from "@/services/bonus";
import toast from "react-hot-toast";
import { Skeleton } from "@/src/_components/ui/skeleton";
import { GeneralContext } from "@/src/app/general-context";
import { DialogTitle } from "@/src/_components/ui/dialog";
import useActions from "@/src/_hooks/useAction";

export default function FreeOGNFTDialog() {
  const [isFetching, setIsFetching] = useState(false);
  const { completionStatus } = useContext(GeneralContext);
  const [tasks, setTasks] = useState<BonusContent[]>([]);
  const { saveAction } = useActions();

  const count = useMemo(
    () =>
      completionStatus?.bonuses?.filter((one) => one?.status === "active")
        ?.length || 0,
    [completionStatus?.bonuses]
  );

  const fetchTasks = async () => {
    setIsFetching(true);
    const kokoTasks = await baseInstance
      .get<{ data: { data: BonusContent[] } }>(
        "/bonus-service/bonus/settings/all-bonuses",
        { params: { status: "active", size: -1 } }
      )
      .then((res) => res.data);
    setTasks(
      kokoTasks.data.data
        .reverse()
        .filter(
          (task) =>
            task.bonusName !== "claim_nft_from_bonus" &&
            [
              "follow_twitter",
              "telegram_community",
              "invite_3_friends",
            ]?.includes(task?.bonusName)
        )
    );
    setIsFetching(false);
  };

  useEffect(() => {
    if (!isFetching) {
      fetchTasks().catch((err) => {
        toast.error("Something went wrong");
        console.log(err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BoxMain
      hideClose={true}
      className="p-2 pt-4 h-full from-[#ffe3c2] to-[#ffe3c2] rounded-t-[1.2rem]"
    >
      <DialogTitle className="text-center text-golden-brown p-4 px-2 pb-2 flex gap-2 items-center">
        <ImageStarRiseIcon className="size-10 flex-shrink-0" />
        <p className="text-start text-sm">
          Claim a free OG NFT to unlock bonus points and other rewards.
        </p>
      </DialogTitle>
      <BoxContent className="bg-[#DDC2A7] pt-0 mt-0 border-2 border-[#FFF4DE] max-h-fit min-h-[255px] h-full p-3 rounded-3xl overflow-auto space-y-2 flex-col">
        {tasks.map((task, index) => (
          <TaskCard key={task.bonusId} index={index} task={task} claimOGTab />
        ))}
        {isFetching &&
          [1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start p-2 border border-[#89454d] rounded-2xl space-x-4"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="w-2/3 h-4 bg-[#b55e44] rounded-lg" />
                <Skeleton className="w-full h-6 bg-[#b55e44] rounded-full" />
              </div>
            </div>
          ))}
      </BoxContent>
      <div className="flex justify-center py-4">
        <ClaimNFTDialog>
          {({ setOpenModal, claimable }) => (
            <Button
              onClick={() => {
                if (claimable) return;
                setOpenModal(true);
                localStorage.setItem("nft-flow", "true");
                saveAction("freeOGNFT_claim_click");
              }}
              disabled={!claimable || count < 3}
              className={`gap-2 px-8 py-4 w-2/3 rounded-md hover:bg-green/80 text-white text-xl font-bold btn-animate !shadow-[0_0.15rem] ${
                claimable
                  ? "bg-green !shadow-[#2C7C4C]"
                  : "bg-[#D29779] !shadow-[#CDA189]"
              }`}
            >
              {claimable ? <LockOpenedIcon /> : <LockClosedIcon />}
              Claim
            </Button>
          )}
        </ClaimNFTDialog>
      </div>
    </BoxMain>
  );
}
