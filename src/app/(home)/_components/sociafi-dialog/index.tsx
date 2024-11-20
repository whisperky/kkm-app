"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  BoxContent,
  BoxHeader,
  BoxLink,
  BoxMain,
} from "@/src/_components/shared/board-structure";
import TaskCard from "../task-card";
import { useSearchParams } from "next/navigation";
import ShareButtons from "@/src/_components/shared/shareButtons";
import { BonusContent } from "@/services/bonus";
import { baseInstance } from "@/services/axios";
import ShareTweetTask from "../share-tweet";
import toast from "react-hot-toast";
import { Skeleton } from "@/src/_components/ui/skeleton";
import { Dialog, DialogContent } from "@/src/_components/ui/dialog";
import { cn } from "@/lib/utils";
import useScreenHeightRatio from "@/src/_hooks/use-screen-height-ratio";

type TTab = "koko_tasks" | "partner_tasks";

export default function SocialFiDialog() {
  const params = useSearchParams();
  const heightRatio = useScreenHeightRatio(762);
  const tabs = useMemo(() => ["koko_tasks", "partner_tasks"], []);
  const [kokoTasks, setKokoTasks] = React.useState<BonusContent[]>([]);
  const [partnerTasks, setPartnerTasks] = React.useState<BonusContent[]>([]);
  const tab = useMemo<TTab>(() => {
    const t = params.get("tab") as TTab;
    return tabs?.includes(t) ? t : "koko_tasks";
  }, [params, tabs]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTasks = async () => {
    setIsFetching(true);
    const [kokoTasks, partnerTasks] = await Promise.all([
      baseInstance
        .get<{ data: { data: BonusContent[] } }>(
          "/bonus-service/bonus/settings/all-bonuses",
          { params: { status: "active", size: -1 } }
        )
        .then((res) => res.data),
      baseInstance
        .get<{ data: { data: BonusContent[] } }>(
          "/bonus-service/bonus/settings/all-bonuses",
          { params: { status: "dormant", type: "follow,share", size: -1 } }
        )
        .then((res) => res.data),
    ]);
    // data was comming while old kokos at the end so i reversed it
    setKokoTasks(
      kokoTasks.data.data
        .reverse()
        .filter((task) => task.bonusName !== "claim_nft_from_bonus")
    );
    setPartnerTasks(partnerTasks.data.data);
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

  const updateClaimStatus = (taskName: string, bonusIdToClaim: string) => {
    const updatedTasks = (taskName === "kokoTask" ? kokoTasks : partnerTasks)
      .map((item) =>
        item.bonusId === bonusIdToClaim ? { ...item, claimed: true } : item
      )
      .sort((a, b) => {
        return (a.claimed ? 1 : 0) - (b.claimed ? 1 : 0);
      });
    if (taskName === "kokoTask") {
      setKokoTasks(updatedTasks);
    } else {
      setPartnerTasks(updatedTasks);
    }
  };

  return (
    <Dialog open modal={false}>
      <DialogContent
        title="SOCIALFI"
        size="2xl"
        containerClassName="h-[540px] flex flex-col"
        tabBarModal={true}
        heightRatio={heightRatio}
      >
        <BoxHeader className="grid-cols-2 gap-0 z-10 pt-6">
          <BoxLink
            className="py-4"
            href="?tab=koko_tasks"
            isActive={tab == "koko_tasks"}
          >
            Koko Tasks
          </BoxLink>
          <BoxLink
            className="py-4"
            href="?tab=partner_tasks"
            isActive={tab == "partner_tasks"}
          >
            Partner Tasks
          </BoxLink>
        </BoxHeader>
        <BoxMain
          className="p-2 pt-3 border-t-0 bg-gradient-to-b from-[10%] from-[#F9E7CA] to-[#E8C4A3] rounded-xl rounded-b-3xl contain-content"
          hideClose={true}
        >
          <BoxContent
            className={cn(
              "bg-[#DDC2A7] overflow-none py-0 mt-0 min-h-[255px] border-2 border-[#FFF4DE] p-2 rounded-2xl space-y-2 overflow-auto flex-col",
              tab != "koko_tasks" && "flex-1"
            )}
          >
            {tab == "koko_tasks" ? (
              <>
                {kokoTasks?.map((task, index) => {
                  const Component =
                    task?.type == "share" ? ShareTweetTask : TaskCard;
                  return (
                    <Component
                      key={index}
                      listLabel={"index"}
                      index={index}
                      task={task}
                      cardData={kokoTasks}
                      updateCardData={updateClaimStatus}
                    />
                  );
                })}
              </>
            ) : (
              partnerTasks?.map((task, index) => (
                <TaskCard
                  key={index}
                  listLabel={tab == "partner_tasks" ? "bonus" : "index"}
                  index={index}
                  task={task}
                  cardData={partnerTasks}
                  updateCardData={updateClaimStatus}
                />
              ))
            )}
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
          {tab == "koko_tasks" && (
            <div className="grid pt-3">
              <h2 className="text-white bg-green p-2 rounded-t-xl font-bold text-center text-base border-0 border-b border-solid border-black/20">
                Invite more friends for more rewards!
              </h2>
              <div className="bg-[#E3BEAA] p-3 rounded-b-xl border-0 border-t border-solid border-white/60">
                <div className="flex justify-center gap-2 text-center flex-col items-center font-semibold text-[#745061] pb-3 border-0 border-b border-solid border-black/20">
                  <div className="leading-4 text-base">
                    3 Spins and +10,000 Bonus 🥥
                  </div>
                  <p className="text-xs">
                    for every additional friend referral.
                  </p>
                </div>
                <div className="flex [&>*]:!flex-1 [&>*]:!py-0.5 flex-wrap pt-3 gap-3 border-0 border-t border-solid border-white/60">
                  <ShareButtons />
                </div>
              </div>
            </div>
          )}
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
