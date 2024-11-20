import React from "react";
import css from "./style.module.css";
import { cn } from "@/lib/utils";
import { MultiStarsIcons } from "@/src/_components/icons";

export default function Sabotaged() {
  return (
    <div
      className={cn(
        "relative h-12 py-0 flex justify-center items-center bg-[#AB6AEE] text-white contain-content",
        css.parent
      )}
    >
      <div className="h-full inline-flex justify-center items-center">
        <MultiStarsIcons className={cn("h-full absolute z-0 animate-fade-in-custom ease-in", css.stars)} />
        <span className={cn("z-[1] px-4 text-3xl animate-slide-and-settle ease-in", css.emoji)}>😱</span>
      </div>
      <div className={cn(css.text, "font-bold z-[1]")}>
        <span className="text-nowrap">YOU ARE BEING SABOTAGED! ⚠️🥷</span>
      </div>
    </div>
  );
}
