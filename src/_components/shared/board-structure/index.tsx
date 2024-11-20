import { cn } from "@/lib/utils";
import css from "./style.module.css";
import Link from "next/link";
import { DialogClose } from "../../ui/dialog";
import Image from "next/image";
import close from "@/_assets/icons/close-button.png";

export function BoxLink({
  children,
  href = "#",
  isActive,
  className,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      onClick={onClick}
      href={href}
      className={cn(
        css.link,
        "relative flex items-end font-bold h-full mx-[.2rem] z-0",
        isActive && `z-10 ${css.active}`
      )}
    >
      {/* <SideSvg className="size-2 -rotate-90 absolute -left-2" /> */}
      <span
        className={cn(
          "flex-1 text-golden-brown text-sm leading-[.9rem] bg-[#F9E7CA] py-2 px-1 rounded-t-lg h-full content-center",
          isActive
            ? "-mb-[2px] border-2 border-b-0 border-[#FFF3DA]"
            : "shadow-[inset_0_-0.4rem_2px_#0002]",
          className
        )}
      >
        {children}
      </span>
      {/* <SideSvg className="size-2 absolute -right-2" /> */}
    </Link>
  );
}

export function BoxHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button className="flex justify-between w-full [&>header]:w-full">
      <header
        className={cn("grid gap-1 grid-cols-2 text-center px-2", className)}
      >
        {children}
      </header>
    </button>
  );
}

export function BoxMain({
  children,
  className,
  hideClose,
}: {
  children: React.ReactNode;
  className?: string;
  hideClose?: boolean;
}) {
  return (
    <div className={cn("flex-1 overflow-auto flex flex-col", className)}>
      {children}
      {!hideClose && (
        <DialogClose asChild>
          <button className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 bg-transparent border-none mx-auto mt-auto p-1 mb-1 z-100">
            <Image src={close} alt="Close" className="w-10 h-10" />
          </button>
        </DialogClose>
      )}
    </div>
  );
}

export function BoxTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn("text-center text-golden-brown p-4 px-2", className)}
    >
      {children}
    </article>
  );
}

export function BoxContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex overflow-scroll rounded-md px-2 mt-4", className)}>
      {children}
    </div>
  );
}

export function UserInviteRank({
  rank = 0,
  score = 0,
  name = "Score",
}: {
  rank?: number;
  score?: number;
  name?: string;
}) {
  return (
    <div className="grid gap-2 grid-cols-2 text-center px-2">
      <BoxBunner label="Your Rank" value={`${rank == 0 ? "-" : `#${rank}`}`} />
      <BoxBunner
        label={`Your ${name}`}
        value={Intl.NumberFormat().format(score)}
      />
    </div>
  );
}

export function BoxBunner({ label, value }: { label: string; value: string }) {
  return (
    <p
      className="grid grid-cols-[50%_1fr] text-white rounded-md contain-content [&>*]:p-1 [&>*]:break-words [&>*]:content-center"
      style={{ wordBreak: "break-word" }}
    >
      <span className="bg-golden-brown bg-opacity-80 text-xs font-bold">
        {label}
      </span>
      <span className="bg-golden-brown text-xs font-bold">{value}</span>
    </p>
  );
}

export function LoadingContent({
  className,
  inline,
}: {
  className?: string;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        inline ? "h-full" : "h-dvh",
        "z-10 flex flex-col items-center justify-center font-grobold text-copper-tan",
        className
      )}
    >
      <div className="loader-box mb-8">
        <span className="loader"></span>
      </div>
      <h2 className="">Loading Data ...</h2>
    </div>
  );
}

export function EmptyContent({
  className,
  inline,
}: {
  className?: string;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        inline ? "h-full" : "h-dvh",
        "z-10 flex flex-col items-center justify-center font-grobold text-copper-tan",
        className
      )}
    >
      {/* <div className="loader-box mb-8">
        <span className="loader"></span>
      </div> */}
      <p>Sorry, there is no data found.</p>
    </div>
  );
}
