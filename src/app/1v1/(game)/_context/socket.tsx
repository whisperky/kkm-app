"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import * as msgpack from "msgpack-lite";
import pako from "pako";
import { GeneralContext } from "../../../general-context";
import { MatchContext } from "./match";
// import { useGetRankByMatchId } from "@/services/koko";

type TFinalScoreData = {
  playerOne: {
    sessionId: string;
    name: string;
    score: number;
  };
  playerTwo: {
    sessionId: string;
    name: string;
    score: number;
  };
  winner: "none" | "me" | "opponent";
  winnerId: string;
} | null;

export interface ISocketContext {
  socket?: Socket;
  sendMessage?: (_event: string, _data: any) => void;
  socketStatus?: "connected" | "connecting" | "disconnected";
  setSocketStatus?: Setter<"connected" | "connecting" | "disconnected">;

  compressAndSerialize?: (_data: any) => Uint8Array;
  decompressAndDeserialize?: (_data: Uint8Array) => any;
  finalScoreData?: TFinalScoreData;
  setFinalScoreData?: Setter<TFinalScoreData>;
}

export const SocketContext = createContext<ISocketContext>({});

export function SocketContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  // variables
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketStatus, setSocketStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connecting");

  const lastHeartbeatRef = useRef<number>(Date.now());

  // other vars
  const { sessionId } = useContext(GeneralContext);
  // const { resetMatch } = useContext(MatchContext);
  const { toggleBox, resetMatch } = useContext(MatchContext);
  // const { data: rankings } = useGetRankByMatchId({ matchId: match?.id ?? "" });
  const [finalScoreData, setFinalScoreData] = useState<TFinalScoreData>(null);

  // functions
  const compressAndSerialize = useCallback((data: any) => {
    const serialized = msgpack.encode(data);
    return pako.deflate(new Uint8Array(serialized));
  }, []);

  const decompressAndDeserialize = useCallback((data: Uint8Array) => {
    const decompressed = pako.inflate(data);
    return msgpack.decode(decompressed);
  }, []);

  const sendMessage = useCallback(
    (event: string, data: any) => {
      if (socket && socket.connected) {
        // const compressedData = compressAndSerialize(data);
        socket.emit(event, data);
      }
    },
    [socket]
  );

  // Socket initialization effect
  useEffect(() => {
    const socketIO = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      path: "/1v1-mini",
    });

    socketIO.on("connect", () => {
      console.log("Socket.IO connected");
      setSocket(socketIO);
      setSocketStatus("connected");
      lastHeartbeatRef.current = Date.now();
    });

    socketIO.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setSocket(null);
      setSocketStatus("disconnected");
    });

    socketIO.on("room-created", (data) => {
      console.log(`Room ${data.roomId} created.`, data);
    });

    socketIO.on("room-joined", (data) => {
      console.log(`Joined room ${data.roomId}.`, data);
    });

    return () => {
      socketIO.close();
    };
  }, []);

  useEffect(() => {
    socket?.on("checkbox-update", (data) => {
      console.log("Received from Socket.IO:", data);

      toggleBox?.(data?.boxId, {
        checked: data.isChecked,
        mine: data?.sessionId == sessionId,
        changeTotal: data?.sessionId ? data?.sessionId !== sessionId : false,
        matchId: data?.roomId,
      });
    });
  }, [sessionId, socket, toggleBox]);

  useEffect(() => {
    socket?.on("match-ended", async (data) => {
      // console.log("match-end from Socket.IO:", data);
      const scores = [...(data?.scores || [])];      
      const playerOne = [scores?.[0]?.sessionId, scores?.[0]?.score, scores?.[0]?.username];
      const playerTwo =  [scores?.[1]?.sessionId, scores?.[1]?.score, scores?.[1]?.username];

      // console.log("scores:", scores);
      // console.log("score one:", playerOne);
      // console.log("score two:", playerTwo);

      setFinalScoreData({
        playerOne: {
          sessionId: playerOne?.[0],
          name: `${playerOne?.[2] || ""} (${
            playerOne?.[0] == sessionId ? "Me" : "Opponent"
          })`,
          score: playerOne?.[1],
        },
        playerTwo: {
          sessionId: playerTwo?.[0],
          name: `${playerTwo?.[2] || ""} (${
            playerTwo?.[0] == sessionId ? "Me" : "Opponent"
          })`,
          score: playerTwo?.[1],
        },
        winner: !data?.winner
          ? "none"
          : data?.winner == sessionId
          ? "me"
          : "opponent",
        winnerId: data?.winner,
      });
      await resetMatch?.(true);
    });
  }, [decompressAndDeserialize, resetMatch, sessionId, socket]);

  return (
    <SocketContext.Provider
      value={{
        socket: socket ?? undefined,
        sendMessage,
        socketStatus,
        setSocketStatus,
        compressAndSerialize,
        decompressAndDeserialize,
        finalScoreData,
        setFinalScoreData,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
