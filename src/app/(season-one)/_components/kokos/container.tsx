"use client";
import React, {
  useMemo,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from "react";
import JumpToKoko from "./jump-to";
import KokoRowContainer from "./row-container";
import { useAudio } from "@/src/_hooks/use-audio";
import { generateChunk } from "@/src/_utils/kokos";
import { VariableSizeList as List } from "react-window";
import { MainGameContext } from "../../main-game-context";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import { RangeColorMap } from "@/src/_utils/background-pixers";
import { cellColor, lineColors } from "@/src/_utils/pixer-color";

const CHUNK_SIZE = 9;
const TOTAL_KOKOS = 1000001;

const MemoizedKokoRowContainer = React.memo(KokoRowContainer);

export default function KokosContainer() {
  const { playClickAudio, pauseAudio } = useAudio();
  const { toggleBox, sessionId } = useContext(MainGameContext);
  const listRef = useRef(null);

  const numberOfChunks = useMemo(() => Math.ceil(TOTAL_KOKOS / CHUNK_SIZE), []);
  const lineColorMap = useMemo(() => new RangeColorMap(lineColors), []);
  const cellColorMap = useMemo(() => new RangeColorMap(cellColor, 120 * 9), []);

  const chunks = useRef<
    { index: number; chunk: Omit<MainGameKokoType, "key">[] }[]
  >([]);

  const nextScrollDownStartIndex = useRef(0);
  const nextScrollUpStartIndex = useRef(0);
  const scrollDirection = useRef("down");

  const fetchQueue = useRef<AbortController[]>([]);

  useEffect(() => {
    for (let i = 0; i < numberOfChunks; i++) {
      const remains = TOTAL_KOKOS - (i * CHUNK_SIZE + CHUNK_SIZE);
      const chunk = generateChunk(remains > CHUNK_SIZE ? CHUNK_SIZE : remains);
      chunks.current.push({ index: i, chunk });
    }
  }, [numberOfChunks]);

  // const ScrollPlaceholder = useMemo(() => {
  //   const placeholderItems = Array.from({ length: 27 }, (_, i) => (
  //     <div key={i} className="h-6 w-6 mt-2 rounded-full bg-[#ccc]" />
  //   ));

  //   const ScrollPlaceholderComponent = React.memo(() => (
  //     <div className="box-border overflow-hidden animate-pulse bg-white z-30">
  //       <div className="grid grid-cols-9 items-center justify-items-center bg-[#eee]">
  //         {placeholderItems}
  //       </div>
  //     </div>
  //   ));
  //   ScrollPlaceholderComponent.displayName = "ScrollPlaceholderComponent";

  //   return ScrollPlaceholderComponent;
  // }, []);

  const renderItem = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = chunks.current[index];
      if (!item) {
        return null;
      }
      const { chunk, index: chunkIndex } = item;
      return (
        <div style={style}>
          <MemoizedKokoRowContainer
            startFrom={chunkIndex * CHUNK_SIZE}
            index={chunkIndex}
            chunk={chunk}
            playClickAudio={playClickAudio}
            colorRange={lineColorMap}
            cellColorRange={cellColorMap}
          />
        </div>
      );
    },
    [playClickAudio, lineColorMap, cellColorMap, chunks]
  );

  const fetchCheckedCheckboxes = useCallback(
    async (chunkIndex: number, count: number) => {
      const controller = new AbortController();
      const { signal } = controller;

      fetchQueue.current.push(controller);
      while (fetchQueue.current.length > 3) {
        const oldestController = fetchQueue.current.shift();
        oldestController?.abort();
      }
      try {
        const kokoStartIndex = Math.max(0, chunkIndex * CHUNK_SIZE);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API_BASE_URL}/points-service/koko?size=${count}&start=${kokoStartIndex}`,
          {
            method: "GET",
            signal,
          }
        );
        const data = await res.json();
        return data.data.boxes.data as Omit<MainGameKokoType, "value">[];
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", error.message);
        }
        return [];
      }
    },
    []
  );

  const updateCheckedBoxes = useCallback(
    (newCheckedBoxes: Omit<MainGameKokoType, "value">[]) => {
      newCheckedBoxes.forEach((box) => {
        console.log();
        
        toggleBox?.(
          box?.key,
          !!box?.checked,
          box?.lastCheckedByUserId == sessionId,
          false,
          box.isPermanentlyProtected
        );
      });
    },
    [toggleBox, sessionId]
  );

  const getItemSize = useCallback((index: number) => {
    return index == 0 ? 176 + 40 : 40;
  }, []);

  const scrollThreshold = 10;

  const handleScrollDown = useCallback(
    (visibleStopIndex: number) => {
      const diff = Math.abs(
        visibleStopIndex - nextScrollDownStartIndex.current
      );
      if (
        visibleStopIndex !== 0 &&
        (visibleStopIndex >= nextScrollDownStartIndex.current ||
          diff > scrollThreshold)
      ) {
        // console.log("visibleStopIndex", visibleStopIndex);
        fetchCheckedCheckboxes(visibleStopIndex, 120).then((newCheckedBoxes) =>
          updateCheckedBoxes(newCheckedBoxes)
        );
        nextScrollDownStartIndex.current = Math.abs(
          visibleStopIndex + scrollThreshold
        );
      }
    },
    [fetchCheckedCheckboxes, updateCheckedBoxes]
  );

  const handleScrollUp = useCallback(
    (visibleStartIndex: number) => {
      const diff = Math.abs(nextScrollUpStartIndex.current - visibleStartIndex);
      if (
        visibleStartIndex !== 0 &&
        (visibleStartIndex <= nextScrollUpStartIndex.current ||
          diff > scrollThreshold)
      ) {
        fetchCheckedCheckboxes(visibleStartIndex, 120).then((newCheckedBoxes) =>
          updateCheckedBoxes(newCheckedBoxes)
        );
        nextScrollUpStartIndex.current = Math.max(
          0,
          visibleStartIndex - scrollThreshold
        );
      }
    },
    [fetchCheckedCheckboxes, updateCheckedBoxes]
  );

  const handleItemsRendered = useCallback(
    ({
      visibleStopIndex,
      visibleStartIndex,
    }: {
      visibleStopIndex: number;
      visibleStartIndex: number;
    }) => {
      if (scrollDirection.current === "down") {
        handleScrollDown(visibleStopIndex);
      } else if (scrollDirection.current === "up") {
        handleScrollUp(visibleStartIndex);
      }
    },
    [handleScrollDown, handleScrollUp]
  );

  const afterJump = useCallback(
    (jumpedTo: number) => {
      nextScrollUpStartIndex.current = jumpedTo;
      nextScrollDownStartIndex.current = jumpedTo;
      // console.log("jumpedTo", jumpedTo);

      fetchCheckedCheckboxes(jumpedTo < 0 ? 0 : jumpedTo, 200).then(
        (newCheckedBoxes) => {
          // console.log("newCheckedBoxes", newCheckedBoxes);
          updateCheckedBoxes(newCheckedBoxes);
        }
      );
    },
    [fetchCheckedCheckboxes, updateCheckedBoxes]
  );

  useEffect(() => {
    return () => {
      pauseAudio();
    };
  }, [pauseAudio]);

  return (
    <>
      <JumpToKoko
        listRef={listRef}
        chunkSize={CHUNK_SIZE}
        afterJump={afterJump}
      />
      <div style={{ display: "flex", flexGrow: 1, height: "100%" }}>
        <AutoSizer>
          {({ height, width }: Size) => (
            <List
              ref={listRef}
              itemCount={Math.ceil(chunks?.current.length ?? 0)}
              itemSize={getItemSize}
              height={height}
              width={width}
              overscanCount={100}
              onScroll={(props) => {
                switch (props.scrollDirection) {
                  case "forward":
                    scrollDirection.current = "down";
                    break;
                  case "backward":
                    scrollDirection.current = "up";
                    break;
                  default:
                    break;
                }
              }}
              onItemsRendered={handleItemsRendered}
            >
              {renderItem}
            </List>
          )}
        </AutoSizer>
      </div>
    </>
  );
}
