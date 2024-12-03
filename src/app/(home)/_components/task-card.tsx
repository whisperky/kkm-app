"use client";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { IconSpinner } from "@/src/_components/icons";
import { BonusContent, useCheckUserBonus } from "@/services/bonus";
import toast from "react-hot-toast";
import { baseInstance } from "@/services/axios";
import { useMutation } from "@tanstack/react-query";
import { GeneralContext } from "../../general-context";
import { ICheckCommunity } from "@/services/bonus";
import useToastManager from "@/src/_hooks/useToastManager";
import ShareButtons from "@/src/_components/shared/shareButtons";

export default function TaskCard({
  task,
  index,
  listLabel = "index",
  claimOGTab,
  cardData,
  updateCardData,
}: {
  task: BonusContent;
  index: number;
  listLabel?: "index" | "bonus";
  claimOGTab?: boolean;
  cardData?: BonusContent[];
  updateCardData?: (_taskName: string, _bonusIdToClaim: string) => void;
}) {
  const [taskStatus, setTaskStatus] = useState<
    "CLAIMED" | "UNCLAIMED" | "PENDING" | "FETCHING"
  >("FETCHING");

  const { sessionId: userId, addMyScore } = useContext(GeneralContext);
  const referrals = useContext(GeneralContext)?.user?.referrals ?? [];
  const { toast: manageToast } = useToastManager(2);

  const {
    data,
    refetch: refreshCheckUserBonus,
    isError: isCheckUserBonusError,
  } = useCheckUserBonus({
    userId: userId,
    bonusName: task.bonusName,
  });

  const {
    mutate: addPoints,
    isSuccess,
    isError,
    isPending,
  } = useMutation({
    onSuccess: (data) => {
      toast.success(task.details?.toast?.success ?? "Bonus added successfully");
      setTaskStatus("CLAIMED");
      refreshCheckUserBonus();
      addMyScore?.(data?.amount || 0);
    },
    onError: (error: any) => {
      toast.error(error?.response.data.message);
    },
    mutationFn: () =>
      baseInstance
        .post("/bonus-service/bonus/add-bonus-points", {
          sessionId: userId,
          bonusName: task.bonusName,
        })
        .then((res) => res.data),
  });

  const delayedBonus = async (): Promise<boolean> => {
    if (typeof window !== "undefined" && task?.details?.link)
      window.open(task?.details?.link, "_blank", "noopener,noreferrer");
    return new Promise(() => {
      setTimeout(() => {
        if (userId && taskStatus !== "CLAIMED") addPoints();
      }, 10000);
    });
  };
  const checkIfUserInCommunity = async () => {
    const data = await baseInstance
      .get<ICheckCommunity>(
        `/bonus-service/bonus/telegram/check-is-user-in-community`,
        { params: { tgUserId: userId } }
      )
      .then((res) => res.data);
    return data;
  };

  const handleJoinCommunity = async () => {
    const link =
      process.env.NEXT_PUBLIC_COMMUNITY_URL || "https://t.me/kokomo_games";
    try {
      setTaskStatus("FETCHING");
      const res = await checkIfUserInCommunity();

      if (res?.inChannel) {
        refreshCheckUserBonus();
        setTaskStatus("CLAIMED");
        toast.success(
          task.details?.toast?.success ?? "Join telegram community successfully"
        );
      } else {
        setTaskStatus("UNCLAIMED");
        toast.error(
          task.details?.toast?.error ??
            "You're not part of the Telegram community yet."
        );
        window.open(link, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.log(error);
      setTaskStatus("UNCLAIMED");
      toast.error(
        task.details?.toast?.error ??
          "You're not part of the Telegram community yet."
      );
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };
  const handleInviteAfriend = () => {
    if (referrals?.length >= 1) {
      setTaskStatus("FETCHING");
      addPoints();
    } else
      manageToast.error(
        `Current invites: ${referrals?.length}. Invite successful when friend joins & checks 1 Koko!`
      );
  };

  useEffect(() => {
    if (data?.data?.status?.toLowerCase?.() === "claimed") {
      setTaskStatus("CLAIMED");
      cardData?.forEach((item) => {
        if (item.bonusId === task.bonusId) {
          item.claimed = true;
        }
      });
      if (updateCardData)
        updateCardData(
          `${listLabel === "index" ? "kokoTask" : "partnerTask"}`,
          task.bonusId
        );
    }
    if (data?.data?.status?.toLowerCase?.() === "pending")
      setTaskStatus("PENDING");
    if (isCheckUserBonusError) setTaskStatus("FETCHING");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckUserBonusError, data?.data?.status]);

  useEffect(() => {
    if (isSuccess) toast.success("Bonus added successfully");
    if (isError) toast.error("Failed to add bonus");
    if (isPending) toast.loading("Adding bonus...");
  }, [isSuccess, isError, isPending]);

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
      disabled={taskStatus === "FETCHING"}
      className="font-semibold -translate-y-[1px] text-white text-xs justify-center flex items-center text-center min-w-fit px-2 py-1 rounded-full shadow-[0_0.15rem_0] bg-[#6BC064] shadow-[#5A9065]"
      onClick={() => {
        setTaskStatus("FETCHING");
        switch (task.bonusName) {
          case "telegram_community":
            handleJoinCommunity();
            break;
          case "invite_3_friends":
            handleInviteAfriend();
            break;
          default:
            delayedBonus();
            break;
        }
      }}
    >
      {taskStatus == "FETCHING" ? <IconSpinner /> : "Verify"}
    </button>
  );

  return (
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
          {task.description.includes("Invite a friend") && claimOGTab && (
            <div className="!text-sm w-[95%] flex [&>*]:!flex-1 [&>*]:!py-0.5 flex-wrap pt-3 gap-3 border-0 border-t border-solid border-white/60">
              <ShareButtons
                shareName="freeOGNFT_inviteTG_click"
                copyName="freeOGNFT_copyLink_click"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
