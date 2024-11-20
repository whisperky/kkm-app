"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import Kokomon from "@/_assets/kokomon.png";
import Bubbles from "@/_assets/bubbles.png";
import BottomSection from "./_components/bottom-section";
import FadeInUnblur from "@/src/_components/ui/fade-in-blur";
import { cn } from "@/lib/utils";

export default function Page() {
  const tutorials = [
    "Play a friend<br /> or challenge a<br /> stranger",
    `101 boxes. Whoever<br />fills the most, wins!<br /><div style="margin-top: 4px">Earn <b style="color: #10b981">1500 points</b> for<br />playing & a <b style="color: #10b981">bonus</b><br /><b style="color: #10b981">3500 for winning</b>!</div>`,
  ];

  const router = useRouter();

  const [scale, setScale] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      const scaleFactor = (window.innerHeight - 60) / 700;
      setScale(scaleFactor);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault(); 
      if (isClient) {
        router.push('/');
      }
    };
  
    history.pushState(null, document.title, window.location.href);
    
    window.addEventListener("popstate", handleBackButton);
  
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isClient, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTutorial(
        (prevTutorial) => (prevTutorial + 1) % tutorials.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [tutorials.length]);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className="h-full overflow-hidden pb-15 bg-cover bg-center"
      style={{ backgroundImage: `url(/images/blue-background.png)` }}
    >
      <div className="relative z-10 flex flex-col min-h-dvh">
        <div
          className="flex justify-center items-center max-w-[70%] right-[5%] top-[10%] absolute"
          style={{
            transform: `scale(${scale}) translateY(${
              (window.innerHeight - 762) / 2
            }px)`,
            transformOrigin: "bottom center",
          }}
        >
          <Image
            src={Bubbles}
            width={400}
            height={1000}
            alt="bubbles"
            className="object-contain"
          />

          <FadeInUnblur
            key={currentTutorial}
            className={cn(
              "text-[#653F56] absolute font-bold text-center flex justify-center items-center top-[52%] left-[40%] w-[54%] h-[34.5%] p-[2%]",
              currentTutorial == 0 ? "text-base" : "text-xs"
            )}
          >
            <span
              className="overflow-hidden whitespace-nowrap truncate max-w-full"
              dangerouslySetInnerHTML={{ __html: tutorials[currentTutorial] }}
            />
          </FadeInUnblur>
        </div>
        <Image
          src={Kokomon}
          width={250}
          height={250}
          alt="kokomon"
          className="object-cover absolute -z-10 inset-[30%] left-0"
          style={{
            transform: `scale(${scale}) translateY(${
              (window.innerHeight - 832) / 2
            }px)`,
            transformOrigin: "bottom center",
          }}
        />
        <BottomSection scale={scale}/>
      </div>
    </div>
  );
}
