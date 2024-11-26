import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";
import { Button } from "@/src/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/src/_components/ui/dialog";
import StoreItem from "@/src/app/(home)/_components/store-dialog/item-card";

import {
  collectorPassData,
  catchUpBundlesData,
  CollectorItem,
} from "@/src/app/(home)/data";

import close from "@/_assets/icons/close-button.png";
import starBgIcon from "@/_assets/star-bg.png";
import bottomBoard from "@/_assets/bottom-board.png";

export default function ClaimDialog({
  children,
  type,
}: {
  children?: React.ReactNode;
  type: "store" | number;
}) {
  const [purchasedId, setPurchasedId] = useState(4);
  const [claimedId, setClaimedId] = useState(1);
  const [collectorData, setCollectorData] = useState<CollectorItem[]>([]);

  useEffect(() => {
    setCollectorData(collectorPassData);
  }, [collectorPassData]);

  useEffect(() => {
    if (type === "store") {
      const _purchasedId = collectorPassData.find(
        (item) => item.purchased === true
      )?.id;
      const _claimedId = collectorPassData.find(
        (item) => item.claimed === true
      )?.id;

      setPurchasedId(_purchasedId ?? 4);
      setClaimedId(_claimedId ?? 1);
    }
  }, [collectorData]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        containerClassName="flex flex-col !overflow-hidden !max-h-[75dvh]"
        isClaimBoard
      >
        <BoxMain hideClose className="rounded-t-3xl">
          <div className="z-20 px-2 text-center font-bumper-sticker text-3xl text-[#491F36] stroke-[linear-gradient(to right, #B4704A, #F4A860)]">
            {type === "store"
              ? "Claim a new collectible everyday!"
              : catchUpBundlesData[type - 1].title}
          </div>
          <BoxContent className="mt-0 p-0 mx-1 pb-3 overflow-auto mb-2 grid align-center rounded-3xl border border-solid border-white/40 bg-[#EED1B8]">
            {type === "store" ? (
              <div className="grid grid-cols-3 gap-3 p-3">
                {collectorData.map((item) => {
                  return (
                    <StoreItem
                      key={item.id}
                      id={item.id}
                      title={`${item.id} ${item.title}`}
                      type="claim"
                      price={item.price}
                      purchased={item.purchased}
                      claimed={item.claimed}
                      lock={item.id > purchasedId}
                      unlockable={item.id > claimedId + 1}
                      icon={item.icon}
                      star
                      onClick={() => {
                        setCollectorData((prev) => {
                          const newData = [...prev];
                          newData[item.id - 1].claimed = true;
                          return newData;
                        });
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <div className="relative flex flex-col items-center justify-center m-2 rounded-2xl bg-light-orange">
                  <Image
                    src={catchUpBundlesData[type - 1].icon}
                    alt={catchUpBundlesData[type - 1].title}
                    width={120}
                    height={120}
                    className="py-6 z-[1]"
                  />

                  <Image
                    src={starBgIcon}
                    alt="Star background"
                    width={188}
                    height={188}
                    className="absolute bottom-[calc(50%-94px)] left-[calc(50%-94px)] z-0"
                  />
                </div>
                <div className="flex flex-col items-center justify-center text-base font-bold text-[#745061] font-made-tommy">
                  <p>
                    {catchUpBundlesData[type - 1].collectibles} Kokomo
                    Collectibles
                  </p>
                  <p>{catchUpBundlesData[type - 1].kokos} Kokos</p>
                  <p>{catchUpBundlesData[type - 1].spins} Spins</p>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center m-2 p-2 rounded-2xl bg-light-tan">
                  <Button
                    className={cn(
                      "w-full bg-green px-3 py-0 text-xl text-[#EFF6FF] font-made-tommy font-extrabold rounded-lg shadow-[0_1px_0_0_#5F3F57] z-[99] hover:bg-neutral-500 active:bg-neutral-600"
                    )}
                  >
                    Buy
                  </Button>
                  <div className="text-base font-bold text-[#745061] text-center">
                    ${catchUpBundlesData[type - 1].price}
                  </div>
                </div>
              </>
            )}
          </BoxContent>
          <DialogClose asChild>
            <button className="absolute w-[86px] h-3 -bottom-2 left-[calc(50%-43px)]">
              <Image
                src={close}
                alt="Close"
                className="absolute -top-4 left-[calc(50%-22px)] w-11 h-11"
              />
              <Image src={bottomBoard} alt="Bottom board" />
            </button>
          </DialogClose>
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
