import StoreItem from "./item-card";
import { collectorPassData, catchUpBundlesData } from "@/src/app/(home)/data";

export default function StoreSection() {
  return (
    <div className="flex flex-col gap-4 p-2">
      <section className="flex flex-col gap-2 bg-gradient-to-b from-[rgba(249,227,198,0.5)] to-[rgba(249,227,198,0.5)] bg-[#E3BEAA] shadow-[0px_2px_0px_rgba(0,0,0,0.16)] rounded-2xl p-2 justify-center items-center">
        <h2 className="text-lg font-bold text-[#5F3F57] mb-1">
          Collector Pass
        </h2>
        <div className="grid grid-cols-3 gap-2 w-[100%]">
          {collectorPassData
            .filter((item) => item.id % 2 === 0)
            .map((item) => (
              <StoreItem
                key={item.id}
                id={item.id}
                title={`${item.id} ${item.title}`}
                type="store"
                price={item.price}
                purchased={item.purchased}
                icon={item.icon}
                star
              />
            ))}
        </div>
      </section>
      <section className="flex flex-col gap-2 bg-gradient-to-b from-[rgba(249,227,198,0.5)] to-[rgba(249,227,198,0.5)] bg-[#E3BEAA] shadow-[0px_2px_0px_rgba(0,0,0,0.16)] rounded-2xl p-2 justify-center items-center">
        <h2 className="text-lg font-bold text-[#5F3F57] mb-1">
          Catch Up Bundles
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {catchUpBundlesData.map((item) => (
            <StoreItem
              key={item.id}
              id={item.id}
              title={item.title}
              type="bundle"
              price={item.price}
              icon={item.icon}
              size={44}
              purchased={item.purchased}
              isPopular={item.isPopular}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
