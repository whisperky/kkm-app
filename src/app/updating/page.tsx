import React from "react";

export default function UpdatingPage() {
  return (
    <div className="flex flex-col justify-center items-center h-dvh text-center z-10 bg-center bg-cover p-4" style={{ backgroundImage: `url(/images/splash.png)` }}>
      <div className="p-6 bg-black/30 shadow-lg backdrop-blur rounded-md grid gap-6 max-w-lg w-full">
        <h2 className="font-bold text-3xl text-white leading-relaxed">
          Paused for maintenance 👨‍🔬
        </h2>
        <p className="text-lg text-white leading-relaxed">
          We&apos;ll be back shortly, better than ever. Make sure to join the
          Official Kokomo channel so you don&apos;t miss when we&apos;re back.
        </p>
        <div className="flex flex-col gap-4 items-center">
          {/* <a
            href={process?.env?.NEXT_PUBLIC_HOSTED_BOT_URL}
            className="flex items-center gap-2 px-4 py-2 bg-green btn-animate text-white font-semibold rounded-md transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect with Bot
          </a> */}
          <a
            href={process?.env?.NEXT_PUBLIC_COMMUNITY_URL}
            className="flex items-center gap-2 px-4 py-2 bg-green btn-animate hover:bg-green-600 text-white font-semibold rounded-md transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join our Channel
          </a>
        </div>
      </div>
    </div>
  );
}
