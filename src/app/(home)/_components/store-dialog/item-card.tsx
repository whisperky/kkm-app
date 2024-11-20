import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/src/_components/ui/dialog";
import { Button } from "@/src/_components/ui/button";

import starIcon from "@/_assets/icons/star-y.png";
import starIcon2 from "@/_assets/icons/star-w.png";
import starIcon3 from "@/_assets/icons/star-p.png";
import claimIcon from "@/_assets/icons/claim.png";
import lockIcon from "@/_assets/icons/lock.png";
import unlockIcon from "@/_assets/icons/unlock.png";
import checkIcon from "@/_assets/icons/check.png";
import ClaimDialog from "../claim-dialog";

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
      className="absolute z-10 top-[1%] -right-[1%] scale-x-[-1]"
    />
  </>
);

const ItemTitle = ({
  type,
  id,
  title,
}: Pick<StoreItemProps, "type" | "id" | "title">) => (
  <div className="text-[12px] py-2 font-medium px-1 bg-[#E3BEAA] text-[#5F3F57] text-center z-2 border-t-[1px] border-[#FCEAD080]">
    {type === "bundle" ? (
      title
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
  <div className="absolute top-0 right-0 left-0 bottom-0 bg-[#000000E5] rounded-lg z-[999]">
    <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
      {lock ? (
        <>
          <Image src={lockIcon} alt="Lock" width={32} height={32} />
          <p className="text-[#FF5C97] text-[10px] text-center font-[700] px-2">
            Buy next Collector Pass to unlock
          </p>
        </>
      ) : (
        <>
          <Image src={unlockIcon} alt="Unlock" width={28} height={28} />
          <p className="text-[#A291FF] text-[10px] text-center font-[700] px-2">
            Come back to Collect!
          </p>
          <p className="text-[#A291FF] text-[10px] text-center font-[500] px-2">
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
        <DialogClose asChild>
          <ClaimDialog type={id}>
            <div className="flex items-center rounded-lg drop-shadow-[0_1px_0px_#00000029]">
              {`$${Number(price).toFixed(2)}`}
            </div>
          </ClaimDialog>
        </DialogClose>
      );
    }

    if (type === "store") {
      if (purchased) {
        return (
          <DialogClose asChild>
            <ClaimDialog type="store">
              <div className="flex items-center drop-shadow-[0_1px_0px_#00000029]">
                <Image src={claimIcon} alt="Claim" width={16} height={16} />
                Claim
              </div>
            </ClaimDialog>
          </DialogClose>
        );
      }
      return `$${Number(price).toFixed(2)}`;
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
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-[#E3BEAA] rounded-lg"
      )}
    >
      {isPopular && (
        <Image
          src={starIcon3}
          alt="Popular"
          width={36}
          height={36}
          className="absolute -top-5 -left-1 z-10"
        />
      )}

      {star && <StarDecorations />}

      <div
        className={cn(
          "w-[100%] py-2 bg-[#FCEAD0] rounded-t-lg rounded-b-none flex items-center justify-center text-2xl border-b-[1px] border-[#B89D9880]",
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
              <div className="absolute bottom-0 left-[calc(50%-56px)] w-[112px] h-[112px] bg-[radial-gradient(50%_50%_at_50%_72.12%,#FFFFFFFF_0%,#FFC10080_50%,#FFC10000_100%)] blur-[5px] z-0" />
            </>
          )}
        </div>
      </div>

      <ItemTitle type={type} id={id} title={title} />

      <Button
        onClick={onClick}
        className={cn(
          "w-full h-6 px-3 py-0 text-[14px] text-white font-made-tommy font-extrabold rounded-b-lg rounded-t-none shadow-[0_1px_0_0_#5F3F57] drop-shadow-[0_1px_0px_#00000029] z-[99]",
          type === "claim"
            ? claimed
              ? "bg-[#24BE62]"
              : "bg-[#A291FF]"
            : purchased
            ? "bg-[#A291FF]"
            : "bg-[#24BE62]"
        )}
      >
        {renderButtonContent()}
      </Button>

      {type === "claim" && unlockable && (
        <UnlockableOverlay lock={lock} id={id} />
      )}
    </div>
  );
}
