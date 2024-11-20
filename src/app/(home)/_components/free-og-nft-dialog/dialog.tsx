import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/_components/ui/dialog";
import React from "react";
import FreeOGNFTDialog from ".";

export default function FreeogDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        title="FREE OG NFT"
        containerClassName="text-[#5F3F57] text-lg font-[700] h-full flex flex-col"
      >
        <FreeOGNFTDialog />
      </DialogContent>
    </Dialog>
  );
}
