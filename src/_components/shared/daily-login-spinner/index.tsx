"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import Spinner from "@/src/app/(home)/_components/spinner";
import { spinnerProbability } from "@/src/_constants/spinner-probabilities";
import { formatBigNumber, shuffleArray } from "@/src/_utils/number";
import Image from "next/image";
import usdt from "@/_assets/usdt.png";
import question from "@/_assets/icons/question.svg";
import { ConnectButton } from "../custom-button";
import MoreSpins from "./more-spins";
import { useSpinner, useSpins } from "@/services/spins";
import { GeneralContext } from "@/src/app/general-context";
import { useAddPoints } from "@/services/koko";
import { useAddUsdt } from "@/services/usdt";
import { Button } from "../../ui/button";
import TopSection from "@/src/app/(home)/_components/sections/top-section";
import WebApp from "@twa-dev/sdk";
import { detectDeviceType } from "@/src/_utils/deviceUtils";

type TReward = "kokos" | "USDT" | "spin";

const getRandomTarget = () => {
  const probs = spinnerProbability?.toSorted((a, b) => a.prob - b.prob);
  const totalProb = probs.reduce((sum, reward) => sum + reward.prob, 0);
  const prob = Math.random() * totalProb;
  let cumulativeProb = 0;
  let selected;

  for (const i of probs.reverse()) {
    cumulativeProb += i.prob;
    if (prob <= cumulativeProb) {
      selected = i;
      break;
    }
  }
  return selected;
};

export default function KokoSpinner() {
  // const { mutateAsync } = useMutateDailyLogin();
  const { sessionId, addMyScore, addMyUsdt } = useContext(GeneralContext);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const spinsList = useMemo(() => shuffleArray(spinnerProbability), []);
  const [deviceType, setDeviceType] = useState("Other");

  useEffect(() => {
    const type = detectDeviceType(); // Call the utility function
    setDeviceType(type);
  }, []);

  const [randomTarget, setRandomTarget] =
    useState<(typeof spinnerProbability)[0]>();
  const [openReward, setOpenReward] = useState(false);

  const { data: spins, refetch } = useSpins({ sessionId });
  const { mutateAsync: postSpin } = useSpinner({
    sessionId,
    onSuccess: refetch,
  });
  const { mutateAsync: postPoints } = useAddPoints();
  const { mutateAsync: postUsdt } = useAddUsdt({
    sessionId,
    onSuccess: refetch,
  });

  const addSpin = useCallback(async () => {
    try {
      await postSpin?.({ spins: 1, source: "bonus" });
    } catch (error) {
      console.error(error);
    }
  }, [postSpin]);

  const addScore = useCallback(
    async (amount: number = 0) => {
      try {
        await postPoints?.({ sessionId, amount });
        addMyScore?.(amount);
      } catch (error) {
        console.error(error);
      }
    },
    [addMyScore, postPoints, sessionId]
  );

  const addUsdt = useCallback(
    async (amount: number = 0) => {
      try {
        await postUsdt?.(amount);
        addMyUsdt?.(amount);
      } catch (error) {
        console.error(error);
      }
    },
    [addMyUsdt, postUsdt]
  );

  const handleBonus = useCallback(async () => {
    setLoading(true);
    const reward = randomTarget?.type as TReward;

    try {
      if (reward == "USDT") setOpenReward(true);
      if (reward == "USDT") await addUsdt?.(randomTarget?.value);
      if (reward == "kokos") await addScore?.(randomTarget?.value);
      if (reward == "spin") await addSpin?.();

      await postSpin?.({});
    } catch (error) {
      // error
    }

    setLoading(false);
    setRandomTarget(getRandomTarget());
  }, [addScore, addSpin, addUsdt, postSpin, randomTarget]);

  useEffect(() => {
    setRandomTarget(getRandomTarget());
  }, []);

  useEffect(() => {
    const backButton = WebApp?.BackButton;
    if (isOpen && !backButton.isVisible) {
      backButton.show?.();
      backButton.onClick(() => {
        setIsOpen(false);
      });
    } else {
      backButton.hide?.();
    }
  }, [isOpen]);
  return (
    <>
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="z-50 fixed top-0 left-0 right-0 bottom-0 inset-0 py-4 px-2 pointer-events-none"
        >
          <div className="pointer-events-auto">
            <TopSection
              customActions={
                <ConnectButton
                  onClick={() => setOpenReward(true)}
                  size="sm"
                  color="#FFC734"
                  className="!px-[0.7rem]"
                >
                  <Image
                    src={question}
                    alt="question"
                    width={20}
                    height={20}
                    className="size-4 p-0"
                  />
                </ConnectButton>
              }
            />
          </div>
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <ConnectButton
            className="w-full justify-center relative"
            color="#23B3B2"
          >
            <span>Koko Spinner</span>
            <span className="absolute -right-1 -top-1 size-6 inline-flex justify-center items-center rounded-full bg-[#18C75E] text-white shadow-[0_.12rem] shadow-black/30">
              !
            </span>
          </ConnectButton>
        </DialogTrigger>
        <DialogContent
          title={
            <p className="text-center text-2xl leading-5">
              KOKO
              <br />
              spinner
            </p>
          }
          className={`h-full flex items-end justify-center z-40 px-0 transform ${
            deviceType === "Android" && "pb-[10%]"
          } scale-[0.9] origin-bottom`}
          containerClassName="!overflow-hidden w-full mx-auto"
          hideImage
          size="xl"
          overlayProps={{
            style: {
              backgroundImage: `url(/images/blue-background.png)`,
              zIndex: 40,
            },
          }}
        >
          <Spinner
            segments={spinsList?.map((one) => ({
              value: one.kokos,
              element: (
                <div className="flex flex-col text-center font-bold text-white">
                  <span className="text-xl">
                    {one?.type == "USDT" && "$"}
                    {formatBigNumber(one?.value)}
                  </span>
                  {one?.type == "USDT" ? (
                    <Image
                      src={usdt}
                      alt="usdt"
                      width={800}
                      height={800}
                      priority
                      className="size-10 mx-auto"
                    />
                  ) : one?.type == "kokos" ? (
                    <p className="flex flex-col font-semibold">
                      <span>KOKO</span>
                      <small>POINTS</small>
                    </p>
                  ) : (
                    <p>SPIN</p>
                  )}
                </div>
              ),
            }))}
            // targetNumber={randomTarget?.kokos}
            onSpinEnd={handleBonus}
          >
            {({ isSpinning }) => (
              <>
                <ConnectButton
                  className="w-full justify-center text-xl font-extrabold"
                  // onClick={spinWheel}
                  disabled={
                    loading || isSpinning || (spins?.data?.total || 0) <= 0
                  }
                >
                  Spin ({spins?.data?.total || 0})
                </ConnectButton>
                <MoreSpins spins={spins?.data} refresh={refetch} />
              </>
            )}
          </Spinner>
        </DialogContent>
      </Dialog>
      <Dialog open={openReward} onOpenChange={setOpenReward}>
        <DialogContent
          size="md"
          className="text-golden-brown text-center"
          containerClassName="h-full flex flex-col gap-2 p-2 pt-0"
        >
          <DialogTitle className="font-bold text-xl">
            Prize Withdrawals
          </DialogTitle>
          <div className="bg-[#E3BEAA] rounded-lg p-4 text-center font-semibold flex-1 flex flex-col gap-2 items-center mb-2">
            <p>Min Withdrawal = 10 USDT</p>
            <p className="text-golden-brown/70">Check back at 10 USDT</p>
          </div>
          <Button
            onClick={() => setOpenReward(false)}
            className={`py-2 h-auto w-full rounded-md hover:bg-green/80 text-white font-bold btn-animate !shadow-[0_0.15rem] bg-green !shadow-[#2C7C4C]`}
          >
            Back to Spinner
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
