"use client";

import React, { useContext } from "react";
import { cn } from "@/lib/utils";
import { GeneralContext } from "@/src/app/general-context";
import { defaultUsername } from "@/src/_utils/defaults";

export default function Tr({
  data,
  index,
}: {
  data: {
    id: string;
    username: string;
    value: number | string;
  };
  index: number;
}) {
  const { sessionId } = useContext(GeneralContext);

  return (
    <tr
      className={cn(
        sessionId == data?.id &&
          "font-bold outline-2 outline -outline-offset-2 outline-golden-brown",
        index % 2 == 0 && "bg-golden-brown bg-opacity-[0.07]"
      )}
    >
      <td className="bg-golden-brown bg-opacity-20">{index + 1}</td>
      <td>
        {/* <Link href={`/profile/${data?.id}`}> */}
        {data?.username || defaultUsername}
        {/* </Link> */}
      </td>
      <td className="text-end bg-golden-brown bg-opacity-20">
        {isNaN(Number(data?.value))
          ? data?.value
          : Intl.NumberFormat().format(Number(data?.value))}
      </td>
    </tr>
  );
}
