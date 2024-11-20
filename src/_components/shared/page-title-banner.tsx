"use client";

import banner from "@/_assets/header-board.png";
import { cn } from "@/lib/utils";
import useGetPageTitle from "@/src/_hooks/use-get-page-title";
import Image from "next/image";

const PageTitleBanner = ({
  titleBanner,
  topImageClassName,
  className,
}: {
  titleBanner?: JSX.Element;
  topImageClassName?: string;
  className?: string;
}) => {
  const [title] = useGetPageTitle();

  return (
    <div
      role="banner"
      data-testid="page-title-banner"
      className={cn(
        "absolute z-10 -top-14 right-0 left-0 w-fit mx-auto mt-10 font-bumper-sticker flex items-center justify-center",
        className
      )}
    >
      <Image
        src={banner}
        priority
        alt="banner"
        className={cn(
          "min-w-36 h-16 scale-x-[1.5] absolute -z-0 pointer-events-none",
          topImageClassName
        )}
      />
      <div className="z-20 mb-2 text-center text-[#371D32] text-3xl stroke-[#BD5B26]">
        {titleBanner || title}
      </div>
    </div>
  );
};

export default PageTitleBanner;
