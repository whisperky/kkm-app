"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { Button } from "../ui/button";
import { ClipBoardIcon, TgPlaneIcon } from "../icons";
import { GeneralContext } from "@/src/app/general-context";
import toast from "react-hot-toast";
import { TelegramShareButton } from "react-share";
import useActions from "@/src/_hooks/useAction";

export default function ShareButtons({
  shareName = "socialFi_inviteTG_click",
  copyName = "socialFi_copyLink_click",
}: {
  shareName?: string;
  copyName?: string;
}) {
  const { sessionId } = useContext(GeneralContext);
  const { saveAction } = useActions();

  const botURL = useMemo(
    () =>
      process.env.NEXT_PUBLIC_HOSTED_BOT_URL ||
      "https://t.me/One_Million_One_bot",
    []
  );

  const link = useMemo(
    () => `${botURL}?start=rs_${sessionId}`,
    [botURL, sessionId]
  );

  const handleShare = useCallback(async () => {
    try {
      await window.navigator.clipboard.writeText(`Play 1M1 with me for a FREE OG NFT! 🥥\n📈 Farm P2A points\n⚔️ Challenge friends in PvP tapping\n🤑 Free daily spin for real USDT \n\n ${link}`);
      toast.success("Invite Link copied to clipboard");
      saveAction(copyName);
      saveAction('socialFi_copyLink_click');
    } catch (e) {
      toast.error("Copy not supported");
    }
  }, [copyName, link, saveAction]);

  const handleTelegramShareClick = useCallback(async () => {
    try {
      saveAction(shareName);
      saveAction('socialFi_inviteTG_click');
    } catch (e) {
      console.log(e);
      toast.error("Error tracking Telegram Share click");
    }
  }, [saveAction, shareName]);

  return (
    <>
      <TelegramShareButton
        title={`Play 1M1 with me for a FREE OG NFT! 🥥\n📈 Farm P2A points\n⚔️ Challenge friends in PvP tapping\n🤑 Free daily spin for real USDT \n\n ${link}`}
        url=" "
        onClick={handleTelegramShareClick}
        className={`!py-2 h-auto flex-1 flex items-center justify-center gap-1 rounded-md hover:!bg-green/80 !text-white !font-made-tommy !font-bold btn-animate !shadow-[0_0.15rem] !bg-green !shadow-[#2C7C4C]`}
      >
        <TgPlaneIcon />
        Telegram
      </TelegramShareButton>
      <Button
        onClick={handleShare}
        className={`p-0 py-2 h-auto flex-1 flex gap-1 rounded-md hover:bg-green/80 text-white font-bold btn-animate !shadow-[0_0.15rem] bg-green !shadow-[#2C7C4C]`}
      >
        <ClipBoardIcon />
        Copy Invite
      </Button>
    </>
  );
}
