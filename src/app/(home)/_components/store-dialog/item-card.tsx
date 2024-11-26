import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/src/_components/ui/button";

import ClaimDialog from "../claim-dialog";
import starIcon from "@/_assets/icons/star-y.png";
import starIcon2 from "@/_assets/icons/star-w.png";
import starIcon3 from "@/_assets/icons/star-p.png";
import claimIcon from "@/_assets/icons/claim.png";
import lockIcon from "@/_assets/icons/lock.png";
import unlockIcon from "@/_assets/icons/unlock.png";
import checkIcon from "@/_assets/icons/check.png";

interface StoreItemProps {
  id: number;
  title: string;
  type: "store" | "claim" | "bundle";
  price: number | string;
  icon: StaticImageData;
  isPopular?: boolean;
  size?: number;
  star?: boolean;
  purchased?: boolean;
  claimed?: boolean;
  lock?: boolean;
  unlockable?: boolean;
  onClick?: () => void;
}

const StarDecorations = () => (
  <>
    <Image
      src={starIcon}
      alt="Star"
      width={20}
      height={20}
      className="absolute z-10 top-[-5%] left-[3%]"
    />
    <Image
      src={starIcon2}
      alt="Star"
      width={8}
      height={8}
      className="absolute z-10 top-[10%] left-[2%]"
    />
    <Image
      src={starIcon2}
      alt="Star"
      width={6}
      height={6}
      className="absolute z-10 top-[1%] -right-[1%] -scale-x-100"
    />
  </>
);

const ItemTitle = ({
  type,
  id,
  title,
}: Pick<StoreItemProps, "type" | "id" | "title">) => (
  <div className="flex-grow text-xs py-1.5 px-1 font-medium bg-light-tan text-golden-brown text-center z-2 border-t-[1px] border-[#FCEAD080]">
    {type === "bundle" ? (
      title === "Kokomo Mega Bundle" ? (
        title
      ) : (
        <p>
          {title.split("Kokos ")[0]}Kokos <br />
          {title.split("Kokos ")[1]}
        </p>
      )
    ) : type === "claim" ? (
      <p>
        Kokomo <br /> Collectible #{id}
      </p>
    ) : (
      <p>
        {id} Kokomo <br /> Collectibles
      </p>
    )}
  </div>
);

const UnlockableOverlay = ({
  lock,
  id,
}: Pick<StoreItemProps, "lock" | "id">) => (
  <div className="absolute top-0 right-0 left-0 bottom-0 bg-[#000000E5] rounded-lg z-30">
    <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
      {lock ? (
        <>
          <Image src={lockIcon} alt="Lock" width={32} height={32} />
          <p className="text-pink text-[10px] text-center font-bold px-2">
            Buy next Collector Pass to unlock
          </p>
        </>
      ) : (
        <>
          <Image src={unlockIcon} alt="Unlock" width={28} height={28} />
          <p className="text-purple text-[10px] text-center font-bold px-2">
            Come back to Collect!
          </p>
          <p className="text-purple text-[10px] text-center font-medium px-2">
            Day {id}
          </p>
        </>
      )}
    </div>
  </div>
);

export default function StoreItem({
  id,
  title,
  type,
  price,
  icon,
  isPopular,
  star,
  purchased = false,
  claimed = false,
  lock = false,
  unlockable = false,
  size = 60,
  onClick,
}: StoreItemProps) {
  const renderButtonContent = () => {
    if (type === "bundle") {
      return (
        <ClaimDialog type={id}>
          <div className="flex w-full items-center justify-center rounded-lg drop-shadow-[0_1px_0px_#00000029]">
            {`$${price}`}
          </div>
        </ClaimDialog>
      );
    }

    if (type === "store") {
      if (purchased) {
        return (
          <ClaimDialog type="store">
            <div className="flex w-full items-center justify-center drop-shadow-[0_1px_0px_#00000029]">
              <Image src={claimIcon} alt="Claim" width={13} height={13} />
              Claim
            </div>
          </ClaimDialog>
        );
      }
      return `$${price}`;
    }

    if (claimed) {
      return (
        <div className="flex items-center">
          <Image src={checkIcon} alt="Claim" width={16} height={16} />
        </div>
      );
    }

    return (
      <div className="flex items-center rounded-lg drop-shadow-[0_1px_0px_#00000029]">
        Collect
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-between bg-light-tan rounded-lg">
      {isPopular && (
        <Image
          src={starIcon3}
          alt="Popular"
          width={36}
          height={36}
          className="absolute -top-5 -left-1 z-10"
        />
      )}

      <div
        className={cn(
          "w-full py-2 bg-light-orange rounded-t-lg rounded-b-none flex items-center justify-center text-2xl border-b-[1px] border-[#B89D9880]",
          size === 44 ? "py-4" : ""
        )}
      >
        <div className="relative">
          <Image
            src={icon}
            alt={title}
            width={size}
            height={size}
            className="relative z-10"
          />
          {star && (
            <>
              <Image
                src={starIcon}
                alt="Star"
                width={20}
                height={20}
                className="absolute top-0 -right-[20%] scale-x-[-1]"
              />
              <div className="absolute bottom-0 left-[calc(50%-56px)] w-28 h-28 bg-[radial-gradient(50%_50%_at_50%_72.12%,#FFFFFFFF_0%,#FFC10080_50%,#FFC10000_100%)] blur-sm z-0" />
            </>
          )}
        </div>
      </div>

      <ItemTitle type={type} id={id} title={title} />

      <Button
        onClick={onClick}
        className={cn(
          "w-full h-6 p-0 text-sm text-white font-made-tommy font-extrabold rounded-b-lg rounded-t-none shadow-[0_1px_0_0_#5F3F57] drop-shadow-[0_1px_0px_#00000029] z-20 hover:bg-neutral-500 active:bg-neutral-600",
          type === "claim"
            ? claimed
              ? "bg-green"
              : "bg-purple"
            : purchased
            ? "bg-purple"
            : "bg-green"
        )}
      >
        {renderButtonContent()}
      </Button>

      {/* {star && !(type === "claim" && unlockable) && <StarDecorations />} */}
      {type === "claim" && unlockable ? (
        <UnlockableOverlay lock={lock} id={id} />
      ) : (
        star && <StarDecorations />
      )}
    </div>
  );
}
