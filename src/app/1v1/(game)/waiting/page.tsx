"use client";

import Image from "next/image";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Background from "@/_assets/background.png";
import SpinnerIcon from "../../_assets/icons/spinner.svg";
import SingleButtonSlot from "@/_assets/single-button-slot.png";
import { ConnectButton } from "@/src/_components/shared/custom-button";
import { useRouter } from "next/navigation";
import IntroScreen from "../_components/intro-screen";
import { SocketContext } from "../_context/socket";
import { GeneralContext } from "@/src/app/general-context";
import { MatchContext } from "../_context/match";
import toast from "react-hot-toast";
import { defaultUsername } from "@/src/_utils/defaults";
import WebApp from "@twa-dev/sdk";
import { decodeInviteKey } from "@/utils/keys";
import { useSendMessage } from "@/services/game/match";
import useActions from "@/src/_hooks/useAction";

// const randomId = Math.floor(Math.random() * 10000);

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"created" | "waiting" | "start">(
    "created"
  );
  const { socket, socketStatus } = useContext(SocketContext);
  const { sessionId, username } = useContext(GeneralContext);
  const { players, setPlayers } = useContext(MatchContext);
  const { saveAction } = useActions();
  const inviteKey = useMemo(
    () => searchParams?.inviteKey,
    [searchParams?.inviteKey]
  );
  const { mutateAsync: sendMessage } = useSendMessage();

  useEffect(() => {
    const joinRoom = (roomId: string) => {
      socket?.emit("join-room", {
        roomId: roomId,
        username: username,
      });
    };

    socket?.on("match-found", (data) => {
      const roomId = data?.matchId;
      console.log(`Match found in ${roomId}:`, data);

      setStatus("start");
      setPlayers?.(data?.players);
      joinRoom?.(roomId);
      setTimeout(() => router.replace(`/1v1/game/${roomId}`), 2000);
    });
  }, [router, setPlayers, socket, username]);

  // redirect back when disconnected
  useEffect(() => {
    if (socketStatus != "disconnected") return;

    router.replace("/1v1");
    toast.error("check your internet connection, server disconnected");
  }, [router, socketStatus]);

  useEffect(() => {
    if (!socket || status != "created") return;

    console.log("\n\n\n");
    console.log("joining match", { inviteKey, sessionId, socket });
    console.log("\n\n\n");

    socket?.emit("join-1v1", {
      sessionId: `${sessionId}`,
      username,
      inviteKey: inviteKey || "",
      gameId: process.env.NEXT_PUBLIC_1M1_MINI_ID,
    });
    setStatus("waiting");
  }, [inviteKey, sessionId, socket, status, username]);

  useEffect(() => {
    if (!inviteKey) return;

    const { sessionId: inviter } = decodeInviteKey(inviteKey);
    if (!inviter || inviter == sessionId) return;

    const send = async () => {
      const message = `🎉 *Exciting news!*\nYour friend ${
        username ? `*${username}* ` : ""
      }has accepted your invite and just joined the game. The competition is on!\nGet ready to face off in an *epic 1v1 match* — may the best player win!`;

      sendMessage?.({
        message,
        sessionId: `${inviter}`,
      });
    };
    send();
  }, [inviteKey, sendMessage, sessionId, username]);

  useEffect(() => {
    const backButton = WebApp?.BackButton;
    backButton.onClick(() => {
      try {
        router.push("/1v1");
      } catch (err) {
        console.log("error", err);
      }
    });
  }, [router]);

  return (
    <div>
      <Image
        src={Background}
        height={1000}
        width={1000}
        alt="background"
        className="object-cover fixed inset-0 max-h-screen"
      />
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <Image
          priority
          src={SpinnerIcon}
          width={600}
          alt="spinner-icon"
          className="animate-spin direction-reverse h-[160px] w-[160px]"
        />
        <p className="py-6 text-white font-extrabold text-2xl text-center">
          Waiting for an opponent
        </p>
        <div className="absolute bottom-0 w-full py-12 px-4">
          <div className="relative w-full mt-auto">
            <Image
              priority
              src={SingleButtonSlot}
              width={600}
              alt="button-slot-board"
              className="w-full h-[75px] absolute"
            />
            <div className=" pt-[4.5%]">
              <ConnectButton
                onClick={() => {
                  saveAction("miniMatch_cancel_click");
                  router.replace("/1v1");
                }}
                className="w-full justify-center mx-auto max-w-[90%]"
                color="#FF6F67"
              >
                Cancel
              </ConnectButton>
            </div>
          </div>
        </div>
      </div>
      {status == "start" && (
        <IntroScreen
          myName={`${
            players?.[0]?.username ||
            (players?.[0]?.sessionId == sessionId ? "you" : defaultUsername)
          }`}
          myPhoto={players?.[0]?.photo_url || ""}
          opponentName={`${
            players?.[1]?.username ||
            (players?.[1]?.sessionId == sessionId ? "you" : defaultUsername)
          }`}
          opponentPhoto={players?.[1]?.photo_url || ""}
        />
      )}
    </div>
  );
}
