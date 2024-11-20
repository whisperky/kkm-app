import React from "react";
// import { cn } from "@/lib/utils";
import Image from "next/image";
import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";
import BalanceSection from "./balance-section";
import StoreSection from "./store-items";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/src/_components/ui/dialog";
// import { AccordionItem } from "@radix-ui/react-accordion";
import close from "@/_assets/icons/close-button.png";
import { WalletConnectButton } from "@/src/_components/shared/wallet-connect-button";

export default function StoreModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        containerClassName="flex flex-col !overflow-hidden !max-h-[75dvh]"
        isStoreBoard
      >
        <BoxMain hideClose className="rounded-t-3xl">
          <div className="z-20 mb-4 text-center font-bumper-sticker text-3xl text-[#491F36] stroke-[linear-gradient(to right, #B4704A, #F4A860)]">
            Store
          </div>
          <BalanceSection />
          <BoxContent className="p-0 mx-1 pb-3 overflow-auto mb-2 grid align-center rounded-3xl border border-solid border-white/40 bg-gradient-to-b from-[#C4A797] to-[#DDC2A7]">
            <StoreSection />
            <DialogClose asChild>
              <button className="mx-auto">
                <Image src={close} alt="Close" className="w-[44px] h-[44px]" />
              </button>
            </DialogClose>
            <WalletConnectButton />
          </BoxContent>
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
