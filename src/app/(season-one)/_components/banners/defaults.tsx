"use client";

import React, { useCallback, useEffect, useState } from "react";
import Explainer from "./explainer";
import DidYouKnow from "./did-u-know";

const states = [
  { name: "did-you-know", Component: DidYouKnow, timeout: 15 },
  { name: "explainer", Component: Explainer, timeout: 9 },
];

export default function DefaultBanners() {
  const [currentState, setCurrentState] = useState(states[0]);

  const changeState = useCallback((state: string) => {
    const index = states.findIndex((s) => s.name == state);
    if (index == states.length - 1) setCurrentState(states[0]);
    else setCurrentState(states[index + 1]);
  }, []);

  useEffect(() => {
    const time = currentState?.timeout || 15;
    const timeout = setTimeout(() => {
      changeState(currentState?.name);
    }, time * 1000);

    return () => clearTimeout(timeout);
  }, [changeState, currentState?.name, currentState?.timeout]);

  return (
    <>
      {currentState?.Component && (
        <currentState.Component key={currentState.name} />
      )}
    </>
  );
}
