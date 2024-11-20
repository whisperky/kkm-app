import React from "react";
import { SocketContextProvider } from "./_context/socket";
import { MatchContextProvider } from "./_context/match";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MatchContextProvider>
      <SocketContextProvider>{children}</SocketContextProvider>
    </MatchContextProvider>
  );
}
