"use client";

import React, { useCallback, useState } from "react";
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

import { collectorPassData } from "@/src/app/(home)/data";

import close from "@/_assets/icons/close-button.png";
import starBgIcon from "@/_assets/star-bg.png";
import bottomBoard from "@/_assets/bottom-board.png";
import { Input } from "@/src/_components/ui/input";
import { useCheckWallet } from "@/services/nft";
import toast from "react-hot-toast";
import { IconSpinner } from "@/src/_components/icons";
import moment from "moment";

export default function ClaimDialog({
  children,
  type,
  data,
  onClick,
}: {
  children?: React.ReactNode;
  type: "store" | string;
  onClick?: (_: any, _data?: Record<string, any>) => void;
  data: {
    title: string;
    price: string | number;
    icon: any;
    rewards?: {
      kokos?: number;
      spins?: number;
      collectibles?: number;
    };
    current_day?: number;
    last_update?: Date;
    itemId?: string;
  };
}) {
  const [walletValue, setWalletValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync: walletExists } = useCheckWallet();

  const handleBuy = useCallback(
    async (e: any) => {
      setLoading(true);
      try {
        if (data?.rewards?.collectibles) {
          if (!walletValue) return toast.error("Please Enter Wallet Address");

          const { data: exists } = await walletExists({ wallet: walletValue });
          if (!exists) return toast.error("Wallet does not exist");
        }

        onClick?.(e, { wallet: walletValue });
      } catch (error) {
        toast.error(
          <p className="text-center">
            Error Checking Wallet
            <br />
            Come Back Later
          </p>
        );
      }
      setLoading(false);
    },
    [data?.rewards?.collectibles, onClick, walletExists, walletValue]
  );

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
              : data?.title}
          </div>
          <BoxContent className="mt-0 p-0 mx-1 pb-3 overflow-auto mb-2 grid align-center rounded-3xl border border-solid border-white/40 bg-[#EED1B8]">
            {type === "store" ? (
              <div className="grid grid-cols-3 gap-3 p-3">
                {collectorPassData.map((item, index) => {
                  return (
                    <StoreItem
                      key={index}
                      id={index}
                      title={`Day ${index}: ${data?.title}`}
                      type="claim"
                      price={0}
                      purchased={true}
                      claimed={
                        (data?.current_day ??
                          data?.rewards?.collectibles ??
                          6) > index
                      }
                      lock={(data?.rewards?.collectibles ?? 4) <= index}
                      unlockable={
                        (data?.current_day ??
                          data?.rewards?.collectibles ??
                          6) <= index &&
                        (data?.current_day == index
                          ? moment().diff(moment(data?.last_update), "days") < 1
                          : true)
                      }
                      itemId={data?.itemId}
                      icon={item.icon}
                      current_day={data?.current_day ?? 6}
                      last_update={data?.last_update}
                      onClick={onClick}
                      star
                    />
                  );
                })}
              </div>
            ) : (
              <>
                <div className="relative flex flex-col items-center justify-center m-2 rounded-2xl bg-light-orange">
                  <Image
                    src={data?.icon}
                    alt={data?.title}
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
                  {data?.rewards
                    ? Object.entries(data?.rewards).map(([key, value]) => (
                        <p key={key}>
                          {value} {key}
                        </p>
                      ))
                    : data?.title}
                </div>
                <div className="flex flex-col gap-2 items-center justify-center m-2 p-2 rounded-2xl bg-light-tan">
                  {data?.rewards?.collectibles && (
                    <Input
                      id="wallet"
                      value={walletValue}
                      onChange={(e) => setWalletValue(e.target.value)}
                      placeholder="Enter your wallet address"
                      className="bg-[#E5E1D3] text-base h-8 rounded-xl border-2 border-[#A07546] !outline-none ring-2 ring-[#634127] focus-visible:ring-[#634127] focus-visible:ring-offset-0 !text-[#7B7B7B]"
                      required
                    />
                  )}
                  <Button
                    onClick={handleBuy}
                    disabled={loading}
                    className={cn(
                      "w-full bg-green px-3 py-0 text-xl text-[#EFF6FF] font-made-tommy font-extrabold rounded-lg shadow-[0_1px_0_0_#5F3F57] z-[99] hover:bg-neutral-500 active:bg-neutral-600",
                      "flex gap-2 items-center"
                    )}
                  >
                    Buy {loading && <IconSpinner />}
                  </Button>
                  <div className="text-base font-bold text-[#745061] text-center">
                    ${data?.price}
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
