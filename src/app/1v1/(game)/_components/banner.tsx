import React from "react";
import { cn } from "@/lib/utils";
import FloatingPanel from "@/_assets/floating-panel-1v1.png";
import Image from "next/image";
import { defaultUsername } from "@/src/_utils/defaults";

export function BannerBox({
  children,
  remains,
}: {
  children: React.ReactNode;
  remains: number;
}) {
  return (
    <div className="flex items-center relative h-[150px] mt-3">
      <Image
        priority
        src={FloatingPanel}
        width={600}
        alt="floating-panel"
        className="w-full absolute top-0 h-[150px]"
      />
      <div className="grid grid-cols-2 w-full h-full pb-[7%] pt-[9.5%] gap-x-2 items-center  z-10">
        {children}
      </div>
      <StatusBar remains={remains} />
    </div>
  );
}

const StatusBar = ({ remains = 101 }: { remains: number }) => {
  return (
    <div className="flex items-center justify-center absolute top-0  w-full pt-2">
      <p className="text-base font-semibold text-center text-[#745061]">
        REMAINING: {remains} 🥥
      </p>
    </div>
  );
};

export function OpponentStatusBar({
  className,
  current,
  isMe,
  username,
  kokos,
  ...props
}: {
  className?: string;
  current: boolean;
  isMe?: boolean;
  kokos: number;
  username?: string;
}) {
  return (
    <div
      {...props}
      className={cn(
        "w-full flex flex-col justify-between h-full px-8",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col w-full text-[#492E43]",
          current ? "items-start" : "items-end text-end"
        )}
      >
        <h6 className="text-xs font-bold leading-tight">
          {isMe ? "YOU" : "OPPONENT"}
        </h6>
        <h4
          className={cn(
            "text-base font-bold leading-none max-w-full line-clamp-2 overflow-hidden custom-ellipsis",
            !current && "text-end"
          )}
        >
          {username || `${isMe ? "Me" : defaultUsername}`}
        </h4>
      </div>
      <div className={cn("flex w-full", !current && "justify-end")}>
        <span className="text-xl font-bold text-white">{kokos} 🥥</span>
      </div>
    </div>
  );
}
