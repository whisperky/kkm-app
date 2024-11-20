"use client";

import {
  BoxHeader,
  BoxLink,
  BoxMain,
} from "@/src/_components/shared/board-structure";
import React, { useMemo } from "react";
import TopScores from "./top-scores";
import TopSabotages from "./top-sabotages";
import TopInvites from "./top-invites";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent } from "@/src/_components/ui/dialog";
import useScreenHeightRatio from "@/src/_hooks/use-screen-height-ratio";
import useActions from "@/src/_hooks/useAction";

type TTab = "score" | "sabotages" | "inviters";

export default function Leaderboard() {
  const params = useSearchParams();
  const heightRatio = useScreenHeightRatio(762);
  const tabs = useMemo(() => ["score", "sabotages", "inviters"], []);
  const tab = useMemo<TTab>(() => {
    const t = params.get("tab") as TTab;
    return tabs?.includes(t) ? t : "score";
  }, [params, tabs]);
  const { saveAction } = useActions();

  return (
    <Dialog open modal={false}>
      <DialogContent
        title="LEADERBOARD"
        size="2xl"
        containerClassName="h-[540px] flex flex-col"
        tabBarModal={true}
        heightRatio={heightRatio}
      >
        <BoxHeader className="grid-cols-3 gap-0 z-10 pt-6">
          <BoxLink
            href="?tab=score"
            isActive={tab == "score"}
            onClick={() => saveAction("stats_tab1_click")}
          >
            Top
            <br />
            Score
          </BoxLink>
          <BoxLink
            href="?tab=sabotages"
            isActive={tab == "sabotages"}
            onClick={() => saveAction("stats_tab2_click")}
          >
            Top
            <br />
            Sabotagers
          </BoxLink>
          <BoxLink
            href="?tab=inviters"
            isActive={tab == "inviters"}
            onClick={() => saveAction("stats_tab3_click")}
          >
            Top
            <br />
            Inviters
          </BoxLink>
        </BoxHeader>
        <BoxMain
          hideClose={true}
          className="bg-gradient-to-b from-[10%] from-[#F9E7CA] to-[#E8C4A3] rounded-xl rounded-b-3xl"
        >
          {tab == "score" && <TopScores />}
          {tab == "sabotages" && <TopSabotages />}
          {tab == "inviters" && <TopInvites />}
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
