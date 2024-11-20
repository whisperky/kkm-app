import Image from "next/image";

export default function Banner({
  totalChecked,
  userScore,
  myChecks,
}: {
  totalChecked: number;
  userScore: number;
  myChecks: number;
}) {
  return (
    <div className="w-fit z-20 mx-auto max-w-full relative max-sm:text-xs m-2 mb-0">
      <Image
        priority
        src="/images/floating-panel.png"
        alt="banner"
        height={176}
        width={4000}
        className="h-44 md-h:h-40 w-auto"
      />
      <div className="grid grid-cols-2 gap-x-2 px-4 w-[94%] h-[38%] md-h:h-[40%] inset-x-0 top-[9%] md-h:top-[8%] mx-auto absolute items-center ">
        <div className="text-sm text-[#DCB289] font-[500]">
          TOTAL KOKOS<br />CHECKED
        </div>
        <div className="text-2xl font-bold leading-normal text-white text-end">
          {Intl.NumberFormat().format(totalChecked)}
        </div>
      </div>
      <div className="grid grid-cols-2 items-center px-4 gap-8 w-[94%] h-[30%] inset-x-0 bottom-[12%] md-h:bottom-[12%] mx-auto absolute">
        <div className="flex items-end justify-between">
        <div className="text-sm text-[#DCB289] font-[500] text-start">
            YOUR<br />SCORE:
          </div>
          <div className="text-2xl font-bold leading-normal text-white text-end">
            {userScore?.toLocaleString()}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-sm text-[#DCB289] font-[500] text-start">
            YOUR<br />KOKOS:
          </div>
          <div className="text-2xl font-bold leading-normal text-white text-end">
            {myChecks?.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}