"use client";

import { Suspense, useContext } from "react";
import Banner from "../_components/banner";
import { MainGameContext } from "../main-game-context";
import KokosContainer from "../_components/kokos/container";
import BannerLayout from "../_components/banners/layout"
import ResetBonusNotifications from "../_components/notifications/reset-bonus";
import StreakNotifications from "../_components/notifications/streaks";
import IntroDialog from "../_components/intro-dialog";

export default function Home() {
  const { myScore, totalCheckedKokos, myTotalCheckedKokos } = useContext(MainGameContext);
  return (
    <>
      <main className="h-dvh flex flex-col bg-center">
        <BannerLayout />
        <div className="absolute mt-[44px] container-blured rounded-b-md z-30 h-max inset-0">
          <Banner
            totalChecked={totalCheckedKokos ?? 0}
            userScore={myScore || 0}
            myChecks={myTotalCheckedKokos || 0}
          />
        </div>
        <KokosContainer />
      </main>
      <Suspense>
        <StreakNotifications />
        <ResetBonusNotifications />
        <IntroDialog />
      </Suspense>
    </>
  );
}
