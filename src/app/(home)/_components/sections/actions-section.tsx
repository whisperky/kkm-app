"use client";

import { ConnectButton } from "@/src/_components/shared/custom-button";
import Image from "next/image";
import board from "@/_assets/board.png";
import { useRouter } from "next/navigation";
import useActions from "@/src/_hooks/useAction";

export default function BottomSection() {
  const router = useRouter();
  const { saveAction } = useActions();

  return (
    <section className="relative rounded-3xl p-1 py-3 mt-auto">
      <Image
        src={board}
        alt="board"
        width={800}
        height={800}
        priority
        className="absolute inset-0 size-full z-0"
      />
      <div className="p-4 text-golden-brown space-y-4 z-10">
        <ConnectButton
          onClick={() => {
            router.push("/season-one");
            saveAction("home_play_button_click");
          }}
          className="w-full justify-center font-extrabold"
        >
          Play Season 1
        </ConnectButton>
        <ConnectButton
          onClick={() => {
            router.push("/1v1");
          }}
          className="w-full justify-center font-extrabold"
          color="#A1C41F"
        >
          Play 1v1 Mini-Matches
        </ConnectButton>
        <ConnectButton
          className="w-full justify-center relative font-extrabold"
          color="#23B3B2"
          onClick={() => router.push("/spinner")}
        >
          <span>Koko Spinner</span>
          <span className="absolute -right-1 -top-1 size-6 inline-flex justify-center items-center rounded-full bg-[#18C75E] text-white shadow-[0_.12rem] shadow-black/30">
            !
          </span>
        </ConnectButton>
      </div>
    </section>
  );
}
