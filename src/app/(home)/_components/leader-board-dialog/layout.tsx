"use client";

import { cn } from "@/lib/utils";
import {
  BoxContent,
  BoxTitle,
  EmptyContent,
  LoadingContent,
  UserInviteRank,
} from "@/src/_components/shared/board-structure";
import Tr from "@/src/_components/shared/tr";
import { DialogTitle } from "@/src/_components/ui/dialog";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Layout({
  title,
  name = "Score",
  current,
  data = [],
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  title: string;
  name?: string;
  isLoading?: boolean;
  current?: { rank: number; value: number };
  data?: { id: string; username: string; value: number }[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}) {
  const { ref, inView } = useInView();

  useEffect(() => {
    // if (inView) console.log("in view");
    // console.log("in view", inView, hasNextPage);

    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage?.();
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <BoxTitle>
        <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
      </BoxTitle>
      <UserInviteRank
        rank={current?.rank ?? 0}
        score={current?.value ?? 0}
        name={name}
      />
      <BoxContent className="relative text-sm !overflow-hidden mx-2 px-0 rounded-b-xl">
        <div className="overflow-y-auto w-full max-h-[80vh] rounded-md mb-3">
          <table className="w-full [&_th]:p-1 [&_th]:px-2 [&_td]:p-1 [&_td]:px-2 rounded-md">
            <thead className="sticky top-0 text-white">
              <tr>
                <th className="text-start bg-golden-brown bg-opacity-100">#</th>
                <th className="text-start bg-golden-brown bg-opacity-80 backdrop-blur">
                  Player Name
                </th>
                <th className="text-end bg-golden-brown bg-opacity-100">
                  {name}
                </th>
              </tr>
            </thead>
            <tbody className="text-golden-brown font-bold">
              {isLoading ? (
                <tr>
                  <td colSpan={3}>
                    <LoadingContent inline className="text-golden-brown py-4" />
                  </td>
                </tr>
              ) : !data?.length ? (
                <tr>
                  <td colSpan={3}>
                    <EmptyContent inline className="text-golden-brown py-2" />
                  </td>
                </tr>
              ) : (
                <>
                  {data?.map?.((item, index) => (
                    <Tr
                      key={`${item?.id}+${index}`}
                      data={item}
                      index={index}
                    />
                  ))}
                  {hasNextPage && (
                    <tr key={`more_${data?.length}`}>
                      <td
                        colSpan={3}
                        ref={ref}
                        className={cn(
                          "text-center min-h-[1px]",
                          isFetchingNextPage && "py-1"
                        )}
                      >
                        {isFetchingNextPage && "Loading More ..."}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="absolute w-full bottom-2 rounded-b-xl overflow-hidden">
          <div className="w-full text-center h-3 bg-golden-brown"></div>
        </div>
      </BoxContent>
    </>
  );
}
