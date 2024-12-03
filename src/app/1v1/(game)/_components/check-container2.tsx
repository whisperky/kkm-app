"use client";

import React, { useMemo } from "react";
import { BoxContextProvider } from "../_context/boxContext";
import KokoContainer2 from "./row-container2";
import { RangeColorMap } from "@/src/_utils/background-pixers";
import { lineColors } from "@/src/_utils/pixer-color";

const rows: [number, number?, ("center" | "side")?][] = [
  [1, 6, "center"],
  [7, 8, "center"],
  [15],
  [24],
  [33],
  [42, 7, "side"],
  [49, 5, "side"],
  [54, 7, "side"],
  [61],
  [70],
  [79],
  [88, 8, "center"],
  [96, 6, "center"],
];

export default function CheckBoxContainer2() {
  const lineColorMap = useMemo(() => new RangeColorMap(lineColors), []);

  return (
    <BoxContextProvider>
      <div className="h-full flex-grow flex flex-col">
        {rows.map(([start, size, space], i) => (
          <KokoContainer2
            key={i}
            index={i}
            startFrom={start}
            size={size}
            space={space}
            colorRange={lineColorMap}
          />
        ))}
      </div>
    </BoxContextProvider>
  );
}
