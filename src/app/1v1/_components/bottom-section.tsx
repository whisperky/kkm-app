"use client";

import React, { useCallback, useContext, useMemo } from "react";
import ButtonSlotBoard from "../../../_assets/buttons-slot-board.png";
import { ConnectButton } from "@/src/_components/shared/custom-button";
import CipboardIcon from "../_assets/icons/clipboard.svg";
import TgPlaneIcon from "../_assets/icons/tg-plane.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TelegramShareButton } from "react-share";
import { createInviteKey } from "@/utils/keys";
import { GeneralContext } from "../../general-context";
import useActions from "@/src/_hooks/useAction";

interface Props {
  scale: number;
}

export default function BottomSection({ scale }: Props) {
  const { sessionId } = useContext(GeneralContext);
  const { saveAction } = useActions();

  const router = useRouter();
  const botURL = useMemo(
    () =>
      process.env.NEXT_PUBLIC_HOSTED_BOT_URL ||
      "https://t.me/One_Million_One_bot",
    []
  );
  const inviteKey = useMemo(() => createInviteKey(sessionId), [sessionId]);
  const url = useMemo(
    () => `${botURL}?start=GI_${inviteKey}`,
    [botURL, inviteKey]
  );

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
    router.push(`/1v1/waiting?inviteKey=${inviteKey}`);
  }, [inviteKey, router, url]);

  return (
    <div
      className="flex justify-center mt-auto relative pb-3 z-30"
      style={{
        transform: `scale(${scale}) translateY(${
          (window.innerHeight - 732) / 2
        }px)`,
        transformOrigin: "bottom center",
      }}
    >
      <div className="relative max-w-[90%] h-[225px] w-full ">
        <Image
          priority
          src={ButtonSlotBoard}
          width={600}
          alt="button-slot-board"
          className="w-full h-[225px] absolute"
        />
        <div className="w-full absolute flex flex-col justify-between items-center h-full z-20 pt-[20px] pb-[28px] mx-auto">
          <div className="flex justify-between w-full max-w-[90%]">
            <TelegramShareButton
              title={"💥 1v1 me in 1M1!? 💥 \n\nClick the link to join and we both earn 1000 Kokos just for playing. Winner takes the full 3000 Koko prize! 🥥"}
              url={url}
              className="w-full max-w-[84%] -translate-y-0.5"
              onClick={() => {
                saveAction("miniMatch_inviteTG_click");
              }}
            >
              <ConnectButton className="w-full justify-center font-extrabold">
                <div className="flex flex-row space-x-2">
                  <Image
                    src={TgPlaneIcon}
                    height={20}
                    width={20}
                    alt="Clipboard icon"
                    className="w-6 h-6"
                  />
                  <span>Invite Friend</span>
                </div>
              </ConnectButton>
            </TelegramShareButton>
            <ConnectButton
              onClick={() => {
                copyLink();
                saveAction("miniMatch_copyLink_click");
              }}
              className="justify-center w-[14%] rounded-full !p-0"
            >
              <Image
                src={CipboardIcon}
                height={40}
                width={40}
                alt="Clipboard icon"
                className="w-6 h-6"
              />
            </ConnectButton>
          </div>
          <ConnectButton
            onClick={() => {
              saveAction("miniMatch_createChallenge_click");
              router.push("/1v1/waiting");
            }}
            className="w-full justify-center max-w-[90%] font-extrabold"
            color="#23B3B2"
          >
            Create Challenge
          </ConnectButton>
          <ConnectButton
            onClick={() => router.push("/")}
            className="w-full justify-center max-w-[90%] font-extrabold"
            color="#FF6F67"
          >
            Cancel
          </ConnectButton>
        </div>
      </div>
    </div>
  );
}
