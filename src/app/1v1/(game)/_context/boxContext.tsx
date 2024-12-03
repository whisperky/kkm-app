"use client";

import { useAudio } from "@/src/_hooks/use-audio";
import { createContext, ReactNode, useEffect } from "react";

export interface IBoxContext {
  pauseAudio?: () => void;
  playClickAudio?: () => void;
}

export const BoxContext = createContext<IBoxContext>({});

export function BoxContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  // variables
  const { playClickAudio, pauseAudio } = useAudio();

  // other var

  // functions
  useEffect(() => {
    return () => {
      pauseAudio();
    };
  }, [pauseAudio]);

  // effects

  return (
    <BoxContext.Provider
      value={{
        pauseAudio,
        playClickAudio,
      }}
    >
      {children}
    </BoxContext.Provider>
  );
}
