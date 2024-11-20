import BoardXS from "@/_assets/dialog-bg-xs.png";
import BoardSM from "@/_assets/dialog-bg-sm.png";
import BoardMD from "@/_assets/dialog-bg-md.png";
import BoardLG from "@/_assets/dialog-bg-lg.png";
import BoardXL from "@/_assets/dialog-bg-xl.png";
import Board2XL from "@/_assets/dialog-bg-2xl.png";
import StoreBoard from "@/_assets/store/store_modal.png";
import ClaimBoard from "@/_assets/claim_modal.png";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PageTitleBanner from "./page-title-banner";
import React, { useEffect } from "react";

interface DialogContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode | string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  isStoreBoard?: boolean;
  isClaimBoard?: boolean;
  topImageClassName?: string;
  hideImage?: boolean;
  tabBarModal?: boolean;
}

const BOARD_SIZES = {
  xs: BoardXS,
  sm: BoardSM,
  md: BoardMD,
  lg: BoardLG,
  xl: BoardXL,
  "2xl": Board2XL,
} as const;

export default function DialogContainer({
  children,
  title,
  className = "",
  size = "xl",
  isStoreBoard,
  isClaimBoard,
  topImageClassName,
  hideImage,
  tabBarModal,
}: DialogContainerProps) {
  const defaultBoard = BoardLG;
  const boardSrc = BOARD_SIZES[size] || defaultBoard;

  //set custom vh property on mount to fix mobile viewport height issues
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();

    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const getContainerClassName = () => {
    if (size === "sm") return "px-[4%]";
    if (size === "xs") return "p-[4%]";
    if (size === "lg") return "px-[8%] py-[10%]";
    if (size === "2xl") return "p-[4%] pb-[4.5%]";
    return "p-[4%]";
  };

  return (
    <div className={cn("relative")}>
      {!hideImage && (
        <div className="absolute inset-0 -z-20">
          <Image
            src={
              isClaimBoard ? ClaimBoard : isStoreBoard ? StoreBoard : boardSrc
            }
            priority
            alt="board"
            layout="fill"
            objectFit="fill"
          />
        </div>
      )}
      {title && (
        <PageTitleBanner
          topImageClassName={topImageClassName}
          titleBanner={<>{title}</>}
        />
      )}
      <div
        className={cn(
          "relative",
          getContainerClassName(),
          hideImage && "h-auto",
          isStoreBoard && "pt-[2%]"
        )}
      >
        <div
          style={{
            maxHeight: tabBarModal ? "540px" : "80vh",
            maxWidth: tabBarModal ? "86vw" : "",
          }}
          className={cn(
            className,
            "overflow-auto",
            size === "md" && "px-[4%] py-[6%]",
            size == "sm" && "py-[8%]",
            size == "xs" && "p-[1.5%]"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
