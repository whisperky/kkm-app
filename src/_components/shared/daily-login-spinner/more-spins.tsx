"use client";

import React, { useCallback, useContext } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { ConnectButton } from "../custom-button";
import { BoxMain } from "../board-structure";
import { Button } from "../../ui/button";
import { ISpin, useClaimDaily, useDailySpins } from "@/services/spins";
import { GeneralContext } from "@/src/app/general-context";
import { useBuySpins } from "@/services/koko";
import toast from "react-hot-toast";
import ShareButtons from "../shareButtons";
import useActions from "@/src/_hooks/useAction";

export default function MoreSpins({
  spins,
  refresh,
}: {
  spins?: ISpin;
  refresh?: (_: any) => Promise<any>;
}) {
  const { sessionId, addMyScore, myScore } = useContext(GeneralContext);
  const { data: dailySpins } = useDailySpins({ sessionId });
  const { mutateAsync: claim } = useClaimDaily({
    sessionId,
    onSuccess: refresh,
  });
  const { saveAction } = useActions();
  const { mutateAsync: buySpins } = useBuySpins({
    onSuccess: () => {
      addMyScore?.(-25000);
      toast?.success("Spin successfully purchased!");
      refresh?.({});
    },
  });

  const handleClaim = useCallback(async () => {
    try {
      saveAction("spinner_dailyFreeSpin_claim");
      await claim();
    } catch (e: any) {
      console.error(e);
      toast?.error("Come back tomorrow for another free Spin!");
    }
  }, [claim, saveAction]);

  const handleBuySpins = useCallback(async () => {
    try {
      saveAction("spinner_buySpin_click");
      await buySpins({ amount: 25000, sessionId });
    } catch (e: any) {
      toast?.error(e?.message || "Buy Spins Failed");
    }
  }, [buySpins, saveAction, sessionId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ConnectButton
          className="w-full justify-center text-xl font-extrabold"
          color="#A1C41F"
          onClick={() => {
            saveAction("spinner_getMoreSpins_click");
          }}
        >
          Get More Spins
        </ConnectButton>
      </DialogTrigger>
      <DialogContent title="More Spins" containerClassName="h-full" className="w-dvw">
        <BoxMain className="h-full text-golden-brown text-base font-semibold space-y-3 p-2 pt-6">
          <div>
            <p className="text-sm text-golden-brown/70">
              Your Total Spins: {spins?.total || 0}
            </p>
            <p>Get more Spins by: </p>
          </div>
          <div>
            <p className="bg-[#E3BEAA] p-3 rounded-t-xl border-0 border-b-2 border-solid border-black/15">
              Claim Your Daily Free Spin
            </p>
            <div className="bg-[#E3BEAA] p-3 rounded-b-xl border-0 border-t-2 border-solid border-white/60">
              <Button
                onClick={handleClaim}
                disabled={!dailySpins || (dailySpins?.data?.length || 0) > 0}
                className={`py-2 h-auto w-full rounded-md hover:bg-green/80 text-white font-bold btn-animate !shadow-[0_0.15rem] bg-green !shadow-[#2C7C4C]`}
              >
                Claim for Free
              </Button>
            </div>
          </div>
          <div>
            <p className="bg-[#E3BEAA] p-3 rounded-t-xl border-0 border-b-2 border-solid border-black/15">
              Invite a Friend and get 3 Spins and +10,000 Bonus 🥥
            </p>
            <div className="bg-[#E3BEAA] flex flex-wrap gap-3 p-3 rounded-b-xl border-0 border-t-2 border-solid border-white/60">
              <ShareButtons
                shareName="spinner_inviteTG_click"
                copyName="spinner_copyLink_click"
              />
            </div>
          </div>
          <div>
            <p className="bg-[#E3BEAA] p-3 rounded-t-xl border-0 border-b-2 border-solid border-black/15">
              Buy a Spin for 25,000 🥥
            </p>
            <div className="bg-[#E3BEAA] p-3 rounded-b-xl border-0 border-t-2 border-solid border-white/60">
              <Button
                onClick={() => (myScore || 0) >= 25000 && handleBuySpins?.()}
                disabled={(myScore || 0) < 25000}
                className={`py-2 h-auto w-full rounded-md hover:bg-green/80 text-white font-bold btn-animate !shadow-[0_0.15rem] bg-green !shadow-[#2C7C4C]`}
              >
                Buy Spin
              </Button>
            </div>
          </div>
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
