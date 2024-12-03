"use client";

import { useBuyStore, useStoreItems } from "@/services/store";
import StoreItem from "./item-card";
import { useCallback, useContext, useMemo, useState, useEffect } from "react";
import { GeneralContext } from "@/src/app/general-context";
import toast from "react-hot-toast";
import moment from "moment";

export default function StoreSection() {
  const [WebApp, setWebApp] = useState<any>(null);
  const { sessionId, refreshMyScore } = useContext(GeneralContext);
  const { data, refetch } = useStoreItems(sessionId);
  const { mutateAsync } = useBuyStore();

  useEffect(() => {
    const loadWebApp = async () => {
      if (typeof window !== "undefined") {
        try {
          const { default: TwaWebApp } = await import("@twa-dev/sdk");
          setWebApp(TwaWebApp);
        } catch (error) {
          console.error("Failed to load WebApp", error);
        }
      }
    };

    loadWebApp();
  }, []);

  const itemGroups = useMemo(
    () =>
      Object.entries(
        Object.groupBy(data?.data?.data || [], (one) => one?.type?.name)
      ),
    [data?.data?.data]
  );

  useEffect(() => {
    console.log("data", data);
    console.log("itemGroups", itemGroups);
  }, [data, itemGroups]);

  const handleBuy = useCallback(
    async ({
      title,
      description,
      price,
      item_id,
    }: {
      title: string;
      description: string;
      price: number;
      item_id: string;
    }) => {
      try {
        const { data: invoiceLink } = await mutateAsync({
          title,
          description,
          price,
          item_id,
        });

        if (WebApp) {
          WebApp.openInvoice(invoiceLink, async (status: string) => {
            if (status === "paid") {
              await refetch();
              setTimeout(async () => {
                await refreshMyScore?.();
              }, 5000);
              toast.success("Payment successful");
            }
          });
        } else {
          toast.error("WebApp not loaded");
        }
      } catch (error: any) {
        toast.error("Something went wrong", error?.message);
      }
    },
    [mutateAsync, refetch, WebApp]
  );

  // Rest of the component remains the same...
  return (
    <div className="flex flex-col gap-4 p-2">
      {itemGroups.map(
        ([type, items]) =>
          items?.length && (
            <section
              key={type}
              className="flex flex-col gap-2 p-2 justify-center items-center bg-gradient-to-b from-[#f9e3c680] to-[#f9e3c680] bg-light-tan shadow-[0px_2px_0px_#00000016] rounded-2xl"
            >
              <h2 className="text-lg font-bold text-golden-brown mb-1">
                {type}
              </h2>
              <div className="grid grid-cols-3 gap-2 w-full">
                {items.map((item) => (
                  <StoreItem
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    type={items?.[0]?.type?.key}
                    price={item.price}
                    purchased={!!item?.user_items?.[0]}
                    icon={item?.details?.icon || "/images/store/kokomo-1.png"}
                    star={item?.details?.star}
                    isPopular={item?.details?.isPopular}
                    claimed={!!item?.user_items?.[0]?.activated}
                    rewards={item?.details?.rewards}
                    current_day={
                      item?.user_items?.at(-1)?.purchase_details?.current_day
                    }
                    last_update={
                      item?.user_items?.at(-1)?.purchase_details?.last_update ||
                      moment().add(-25, "hours").toDate()
                    }
                    itemId={item?.user_items?.at(-1)?.id}
                    onClick={(action) => {
                      console.log("action", action);

                      if (action === "buy") {
                        handleBuy({
                          title: item.name,
                          description: item.description,
                          price: Number(item?.price),
                          item_id: item.id,
                        });
                      } else {
                        refetch?.();
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
