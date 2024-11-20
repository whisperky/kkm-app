import StoreItem from "./item-card";
import { collectorPassData, catchUpBundlesData } from "@/src/app/(home)/data";

export default function StoreSection() {
  return (
    <div className="flex flex-col gap-4 p-2">
      <section className="flex flex-col gap-2 p-2 justify-center items-center bg-gradient-to-b from-[#f9e3c680] to-[#f9e3c680] bg-light-tan shadow-[0px_2px_0px_#00000016] rounded-2xl">
        <h2 className="text-lg font-bold text-golden-brown mb-1">
          Collector Pass
        </h2>
        <div className="grid grid-cols-3 gap-2 w-full">
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
      <section className="flex flex-col gap-2 p-2 justify-center items-center bg-gradient-to-b from-[#f9e3c680] to-[#f9e3c680] bg-light-tan shadow-[0px_2px_0px_#00000016] rounded-2xl">
        <h2 className="text-lg font-bold text-golden-brown mb-1">
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
