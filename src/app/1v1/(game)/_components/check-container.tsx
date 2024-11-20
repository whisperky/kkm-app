"use client";

import React, { useMemo } from "react";
import { RangeColorMap } from "../../../../_utils/background-pixers";
import { generateChunk } from "../../../../_utils/kokos";
import CheckboxRowContainer from "./check-row-container";
import { cellColor, lineColors } from "../../../../_utils/pixer-color";
import { useAudio } from "@/src/_hooks/use-audio";

const CHUNK_SIZE = 9;
const TOTAL_AVAILABLE_KOKOS = 101;
const TOTAL_KOKOS = (TOTAL_AVAILABLE_KOKOS + 25) * 1;

export default function CheckBoxContainer() {
  const { playClickAudio } = useAudio();
  const MemoizedCheckboxRowContainer = React.memo(CheckboxRowContainer);
  const numberOfChunks = Math.ceil(TOTAL_KOKOS / CHUNK_SIZE);
  const lineColorMap = useMemo(() => new RangeColorMap(lineColors), []);
  const cellColorMap = useMemo(() => new RangeColorMap(cellColor, 120 * 9), []);

  const chunks = useMemo(() => {
    const generatedChunks = [];
    for (let i = 0; i < numberOfChunks; i++) {
      const remains = TOTAL_KOKOS - (i * CHUNK_SIZE + CHUNK_SIZE);
      const chunk = generateChunk(remains > CHUNK_SIZE ? CHUNK_SIZE : remains);
      generatedChunks.push({ index: i, chunk });
    }
    return generatedChunks;
  }, [numberOfChunks]);

  return chunks.map(({ chunk, index: chunkIndex }) => (
    <MemoizedCheckboxRowContainer
      key={chunkIndex}
      startFrom={chunkIndex * CHUNK_SIZE}
      index={chunkIndex}
      chunk={chunk}
      colorRange={lineColorMap}
      cellColorRange={cellColorMap}
      playClickAudio={playClickAudio}
    />
  ));
}
