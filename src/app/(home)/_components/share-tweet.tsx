"use client";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  BonusContent,
  useCheckUserBonus,
  useTwitterLogin2,
} from "@/services/bonus";
import toast from "react-hot-toast";
import { GeneralContext } from "../../general-context";
import { Dialog, DialogContent } from "@/src/_components/ui/dialog";
import { Input } from "@/src/_components/ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SocketContext } from "../../1v1/(game)/_context/socket";

export default function ShareTweetTask({
  task,
  index,
  listLabel = "index",
}: {
  task: BonusContent;
  index: number;
  listLabel?: "index" | "bonus";
}) {
  const [taskStatus, setTaskStatus] = useState<
    "CLAIMED" | "UNCLAIMED" | "PENDING" | "FETCHING"
  >("FETCHING");

  const { sessionId: userId, user, webApp } = useContext(GeneralContext);
  const { socket, decompressAndDeserialize } = useContext(SocketContext);
  const [checkStatus, setCheckStatus] = useState<"one" | "two" | "three">(
    "one"
  );
  const [openTweeterLogin, setOpenTweeterLogin] = useState(false);
  const [twitterUsername, setTweeterUsername] = useState("");
  const bonus = useMemo(() => task.bonusName, [task.bonusName]);

  const {
    data,
    refetch: refreshCheckUserBonus,
    isError: isCheckUserBonusError,
    status: checkUserStatus,
  } = useCheckUserBonus({
    userId: userId,
    bonusName: bonus,
  });

  const { mutateAsync: login } = useTwitterLogin2();

  useEffect(() => {
    if (checkUserStatus == "pending") {
      setTaskStatus("FETCHING");
    } else if (data?.data?.status?.toLowerCase?.() === "claimed") {
      setTaskStatus("CLAIMED");
    } else if (data?.data?.status === "pending") {
      setTaskStatus("PENDING");
    } else if (isCheckUserBonusError) {
      setTaskStatus("UNCLAIMED");
    }
  }, [checkUserStatus, data?.data?.status, isCheckUserBonusError]);

  useEffect(() => {
    if (checkStatus == "two" || checkStatus == "three") {
      localStorage.setItem("twiiter.current.step", "true");
      return;
    } else {
      localStorage.removeItem("twiiter.current.step");
    }
    const lastCheck = localStorage.getItem("twiiter.current.step");
    if (lastCheck) setCheckStatus("two");
  }, [checkStatus]);

  useEffect(() => {
    socket?.on("claim-tweet", (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize?.(compressedData);
      if (data?.bonusName != bonus || data?.sessionId != userId) return;

      if (data?.status == "error") {
        toast.error(data?.message);
        setCheckStatus("one");
      } else if (data?.status == "claimed") {
        refreshCheckUserBonus();
        setTaskStatus("CLAIMED");
        toast.success("Tweeted!");
      }
    });
  }, [bonus, decompressAndDeserialize, refreshCheckUserBonus, socket, userId]);

  const handleShareTweet = useCallback(async () => {
    try {
      if (checkStatus == "two" && !twitterUsername) {
        toast.error("Please Connect Your Twitter Account");
        setOpenTweeterLogin(true);
        setTweeterUsername(user?.twitterUsername || "");
        return;
      }

      if (checkStatus == "one") {
        const link = `https://x.com/compose/post?text=${task.details?.tweet}`;
        const handle = window.open(link, "_blank", "popup=yes");

        setTimeout(() => {
          if (!handle) webApp?.openLink?.(link);
        }, 1000);
        setCheckStatus("two");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    checkStatus,
    twitterUsername,
    user?.twitterUsername,
    webApp,
    task.details?.tweet,
  ]);

  const tweeterLogin = useCallback(async () => {
    try {
      await login?.({
        twitterUsername,
        sessionId: userId,
        bonusName: bonus,
      });
      setOpenTweeterLogin(false);
      toast.success("Checking, just make sure you have tweeted!");
      setCheckStatus("three");
    } catch (error: any) {
      console.log(error);
      toast?.error(error?.response?.data?.message || "something went wrong");
    }
  }, [bonus, login, twitterUsername, userId]);

  const ListLabel = () => (
    <p
      style={{
        textOrientation: "mixed",
        writingMode: listLabel == "bonus" ? "vertical-rl" : "initial",
        transform: listLabel == "bonus" ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      {listLabel == "index" ? `${index + 1}` : "BONUS!"}
    </p>
  );

  const TaskButton = () => (
    <button
      disabled={checkStatus === "three"}
      className="font-semibold text-white text-xs justify-center flex items-center text-center min-w-fit px-2 py-1 rounded-full shadow-[0_0.15rem_0] bg-[#6BC064] shadow-[#5A9065]"
      onClick={() => {
        handleShareTweet();
      }}
    >
      {checkStatus == "one"
        ? "Share"
        : checkStatus == "two"
        ? "Verify"
        : "Verifying"}
    </button>
  );

  return (
    <>
      <Dialog open={openTweeterLogin} onOpenChange={setOpenTweeterLogin}>
        <DialogContent
          size="md"
          containerClassName="px-2 flex flex-col justify-center gap-8 h-full"
        >
          <div>
            <DialogTitle className="font-extrabold text-[#5F3F57] text-xl text-center">
              Enter your Twitter username
            </DialogTitle>
            <p className="text-center text-[#7A5B69] mt-4">
              Get bonus points for sharing a tweet about Kokomo Games
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              tweeterLogin();
            }}
            className="flex flex-col gap-4 mb-8"
          >
            <Input
              type="text"
              defaultValue={user?.twitterUsername || ""}
              onChange={(e) => setTweeterUsername(e.target.value)}
              placeholder="Enter your Twitter username"
              required
            />
            <button
              type="submit"
              className="font-semibold text-white justify-center flex items-center text-center min-w-fit px-2 py-1 rounded-full shadow-[0_0.15rem_0] bg-[#6BC064] shadow-[#5A9065]"
            >
              Continue
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <div key={index} className="flex justify-between w-full [&>div]:w-full">
        <div
          style={{
            borderImageSource:
              "linear-gradient(142.37deg, rgba(250, 238, 210, 0.5) 19.14%, rgba(250, 238, 210, 0) 87.78%), linear-gradient(180deg, rgba(95, 63, 87, 0) -13.54%, rgba(95, 63, 87, 0.3) 100%)",
          }}
          className="bg-[#FAEED280] rounded-2xl grid grid-cols-[auto_1fr] border-0 border-b border-solid border-black/50 shadow-[0_0.15rem_0.1rem_#0002,_inset_0_-1px_0_1px_#0003,_inset_0_1px_0_1px_#fff6]"
        >
          <div
            className={cn(
              "h-full justify-center p-2 text-[#5F3F57] bg-[#D29779] rounded-l-2xl flex items-center flex-col font-bold text-sm border-0 border-r-2 border-solid border-black/10",
              taskStatus == "CLAIMED" && "bg-[#449345] text-white",
              listLabel == "bonus" ? "justify-center" : "justify-start"
            )}
          >
            <ListLabel />
          </div>
          <div className="flex flex-col justify-between items-center px-2 py-1 pb-3 gap-1 text-[#745061] border-0 border-l-2 border-solid border-white/50">
            <h1 className="font-bold text-[12px] text-[#5F3F57] text-start w-full leading-5">
              {task.description.endsWith(".")
              ? task.description.slice(0, -1)
              : task.description}
            </h1>

            <div className="flex px-2 py-1 w-full items-center justify-between shadow-[0_-0.1rem_0] bg-black/10 shadow-black/30 rounded-full">
              <div className="text-xs text-start flex items-center font-semibold px-1 py-1">
                +{task.prize.toLocaleString()} Bonus 🥥
                {task.bonusName === "invite_3_friends" && " & 3 Spins"}
              </div>
              {taskStatus == "CLAIMED" ? (
                <div className="flex items-center justify-center drop-shadow-[0_0.15rem_0_#0004]">
                  <CheckIcon strokeWidth={6} color="#24BE62" size={22} />
                </div>
              ) : (
                <TaskButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
