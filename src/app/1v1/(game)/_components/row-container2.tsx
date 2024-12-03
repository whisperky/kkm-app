"use client";

import React, { useMemo } from "react";
import { RangeColorMap } from "@/src/_utils/background-pixers";
import { cn } from "@/lib/utils";
import CheckboxButton from "./check-box";

function addToCenter<T>(arr: T[], n: number): (T | null)[] {
  const halfLength = Math.floor(arr.length / 2);
  return [
    ...arr.slice(0, halfLength),
    ...Array(n).fill(null),
    ...arr.slice(halfLength),
  ];
}

export default function KokoContainer2({
  index,
  startFrom,
  size = 9,
  colorRange,
  space = "side",
}: {
  index: number;
  startFrom: number;
  size?: number;
  colorRange?: RangeColorMap;
  space?: "center" | "side";
}) {
  const numSpans = useMemo(
    () => (space === "center" ? 9 - size : 0),
    [size, space]
  );
  const numSideSpans = useMemo(
    () => (space === "side" ? (9 - size) / 2 : 0),
    [size, space]
  );
  const array = useMemo(
    () => Array.from({ length: size }, (_, i) => i),
    [size]
  );
  const withCenter = useMemo(
    () => addToCenter(array, numSpans),
    [array, numSpans]
  );

  return (
    <div
      className={cn(
        `-px-6 grid grid-cols-9 justify-items-center`,
        index == 0 && "pt-44",
        index == 12 && "pb-32"
      )}
      style={{ backgroundColor: `${colorRange?.getLineColor(index)}` }}
      data-key={index}
    >
      {Array.from({ length: numSideSpans }).map((_, i) => (
        <span key={`side-span-${i}`} />
      ))}
      {withCenter.map((i, j) =>
        i != null ? <CheckboxButton key={j} index={startFrom + i} /> : <span key={j} />
      )}
      {Array.from({ length: numSideSpans }).map((_, i) => (
        <span key={`side-span-${i + size}`} />
      ))}
    </div>
  );
}
