"use client";

import React, { useContext, useMemo } from "react";
import Layout from "./layout";
import { useTopScores } from "@/services/reports";
import { GeneralContext } from "../../../general-context";

export default function TopScores() {
  const { sessionId } = useContext(GeneralContext);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTopScores(sessionId);

  const flattenedData = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data?.pages]
  );

  return (
    <>
      <Layout
        name="Score"
        title="Top Scorers 🏆"
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
