"use client";

import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "./provider";
// import type { Metadata } from "next";
import { bumperStickerFont, madeTommySoftFont } from "@/lib/fonts";
import SplashScreen from "./(home)/_components/splash";
import { useEffect } from "react";

// export const metadata: Metadata = {
//   title: "One Million & One Kokos Season One",
//   description: "One Million and One Kokos Season One",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventZoom, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchmove", preventZoom);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="prefetch" href="/images/flat-logo.png" as="image" />
        <link rel="prefetch" href="/images/season-zero-splash.jpg" as="image" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        ></meta>
      </head>
      <body
        className={cn(
          "font-made-tommy",
          bumperStickerFont.variable,
          madeTommySoftFont.variable
        )}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          maxHeight: "calc(100vh - env(safe-area-inset-bottom))",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overflow: "hidden",
        }}
      >
        <SplashScreen />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
