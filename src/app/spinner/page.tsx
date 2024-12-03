"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import Spinner from "@/src/app/(home)/_components/spinner";
import { spinnerProbability } from "@/src/_constants/spinner-probabilities";
import { formatBigNumber, shuffleArray } from "@/src/_utils/number";
import Image from "next/image";
import usdt from "@/_assets/usdt.png";
import question from "@/_assets/icons/question.svg";
import flashingEffect from "@/_assets/flashing-effect.png";
import { TRandom, useRandomSpin, useSpinner, useSpins } from "@/services/spins";
import { GeneralContext } from "@/src/app/general-context";
import { useAddPoints } from "@/services/koko";
import { useAddUsdt } from "@/services/usdt";
import TopSection from "@/src/app/(home)/_components/sections/top-section";
import { ConnectButton } from "@/src/_components/shared/custom-button";
import MoreSpins from "@/src/_components/shared/daily-login-spinner/more-spins";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/_components/ui/dialog";
import { Button } from "@/src/_components/ui/button";
import PageTitleBanner from "@/src/_components/shared/page-title-banner";
import useActions from "@/src/_hooks/useAction";

type TReward = "kokos" | "USDT" | "spin";

// const getRandomTarget = async () => {
//   return new Promise<TTarget | undefined>((resolve) => {
//     setTimeout(() => {
//       const probs = spinnerProbability?.toSorted((a, b) => a.prob - b.prob);
//       const totalProb = probs.reduce((sum, reward) => sum + reward.prob, 0);
//       const prob = Math.random() * totalProb;
//       let cumulativeProb = 0;
//       let selected;

//       for (const i of probs.reverse()) {
//         cumulativeProb += i.prob;
//         if (prob <= cumulativeProb) {
//           selected = i;
//           break;
//         }
//       }
//       resolve(selected);
//     }, 5000);
//   });
// };

export default function KokoSpinner() {
  // const { mutateAsync } = useMutateDailyLogin();
  const { sessionId, addMyScore, addMyUsdt } = useContext(GeneralContext);
  const [updatedScore, setUpdateScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGrayingOut, setIsGrayingout] = useState(false);
  const spinsList = useMemo(() => shuffleArray(spinnerProbability), []);
  const { saveAction } = useActions();

  const [randomTarget, setRandomTarget] = useState<TRandom>();
  const [openReward, setOpenReward] = useState(false);

  const { data: spins, refetch } = useSpins({ sessionId });
  const { mutateAsync: postSpin } = useSpinner({
    sessionId,
    onSuccess: refetch,
  });
  const { mutateAsync: getRandomTarget } = useRandomSpin({});
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
    setTimeout(() => setIsGrayingout(true), 1000);
    const reward = randomTarget?.type as TReward;

    try {
      if (reward == "USDT") setOpenReward(true);
      if (reward == "USDT") {
        setUpdateScore(randomTarget?.value + " USDT");
        await addUsdt?.(randomTarget?.value);
      }
      if (reward == "kokos") {
        setUpdateScore((randomTarget?.value ?? 0) / 1000 + "K");
        await addScore?.(randomTarget?.value);
      }
      if (reward == "spin") {
        setUpdateScore("1 SPIN");
        await addSpin?.();
      }

      await postSpin?.({});
    } catch (error) {
      // error
    } finally {
      setLoading(false);
      setIsGrayingout(false);
    }
  }, [
    addScore,
    addSpin,
    addUsdt,
    postSpin,
    randomTarget?.type,
    randomTarget?.value,
  ]);

  const getSpinNumber = useCallback(async () => {
    try {
      const spin = await getRandomTarget({ sessionId });
      setRandomTarget(spin?.data?.selected);
      return spin?.data?.selected?.kokos;
    } catch (error) {
      return -1;
    }
  }, [getRandomTarget, sessionId]);

  return (
    <div
      className="min-h-dvh flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(/images/blue-background.png)` }}
    >
      <div
        className="absolute top-10 left-8 z-[101] text-[32px] text-white font-bold opacity-0"
        style={{
          animation: isGrayingOut ? "showingRewardsEffect 2s ease" : "",
        }}
      >
        +{updatedScore}
      </div>
      <div
        className="absolute w-[100vw] h-[100vh]"
        style={{
          animation: isGrayingOut ? "grayoutEffect 2s ease" : "",
        }}
      ></div>
      <TopSection
        className="p-4"
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
      <Image
        src={flashingEffect}
        alt="flashing-effect"
        className="absolute top-[17%] opacity-0"
        style={{
          animation: loading ? "flashing 1s ease" : "",
        }}
      />
      <div className="my-auto">
        <PageTitleBanner
          // topImageClassName={topImageClassName}
          className={`relative m-0 top-6 mx-auto ${
            loading ? "push-effect" : ""
          }`}
          titleBanner={
            <p className="text-center text-2xl leading-5">
              KOKO
              <br />
              spinner
            </p>
          }
        />
        <Spinner
          className="p-2 pb-0 pt-4"
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
          getTargetNumber={getSpinNumber}
          onSpinEnd={handleBonus}
        >
          {({ handelClick, isSpinning }) => (
            <>
              <ConnectButton
                className="w-full justify-center"
                onClick={() => {
                  handelClick();
                  saveAction('spinner_Spin_click')
                }}
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
      </div>
      <Dialog open={openReward} onOpenChange={setOpenReward}>
        <DialogContent
          size="md"
          className="text-golden-brown text-center"
          containerClassName="h-full flex flex-col gap-2 p-2 pt-0"
          onClick={() => {
            saveAction('spinner_help_click');
          }}
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
    </div>
  );
}
