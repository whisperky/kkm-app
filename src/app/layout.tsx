"use client";

import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "./provider";
// import type { Metadata } from "next";
import { bumperStickerFont, madeTommySoftFont } from "@/lib/fonts";
import SplashScreen from "./(home)/_components/splash";
import BottomNavbarOverlayImage from "@/_assets/bottom-navbar-overlay.png";
import ButtonStoneImage from "@/_assets/button-stone.png";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BREAKPOINTS } from "../_utils/deviceUtils";

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
        />
        <link
          rel="preload"
          href={ButtonStoneImage.src}
          as="image"
          type="image/png"
          media={`(max-width: ${BREAKPOINTS.md}px)`}
        />
        <link
          rel="preload"
          href={BottomNavbarOverlayImage.src}
          as="image"
          type="image/png"
        />
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
        <Provider>
          {children}
          <Analytics />
          <SpeedInsights />
        </Provider>
      </body>
    </html>
  );
}
