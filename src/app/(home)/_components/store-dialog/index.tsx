import React from "react";
import Image from "next/image";

import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/src/_components/ui/dialog";

import BalanceSection from "./balance-section";
import StoreSection from "./store-items";

import close from "@/_assets/icons/close-button.png";

export default function StoreModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        containerClassName="flex flex-col !overflow-hidden !max-h-[90dvh]"
        isStoreBoard
      >
        <BoxMain hideClose className="rounded-t-3xl">
          <div className="z-20 mb-5 text-center font-bumper-sticker text-3xl text-[#491F36]">
            Store
          </div>
          <BalanceSection />
          <BoxContent className="grid p-0 pb-2 mx-1 mb-2 align-center rounded-3xl border border-solid border-white/40 bg-gradient-to-b from-[#C4A797] to-[#DDC2A7] overflow-auto">
            <StoreSection />
            <DialogClose asChild>
              <button className="mx-auto">
                <Image src={close} alt="Close" className="w-11 h-11" />
              </button>
            </DialogClose>
          </BoxContent>
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
