"use client";
import Image from "next/image";
import { VariableSizeList } from "react-window";
import { Input } from "@/src/_components/ui/input";
import { Button } from "@/src/_components/ui/button";
import { useGetUncheckedKokosGap } from "@/services/koko";
import BoardSm from "@/src/_assets/dialog-bg-xs.png";
import { ArrowDownUpIcon, TriangleAlert } from "lucide-react";
import React, { useRef, useEffect, useCallback } from "react";
import InputTooltip from "@/src/_assets/input-tooltip.png";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/_components/ui/dialog";

const JumpToKoko = ({
  listRef,
  chunkSize = 9,
  afterJump,
}: {
  listRef: React.RefObject<VariableSizeList>;
  chunkSize?: number;
  afterJump?: ((_jumpedTo: any) => void) | undefined;
}) => {
  const [showJumpToInput, setShowJumpToInput] = React.useState(false);
  const [jumpToInputValue, setJumpToInputValue] = React.useState("");
  const { data: uncheckedGap } = useGetUncheckedKokosGap();

  const modalRef = useRef(null);
  const max = 111111;

  const handleJumpToKoko = useCallback(() => {
    if (jumpToInputValue.length > 0 && listRef.current) {
      const chunkIndex = Math.ceil(
        Math.floor(((parseInt(jumpToInputValue) || 0) - 1) / chunkSize)
      );
      const evalChunkIndex = chunkIndex > max ? max : chunkIndex;
      listRef.current.scrollToItem(evalChunkIndex, "start");
      afterJump?.(evalChunkIndex);
      setShowJumpToInput(false);
    }
  }, [chunkSize, jumpToInputValue, listRef, afterJump]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !(modalRef.current as Node).contains(event.target as Node)
      ) {
        setShowJumpToInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const canScrollRef = useRef(true);

  useEffect(() => {
    const keys = uncheckedGap?.data?.gaps;
    const gapStart = Math.max(0, Number(keys?.[0]) || 0);

    if (canScrollRef.current) {
      if (listRef.current) {
        const chunkIndex = Math.ceil(Math.floor((gapStart - 1) / chunkSize));
        const evalChunkIndex = Math.max(0, chunkIndex) > max ? max : chunkIndex;
        listRef?.current?.scrollToItem(evalChunkIndex, "start");
        afterJump?.(evalChunkIndex);
      }
      canScrollRef.current = gapStart > 0 ? false : true;
    }
  }, [afterJump, chunkSize, listRef, uncheckedGap?.data?.gaps]);

  return (
    <Dialog open={showJumpToInput} onOpenChange={setShowJumpToInput}>
      <DialogTrigger className="fixed z-30 bottom-12 left-0 !outline-none">
        <div className="p-2 pr-5 rounded-[0_10px_10px_0] h-full relative">
          <Image
            priority
            src={BoardSm}
            alt="board"
            height={100}
            width={400}
            className="absolute right-0 h-[150%] w-auto object-cover object-right -z-10 -top-[25%]"
          />
          <ArrowDownUpIcon className="size-8 bg-green text-white p-1 rounded-sm" />
        </div>
      </DialogTrigger>
      <DialogContent
        size="xs"
        className="pb-[80px]"
        containerClassName="w-full !px-1 !py-2 flex gap-2 overflow-hidden h-full items-center justify-center"
      >
        {isNaN(Number(jumpToInputValue)) && jumpToInputValue !== "" && (
          <>
            <Image
              src={InputTooltip}
              alt="board"
              height={100}
              width={400}
              className="right-0 top-[-40px] left-0 h-12 z-10 w-full absolute"
            />
            <div className="right-0 top-[-47px] left-0 h-12 z-20 w-full absolute flex items-center p-2">
              <span className="text-[#502045] text-sm flex items-center gap-x-1">
                <TriangleAlert className="size-4" /> Enter numbers only!{" "}
                {isNaN(Number(jumpToInputValue))}
              </span>
            </div>
          </>
        )}
        <Input
          value={jumpToInputValue}
          onChange={(e) => setJumpToInputValue(e.target.value)}
          type="number"
          pattern="\d*"
          placeholder="Jump to Koko Number"
          className="bg-white text-base h-[36px] ml-0.5 rounded-md border-2 border-[#A07546] !outline-none ring-2 ring-[#634127] focus-visible:ring-[#634127] focus-visible:ring-offset-0"
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              handleJumpToKoko();
            }
          }}
        />
        <Button
          onClick={() => handleJumpToKoko()}
          className="bg-green h-[34px] text-white rounded-md hover:bg-emerald-500 shadow-[0_0.15rem] shadow-[#2C7C4C]"
        >
          Jump
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default JumpToKoko;
