"use client";
import React from "react";
import CheckboxButton from "./checkbox";
import { RangeColorMap } from "@/src/_utils/background-pixers";
import { cn } from "@/lib/utils";

export default function KokoContainer({
  chunk,
  startFrom,
  index,
  ref,
  playClickAudio,
  colorRange,
  cellColorRange,
}: {
  chunk: Omit<MainGameKokoType, "key">[];
  startFrom: number;
  index: number;
  ref?: any;
  playClickAudio?: () => void;
  colorRange?: RangeColorMap;
  cellColorRange?: RangeColorMap;
}) {
  return (
    <div
      className={cn(
        `-px-6 grid grid-cols-9 justify-items-center`,
        index == 0 && "pt-44",
        index == 111110 && "pb-32"
      )}
      style={{ backgroundColor: `${colorRange?.getLineColor(index)}` }}
      data-key={index}
      ref={ref}
    >
      {chunk?.map((koko, i) => {
        const key = startFrom + i;
        return (
          <CheckboxButton
            key={key}
            index={key}
            score={koko.score}
            playClickAudio={playClickAudio}
            cellColorRange={cellColorRange}
          />
        );
      })}
    </div>
  );
}
