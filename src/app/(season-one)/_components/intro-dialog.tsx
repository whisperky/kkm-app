"use client";
import { Button } from "@/src/_components/ui/button";
import { Dialog, DialogContent } from "@/src/_components/ui/dialog";
import useActions from "@/src/_hooks/useAction";
import moment from "moment";
import React, { useEffect, useState } from "react";

const steps = [
  {
    title: "Welcome to 1M1 Season 1!",
    description:
      "<p>Earn Kokos by <u>checking</u> an empty<br/>box. This gives you +1 point.</p><p>Your Kokos will always be <span style='color: #24be62'>green</span>.</p>",
  },
  {
    title: "Sabotage your Enemies...",
    description:
      "<p><span style='color: #b91c1c'>Red</span> Kokos belong to other players.</p><p>You can <u>uncheck</u> their Kokos and<br/>make them lose -1 point.</p>",
  },
  {
    title: "...and Steal their Boxes!",
    description:
      "<p>After sabotaging another player, you<br/>can check the box yourself(+1 point).</p><p>This is called a <u>Sabotage</u>!</p>",
  },
  {
    title: "Streak Bonuses!",
    description:
      "Checking or Sabotaging multiple<br/>Kokos in a row will give you <u>Streak</u><br/><u>bonuses</u> for even MORE Points!🥥",
  },
  {
    title: "Point Protection",
    description:
      "<p>Once per day you can activate Point<br/>Protection.</p><p>This will protect your next Kokos from<br/>Sabotage - forever!</p>",
  },
];

const IntroDialog = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [openIntroDialog, setOpenIntroDialog] = useState(false);
  const [continueTime, setContinueTime] = useState<[number, string][]>([]);
  const { saveAction } = useActions();

  useEffect(() => {
    const viewedIntro = localStorage.getItem("user.viewed.intro");
    if (viewedIntro !== "true") {
      setOpenIntroDialog(true);
    }
  }, []);

  const markAsViewedThenExit = () => {
    localStorage.setItem("user.viewed.intro", "true");
    setOpenIntroDialog(false);
  };

  useEffect(() => {
    if (currentStep > 1) {
      localStorage.setItem("user.viewed.intro", "true");
    }
  }, [currentStep]);

  const handleContinue = () => {
    if (currentStep >= steps.length) {
      const time = new Date().toUTCString();
      const continues = [...continueTime, [currentStep, time]];
      saveAction("play_FTUE_continue_click", {
        times: Object.fromEntries(continues),
        interval: moment(time).diff(moment(continueTime[0][1])),
        averageSpeed:
          continues.reduce((prev, curr, idx, arr) => {
            const timeDiff =
              idx === 0 ? 0 : moment(curr).diff(moment(arr[idx - 1]));
            return prev + timeDiff;
          }, 0) / (continueTime?.length || 1),
      });
      markAsViewedThenExit();
    } else {
      setCurrentStep((prevStep) => {
        setContinueTime((p) => {
          p.push([prevStep, new Date().toUTCString()]);
          return p;
        });
        return prevStep + 1;
      });
    }
  };

  return (
    <Dialog open={openIntroDialog} onOpenChange={markAsViewedThenExit}>
      <DialogContent
        size="md"
        containerClassName="w-full overflow-hidden h-full items-center justify-center "
      >
        <div className="flex-col space-y-2 grid">
          <div className="text-center font-extrabold text-2xl text-[#745061]">
            {steps[currentStep - 1].title}
          </div>
          <div className="bg-[#DDC2A7] flex-1 overflow-none  py-5 rounded-2xl space-y-2">
            <article
              className="text-center font-bold text-[#745061] space-y-2"
              dangerouslySetInnerHTML={{
                __html: steps[currentStep - 1].description,
              }}
            />
          </div>
          <Button
            onClick={handleContinue}
            className="bg-green font-bold rounded-xl text-md  text-white py-3 hover:bg-emerald-500 shadow-[0_0.15rem] shadow-[#2C7C4C] w-3/4 mx-auto !mt-3"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntroDialog;
