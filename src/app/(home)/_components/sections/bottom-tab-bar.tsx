import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import BottomNavbarOverlayImage from "@/_assets/bottom-navbar-overlay.png";
import {
  ButtonStone,
  CalendarDarkIcon,
  NFTDarkIcon,
  PlayDarkIcon,
  SocialFiDarkIcon,
  StatsDarkIcon,
} from "@/src/_components/icons";
import MainDialog from "../main-dialog";
import { detectDeviceType } from "@/src/_utils/deviceUtils";
import PoweredByAvalache from "@/_assets/powered-avalanche.png";
import useActions from "@/src/_hooks/useAction";

const tabItems = [
  {
    key: "nft",
    icon: NFTDarkIcon,
    label: "Claim OG",
    component: import("../free-og-nft-dialog"),
    dialogTitle: "CLAIM OG",
    actionName: "home_claimOG_tab_click",
  },
  {
    key: "stats",
    icon: StatsDarkIcon,
    label: "Stats",
    component: import("../leader-board-dialog"),
    isolate: true,
    actionName: "home_stats_tab_click",
  },
  {
    key: "play",
    icon: PlayDarkIcon,
    label: "Play",
    isolate: true,
    actionName: "home_play_tab_click",
  },
  {
    key: "daily",
    icon: CalendarDarkIcon,
    label: "Bonus",
    component: import("../protection-dialog"),
    isolate: true,
    actionName: "home_dailyBonus_tab_click",
  },
  {
    key: "socialfi",
    icon: SocialFiDarkIcon,
    label: "SocialFi",
    component: import("../sociafi-dialog"),
    dialogTitle: "SOCIALFI",
    isolate: true,
    actionName: "home_socialFi_tab_click",
  },
];

export default function BottomTabBar({
  setIsModalOpen,
}: {
  setIsModalOpen: (_open: boolean) => void;
}) {
  const initialTabState = {
    title: "",
    isolate: false,
    openDialog: false,
    mainComponent: null as any,
    opened: null as string | null,
  };

  const { saveAction } = useActions();
  const [tabState, setTabState] = useState(initialTabState);
  const [deviceType, setDeviceType] = useState("Other");
  const showImage = useRef<boolean>(false);
  const imageElement = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const type = detectDeviceType();
    setDeviceType(type);

    const intervalId = setInterval(() => {
      const nftFlow = localStorage.getItem("nft-flow");
      const shouldShow = nftFlow === "true";
      if (showImage.current !== shouldShow) {
        showImage.current = shouldShow;

        if (imageElement.current) {
          imageElement.current.style.display = shouldShow ? "block" : "none";
        }
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const handleTabClick = (item: (typeof tabItems)[0]) => {
    const clickedTitle = item.dialogTitle ?? item.label;

    if (clickedTitle !== tabState.title) {
      if (clickedTitle === "Play") {
        setTabState(initialTabState);
        setIsModalOpen(false);
      } else {
        setTabState((prevState) => ({
          title: clickedTitle,
          openDialog: true,
          isolate: item.isolate ?? false,
          mainComponent: item?.component,
          opened: prevState.opened === item.key ? null : item.key,
        }));
        setIsModalOpen(true);
      }
    }
  };

  const setOpened = (opened: string | null) => {
    setTabState((prev) => ({ ...prev, opened }));
  };

  const setOpenDialog = (openDialog: boolean) => {
    setTabState((prev) => ({ ...prev, openDialog }));
  };

  return (
    <>
      <div className="mt-auto relative w-full h-36 overflow-hidden">
        <Image
          priority
          alt="Bottom Navbar Image"
          src={BottomNavbarOverlayImage}
          width={1000}
          className={`w-full block absolute ${
            deviceType === "Android" ? "-bottom-3" : "bottom-0"
          } h-full`}
        />
        <div
          className={`w-full ${
            deviceType === "Android" ? "pt-8" : "pt-6"
          } px-4 grid grid-cols-5 relative items-center`}
        >
          {tabItems.map((item) => (
            <ButtonStone
              key={item.key}
              onClick={() => {
                handleTabClick(item);
                saveAction(item?.actionName);
              }}
            >
              <div className="relative flex flex-col items-center">
                <item.icon focused={tabState.opened === item.key} />
                <span
                  className="absolute bottom-0 -translate-y-2 text-xs px-1 py-1.5 text-center text-[#584255] font-bold"
                  style={{ wordSpacing: "-2px" }}
                >
                  {item.label}
                </span>
              </div>
            </ButtonStone>
          ))}
        </div>
        <Image
          src={PoweredByAvalache}
          alt="powered-by-avalanche"
          width={120}
          className="absolute left-1/2 translate-x-[-50%] top-9 z-[200] pointer-events-none opacity-100 transition-opacity duration-50"
          ref={imageElement}
          style={{ display: "none" }}
        />
      </div>
      {tabItems.some((i) => i.key === tabState.opened) && (
        <MainDialog
          title={tabState.title}
          openDialog={tabState.openDialog}
          isolate={tabState.isolate}
          mainComponent={tabState.mainComponent}
          setOpened={setOpened}
          setOpenDialog={setOpenDialog}
        />
      )}
    </>
  );
}
