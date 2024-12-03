"use client";

import React from "react";
import CheckboxButton from "./check-box";
import { RangeColorMap } from "../../../../_utils/background-pixers";
import { grids } from "@/utils/grid";

export default function CheckboxRowContainer({
  chunk,
  startFrom,
  index,
  ref,
  colorRange,
  cellColorRange,
}: {
  chunk: Omit<PvPGameKokoType, "key">[];
  startFrom: number;
  index: number;
  ref?: any;
  colorRange?: RangeColorMap;
  cellColorRange?: RangeColorMap;
  playClickAudio?: () => void;
}) {
  const gridRowIndex = index % grids.length;

  return (
    <div
      className={`-px-6 grid grid-cols-9 justify-items-center ${
        index == 0 && "pt-44"
      } ${index == 111110 && "pb-32"}`}
      style={{ backgroundColor: `${colorRange?.getLineColor(index)}` }}
      data-key={index}
      ref={ref}
    >
      {chunk?.map((koko, i) => {
        const key = startFrom + i;
        return grids[gridRowIndex][i] == 0 ? (
          <span
            key={`span-${key}`}
            className="size-full"
            style={{ backgroundColor: `${cellColorRange?.getLineColor(key)}` }}
          />
        ) : (
          <CheckboxButton
            key={key}
            index={key}
          />
        );
      })}
    </div>
  );
}
