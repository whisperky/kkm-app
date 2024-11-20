"use client";
import Image from "next/image";
import React from "react";
import KokomonHat from "@/_assets/kokomon-hat.png";
import { defaultAvatar } from "@/src/_utils/defaults";

export default function IntroScreen({
  myName,
  myPhoto,
  opponentName,
  opponentPhoto,
}: {
  myName: string;
  myPhoto: string;
  opponentName: string;
  opponentPhoto: string;
}) {
  return (
    <div className="min-h-screen fixed inset-0 z-10">
      <div className="absolute inset-0 h-1/2 flex flex-col justify-center items-center z-10">
        <Image
          src={KokomonHat}
          alt="Player 1 Avatar"
          className="w-28 h-24 -mb-8 z-10"
          width={600}
          height={600}
        />
        <Image
          src={myPhoto || defaultAvatar}
          priority
          alt="Player 1 Avatar"
          className="w-24 h-24 rounded-full border-8 border-[#FF9900] -mb-1"
          width={600}
          height={600}
        />
        <div className="bg-[#FF9900] text-white font-bold py-2 px-4 rounded-md">
          {myName}
        </div>
      </div>
      <div className="absolute inset-0 top-1/2 h-1/2  flex flex-col justify-center items-center z-10">
        <Image
          src={KokomonHat}
          alt="Player 1 Avatar"
          className="w-28 h-24 -mb-8 z-10"
          width={600}
          height={600}
        />
        <Image
          src={opponentPhoto || defaultAvatar}
          priority
          alt="Player 2 Avatar"
          className="w-24 h-24 rounded-full border-8 border-[#8436E3] -mb-1"
          width={600}
          height={600}
        />
        <div className="bg-[#8436E3] text-white font-bold py-2 px-4 rounded-md">
          {opponentName}
        </div>
      </div>
      <svg
        className="absolute top-0 h-full"
        viewBox="0 0 390 482"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-1.88974e-05 -3.57731e-06L-6.10352e-05 482L390 257L390 -3.05176e-05L-1.88974e-05 -3.57731e-06Z"
          fill="#FFC100"
        />
      </svg>

      <svg
        className="absolute bottom-0 h-full max-h-[60%] w-full right-0 left-0"
        viewBox="0 0 390 478"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M390 478V0L0 225L0 478H390Z" fill="#BD86FF" />
      </svg>

      <div className="absolute inset-0 flex z-10 items-center justify-center">
        <div className="bg-white rounded-full mt-[8%] z-20 w-28 h-28 flex items-center justify-center text-3xl font-bold font-bumper-sticker text-[#5F3F57]">
          VS.
        </div>
        <svg
          className="absolute -translate-y-4 w-full"
          width="390"
          height="330"
          viewBox="0 0 390 330"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.54972e-06 329.981L562.917 4.98096L560.216 0.304392L451.488 46.7037L386.375 100.672L372.469 97.6156L277.416 159.529L278.876 134.331L-2.70001 325.304L1.54972e-06 329.981Z"
            fill="white"
          />
        </svg>
        <svg
          className="absolute mt-[42%] rotate-180 w-full"
          width="390"
          height="330"
          viewBox="0 0 390 330"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.54972e-06 329.981L562.917 4.98096L560.216 0.304392L451.488 46.7037L386.375 100.672L372.469 97.6156L277.416 159.529L278.876 134.331L-2.70001 325.304L1.54972e-06 329.981Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
