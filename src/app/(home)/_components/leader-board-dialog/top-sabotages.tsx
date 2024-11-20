"use client";

import React, { useContext, useMemo } from "react";
import Layout from "./layout";
import { GeneralContext } from "../../../general-context";
import { useTopSabotage } from "@/services/reports";

export default function TopSabotages() {
  const { sessionId } = useContext(GeneralContext);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTopSabotage(sessionId);

  const flattenedData = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data?.pages]
  );

  return (
    <>
      <Layout
        name="🥷"
        title="Top Sabotagers 🥷"
        current={data?.pages[0]?.current}
        data={flattenedData.map((item) => ({
          id: item?.user?.id,
          username: item?.user?.username,
          value: item?.value,
        }))}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
