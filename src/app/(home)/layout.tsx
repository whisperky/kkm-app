"use client";
import React, { useState } from "react";
import Image from "next/image";
import BottomTabBar from "./_components/sections/bottom-tab-bar";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <main className="flex flex-col h-full max-w-[100dvw]">
        {!isModalOpen && <div className="flex-1 p-2">{children}</div>}
        <BottomTabBar setIsModalOpen={setIsModalOpen} />
      </main>
      <Image
        priority
        src={"/images/splash.png"}
        alt="Splash Background"
        width={1080}
        height={1920}
        id="bgImage"
        style={{top: "-10%"}}
      />
    </>
  );
}
