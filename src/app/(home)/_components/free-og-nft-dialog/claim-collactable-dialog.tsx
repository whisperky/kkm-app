"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/src/_components/ui/dialog";
import FireIcon from "@/_assets/icons/fire-icon.png";
import SpinnerIcon from "../../../1v1/_assets/icons/spinner.svg";
import { Input } from "@/src/_components/ui/input";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { Button } from "@/src/_components/ui/button";
import { CheckIcon, X } from "lucide-react";
import { useClaimCollectable } from "@/services/nft";
import { GeneralContext } from "@/src/app/general-context";
import useScreenWidthRatio from "@/src/_hooks/use-screen-width-ratio";
import { useEditUserItem } from "@/services/store";

const ClaimCollactableDialog = ({
  id = "",
  current_day = 0,
  children,
  onSubmitEnd,
}: {
  id?: string;
  current_day: number;
  onSubmitEnd?: (_e: any) => void;
  children?: (_: {
    openModal: boolean;
    setOpenModal: Setter<boolean>;
    claimable: boolean;
    setClaimable: Setter<boolean>;
  }) => React.ReactNode;
}) => {
  const { sessionId } = useContext(GeneralContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [claimable, setClaimable] = useState(true);
  const widthRatio = useScreenWidthRatio(390);
  const [connecting, setConnecting] = useState(false);
  const [walletValue, setWalletValue] = useState("");
  const { mutateAsync: claimCollectable } = useClaimCollectable();
  const { mutateAsync: editItem } = useEditUserItem();
  const [walletStatus, setWalletStatus] = useState({
    show: false,
    error: false,
    title: "",
    subTitle: "",
    btnLabel: "",
  });

  const handleWalletValue = useCallback(
    async (e: any) => {
      try {
        if (!id) throw new Error("Id not found");
        setConnecting(true);

        await claimCollectable({ wallet: walletValue, sessionId });
        await editItem({
          id,
          body: {
            purchase_details: {
              current_day: current_day + 1,
              last_update: new Date(),
            },
          },
        });
        setClaimable?.(false);
        setWalletStatus({
          show: true,
          error: false,
          title: "Claim Successful",
          subTitle: "Check your wallet",
          btnLabel: "Great!",
        });
      } catch (error: any) {
        setWalletStatus({
          show: true,
          error: true,
          title: "Sorry, something went wrong",
          subTitle: error?.response?.data?.message || error?.message || "",
          btnLabel: "Ok!",
        });
      } finally {
        setConnecting(false);
        onSubmitEnd?.(e);
      }
    },
    [
      claimCollectable,
      current_day,
      editItem,
      id,
      onSubmitEnd,
      sessionId,
      walletValue,
    ]
  );

  const hideWalletStatus = () => {
    setWalletStatus({
      show: false,
      error: false,
      title: "",
      subTitle: "",
      btnLabel: "",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (openModal && inputRef.current) {
        inputRef.current?.blur();
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [openModal]);

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleWalletStatus = () => {
    localStorage.setItem("nft-flow", "false");
    setOpenModal(false);
  };

  return (
    <>
      {children?.({ openModal, setOpenModal, claimable, setClaimable })}
      <Dialog open={openModal} onOpenChange={(open) => setOpenModal(open)}>
        {connecting ? (
          <SpinnerComponent />
        ) : (
          <DialogContent
            size={walletStatus.show ? "sm" : "md"}
            containerClassName="w-full flex gap-2 overflow-hidden h-full items-center justify-center"
            onInteractOutside={(e) => e.preventDefault()}
            onPointerDownOutside={(event) => event.preventDefault()}
          >
            {walletStatus.show ? (
              <div className="items-center grid justify-center text-center space-y-2 px-3">
                <div
                  className={`font-made-tommy flex items-center gap-2 text-nowrap font-semibold text-lg ${
                    walletStatus.error ? "text-[#b35959]" : "text-[#745061]"
                  }`}
                >
                  {walletStatus.error ? (
                    <X strokeWidth={6} color="#b35959" size={22} />
                  ) : (
                    <CheckIcon strokeWidth={6} color="#24BE62" size={22} />
                  )}
                  {walletStatus.title}
                </div>
                <div
                  className={`font-made-tommy font-semibold text-sm text-[#745061]`}
                >
                  {walletStatus.subTitle}
                </div>
                <Button
                  onClick={() =>
                    walletStatus.error
                      ? hideWalletStatus()
                      : handleWalletStatus()
                  }
                  className="bg-green font-extrabold  text-white h-8 rounded-md hover:bg-emerald-500 shadow-[0_0.15rem] shadow-[#2C7C4C]"
                >
                  {walletStatus.btnLabel}
                </Button>
              </div>
            ) : (
              <form
                className="flex-col w-full space-y-2 items-center"
                onSubmit={(e) => {
                  e?.preventDefault();
                  handleWalletValue(e);
                }}
              >
                <div className="bg-[#E3BEAA] flex-1 overflow-none p-3 rounded-2xl space-y-3">
                  <div className="relative">
                    <Image
                      src={FireIcon}
                      alt="fire-img"
                      className="absolute left-0 top-0 translate-y-[-50%] translate-x-[-50%]"
                    />
                    <Input
                      id="wallet"
                      value={walletValue}
                      onChange={(e) => setWalletValue(e.target.value)}
                      placeholder=" "
                      ref={inputRef}
                      onFocus={handleFocus}
                      className="bg-[#E5E1D3] text-base h-8 rounded-xl border-2 border-[#A07546] !outline-none ring-2 ring-[#634127] focus-visible:ring-[#634127] focus-visible:ring-offset-0 !text-[#7B7B7B]"
                      required
                    />
                    <label
                      htmlFor="wallet"
                      className="absolute w-[281px] top-2 left-1 text-gray-400 pointer-events-none"
                      style={{
                        transform: `scale(${widthRatio})`,
                        transformOrigin: "left",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          color: "#7B7B7B",
                          fontWeight: "medium",
                          lineHeight: "20x",
                        }}
                        className="text-xs"
                      >
                        Enter Avalanche (AVAX C Chain) wallet address
                      </span>
                      <span
                        style={{
                          display: "block",
                          color: "#A07546",
                          opacity: "0.6",
                          fontSize: "8px",
                          textAlign: "center",
                        }}
                      ></span>
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="bg-green w-full font-extrabold text-white h-8 rounded-xl hover:bg-emerald-500 shadow-[0_0.15rem] shadow-[#2C7C4C]"
                  >
                    Claim Free NFT!
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

const SpinnerComponent = () => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <div className="flex flex-col justify-center items-center flex-1">
          <Image
            priority
            src={SpinnerIcon}
            width={600}
            alt="spinner-icon"
            className="animate-spin h-[160px] w-[160px]"
          />
          <div className="py-6">
            <p className="text-white font-extrabold text-2xl">
              Minting in progress...
            </p>
          </div>
        </div>
      </div>
    </DialogPortal>
  );
};

export default ClaimCollactableDialog;
