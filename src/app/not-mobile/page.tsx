import React from "react";

export default function NotMobilePage() {
  return (
    <div className="flex flex-col justify-center items-center h-dvh text-center z-10 bg-center bg-cover p-4" style={{ backgroundImage: `url(/images/splash.png)` }}>
      <div className="p-6 bg-black/30 shadow-lg backdrop-blur rounded-md grid gap-6 max-w-lg w-full">
        <p className="font-bold text-3xl text-white leading-relaxed">
          Leave the desktop. <br />
          Mobile gaming rocks!
        </p>
        <div className="flex flex-col gap-4 items-center">
          <a href={process?.env?.NEXT_PUBLIC_COMMUNITY_URL} className="flex items-center gap-2 px-4 py-2 bg-green/20 btn-animate hover:bg-green-600 text-white font-semibold rounded-md transition-all" target="_blank" rel="noopener noreferrer">
            Join our Channel
          </a>
        </div>
      </div>
    </div>
  );
}
