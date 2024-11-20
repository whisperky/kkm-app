"use client";

import React from "react";
import ShieldIcon from "../../../../_assets/icons/shield.svg";
import Image from "next/image";

export default function Announcement() {
  const announcement = {
    icon: ShieldIcon,
    title: "Start playing to activate 1 Min. of Point Protection",
  };
  return (
    <div className="bg-[#415A92] space-x-2 relative h-12 py-2 flex justify-center items-center text-white">
      <div>
        <Image
          src={announcement.icon}
          alt="Shield Icon"
          width={20}
          height={40}
          className="size-8"
        />
      </div>
      <div className="text-sm font-made-tommy font-bold leading-3">
        {announcement.title}
      </div>
    </div>
  );
}
