"use client";

import React, { useContext, useMemo } from "react";
import Layout from "./layout";
import { GeneralContext } from "../../../general-context";
import { useTopInvites } from "@/services/reports";

export default function TopInvites() {
  const { sessionId } = useContext(GeneralContext);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTopInvites(sessionId);

  const flattenedData = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data?.pages]
  );

  return (
    <>
      <Layout
        name="📬"
        title="Top Inviters 📬"
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
