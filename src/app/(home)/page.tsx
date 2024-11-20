"use client";

import dynamic from "next/dynamic";
import TopSection from "./_components/sections/top-section";
import { Skeleton } from "@/src/_components/ui/skeleton";
import { StoreButton } from "./_components/store-dialog/store-button";

export default function Home() {
  const NFTSection = dynamic(
    () => import("./_components/sections/nft-section"),
    { ssr: false }
  );
  const ActionsSection = dynamic(
    () => import("./_components/sections/actions-section"),
    { ssr: false, loading: () => <ActionsSectionSkeleton /> }
  );
  const AirDropDialog = dynamic(() => import("./_components/airdrop-dialog"), {
    ssr: false,
  });

  return (
    <div className="relative h-full gap-4 pt-4 px-2 flex flex-col max-h-[calc(100vh_-_1rem)]">
      <TopSection />
      <div className="-mx-4">
        <NFTSection />
      </div>
      <StoreButton />
      <ActionsSection />
      <AirDropDialog />
    </div>
  );
}

const ActionsSectionSkeleton = () => {
  return (
    <div className="relative animate-pulse rounded-3xl p-4 space-y-2 py-3 mt-auto bg-[#d7694a]">
      <Skeleton className="h-10 w-full bg-[#8d4531] rounded-[1rem]" />
      <Skeleton className="h-10 w-full bg-[#8d4531] rounded-[1rem]" />
      <Skeleton className="h-10 w-full bg-[#8d4531] rounded-[1rem]" />
    </div>
  );
};
