import localFont from "next/font/local";

export const madeTommySoftFont = localFont({
  variable: "--font-made-tommy-soft",
  src: [
    {
      path: "../public/fonts/made-tommy-soft/bold-webfont.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/made-tommy-soft/extrabold-webfont.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/made-tommy-soft/medium-webfont.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/made-tommy-soft/regular-webfont.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const bumperStickerFont = localFont({
  variable: "--font-bumper-sticker",
  src: [
    {
      path: "../public/fonts/bumper_sticker-webfont.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});
