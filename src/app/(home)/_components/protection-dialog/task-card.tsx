"use client";

import Image from "next/image";
import shieldIcon from "@/_assets/icons/koko-shield.png";
import shieldIconWithStar from "@/_assets/icons/koko-shield-star.png";
import bottomStars from "@/_assets/icons/bottom-stars.png";
import starIcon from "@/_assets/icons/star.png";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useContext, useMemo } from "react";
import toast from "react-hot-toast";
import { useClaimProtection } from "@/services/koko";
import { GeneralContext } from "@/src/app/general-context";
import useActions from "@/src/_hooks/useAction";

type TProps = {
  className?: string;
  task: {
    title: string;
    day: number;
    collectable: boolean;
    received: boolean;
  };
  refresh?: () => void;
};

const TitleWithImage = ({
  day,
  title,
  collectable,
}: {
  day: number;
  title: string;
  collectable: boolean;
}) => {
  if (day % 7 === 0) {
    return (
      <div className="flex text-center w-[160px] ml-10 leading-[14px] items-center -mt-7 -mb-4">
        <Image
          src={shieldIconWithStar}
          alt="Point Protection"
          width={75}
          height={83}
          className="size-20 -translate-y-2"
        />
        {title}
      </div>
    );
  }

  return (
    <p className={`text-center ${!collectable && "text-[#7D5A61]"}`}>{title}</p>
  );
};

const CollectButton = ({
  collectable,
  received,
  day,
  handleCollect,
}: {
  collectable: boolean;
  received: boolean;
  day: number;
  handleCollect: () => void;
}) => (
  <button
    disabled={!collectable}
    className={cn(
      "w-full flex justify-center p-0.5 text-white text-sm rounded-md",
      !collectable ? "bg-[#A17A76]" : "bg-[#00ADE2]"
    )}
    onClick={handleCollect}
    style={{
      borderBottom: collectable ? "1px solid #000000" : "",
    }}
  >
    {received ? (
      <CheckIcon className="size-5 font-bold text-[#DDB49F]" strokeWidth={4} />
    ) : collectable ? (
      "Collect!"
    ) : (
      <span className="text-[#D8CBCC]">{`Day ${day}`}</span>
    )}
  </button>
);

export default function ProtectionCard({ task, className, refresh }: TProps) {
  const { title, collectable, received, day } = useMemo(() => task, [task]);
  const { sessionId } = useContext(GeneralContext);
  const { mutateAsync: claim } = useClaimProtection();
  const { saveAction } = useActions();

  const handleCollect = useCallback(async () => {
    try {
      await claim?.({ sessionId });
      refresh?.();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }, [claim, refresh, sessionId]);

  return (
    <div
      className={cn(
        `relative p-1 ${day % 7 === 0 ? "pt-2" : "pt-7"} pb-0 text-sm`,
        className
      )}
    >
      <p
        className={cn(
          received
            ? "bg-[#E0BEA4] border-[#A17A76]"
            : "bg-[#405992] border-[#0DA8D6]",
          "border-[3px] border-b-0 border-solid rounded-t-xl h-7 flex items-center justify-center",
          collectable && "border-white"
        )}
      >
        {day % 7 !== 0 && (
          <Image
            src={shieldIcon}
            alt="Point Protection"
            width={20}
            height={20}
            className="size-14 -translate-y-2"
          />
        )}
      </p>
      <div
        className={cn(
          "bg-[#E0BEA4] p-1 pt-2 border-[3px] border-t-0 border-solid border-[#A17A76] border-b-[#755261]/80 rounded-b-xl",
          collectable && "border-white"
        )}
      >
        {day % 7 === 0 ? (
          <Image
            src={bottomStars}
            alt="Star"
            className="absolute w-full h-11 top-[62%] -left-[1.5%]"
          />
        ) : (
          day % 3 === 1 && (
            <Image
              src={starIcon}
              alt="Star"
              width={19}
              height={19}
              className="absolute top-[52%] -left-[5%]"
            />
          )
        )}
        <TitleWithImage day={day} title={title} collectable={collectable} />
        <CollectButton
          collectable={collectable}
          received={received}
          day={day}
          handleCollect={() => {
            handleCollect();
            saveAction("dailyBonus_pointProtection_claim", { day });
          }}
        />
      </div>
    </div>
  );
}
