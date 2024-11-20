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
import { MainGameContext } from "./main-game-context";
// import toastAction from "@/src/_components/shared/toast-action";

export interface ISocketContext {
  socket?: Socket;
  sendMessage?: (_event: string, _data: any) => void;

  compressAndSerialize?: (_data: any) => Uint8Array;
  decompressAndDeserialize?: (_data: Uint8Array) => any;
}

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const HEARTBEAT_TIMEOUT = 60000; // 60 seconds

export const SocketContext = createContext<ISocketContext>({});

export function SocketContextProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  // variables
  const [socket, setSocket] = useState<Socket | null>(null);

  const lastHeartbeatRef = useRef<number>(Date.now());
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // other var
  const {
    sessionId,
    addMyScore,
    toggleBox,
    username,
    setCheckedBoxes,
    setFreezing,
    setMyCheckedBoxes,
    setMyTotalCheckedKokos,
    setTotalCheckedKokos,
  } = useContext(MainGameContext);

  // functions
  const compressAndSerialize = useCallback((data: any) => {
    const serialized = msgpack.encode(data);
    return pako.deflate(serialized);
  }, []);

  const decompressAndDeserialize = useCallback((data: Uint8Array) => {
    const decompressed = pako.inflate(data);
    return msgpack.decode(decompressed);
  }, []);

  const sendMessage = useCallback(
    (event: string, data: any) => {
      if (socket && socket.connected) {
        const compressedData = compressAndSerialize(data);
        socket.emit(event, compressedData);
      }
    },
    [socket, compressAndSerialize],
  );

  const handleHeartbeat = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit("heartbeat");
      lastHeartbeatRef.current = Date.now();
    }
  }, [socket]);

  const checkHeartbeat = useCallback(() => {
    const now = Date.now();
    if (now - lastHeartbeatRef.current > HEARTBEAT_TIMEOUT) {
      console.log("Heartbeat timeout, reconnecting...");
      socket?.disconnect();
      socket?.connect();
    }
  }, [socket]);

  // effects
  useEffect(() => {
    const url = new URL(window.location.href);
    const queryString = url.search.substring(1);
    const referrerSessionId = queryString.substring(3);

    const socketIO = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { sessionId, username, referrerSessionId: referrerSessionId },
      extraHeaders: {
        "ngrok-skip-browser-warning": "69420",
      },
    });

    socketIO.on("connect", () => {
      console.log("Socket.IO connected");
      setSocket(socketIO);
      lastHeartbeatRef.current = Date.now();
    });

    socketIO.on("check-koko", (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize(compressedData);
      
      toggleBox?.(
        data.key,
        !data.checked,
        data?.doneBy == sessionId,
        data?.doneBy ? data?.doneBy !== sessionId : false,
      );
    });

    socketIO.on("add-point", (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize(compressedData);
      // console.log({ data });
      if (data?.amount) addMyScore?.(data?.amount);
    });

    socketIO.on("remove-point", (compressedData: Uint8Array) => {
      const data = decompressAndDeserialize(compressedData);
      if (
        data?.lastCheckedByUserId == sessionId &&
        data?.checked == false &&
        data.sessionId !== sessionId
      ) {
        addMyScore?.(-1 * (data?.score ?? 1));
      }
    });
    // reset-game
    socketIO.on("reset-game", () => {
      setCheckedBoxes?.(new Set());
      setMyCheckedBoxes?.(new Set());
      setMyTotalCheckedKokos?.(0);
      setTotalCheckedKokos?.(0);
    });
    socketIO?.on("freeze-game", (compressedData: Uint8Array) => {
      if (decompressAndDeserialize) {
        const data = decompressAndDeserialize(compressedData);
        if (data === true) {
          setFreezing?.(true);
        }
      }
    });

    // socketIO?.on("opponent-joined-game", (compressedData: Uint8Array) => {
    //   if (decompressAndDeserialize) {
    //     const data = decompressAndDeserialize(compressedData);
    //     if (data === true) {
    //       toastAction('Opponent have joined the game', { 
    //         onConfirm: () => {}, 
    //         actionButtonLabel: "Join"
    //       })
    //     }
    //   }
    // });

    socketIO.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setSocket(null);
    });

    return () => {
      socketIO.disconnect();
    };
  }, [
    addMyScore,
    decompressAndDeserialize,
    sessionId,
    username,
    toggleBox,
    setCheckedBoxes,
    setMyCheckedBoxes,
    setMyTotalCheckedKokos,
    setTotalCheckedKokos,
    setFreezing
  ]);

  useEffect(() => {
    socket?.on("heartbeat", handleHeartbeat);

    heartbeatIntervalRef.current = setInterval(() => {
      handleHeartbeat();
      checkHeartbeat();
    }, HEARTBEAT_INTERVAL);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [checkHeartbeat, handleHeartbeat, socket]);

  return (
    <SocketContext.Provider
      value={{
        socket: socket ?? undefined,
        sendMessage,

        compressAndSerialize,
        decompressAndDeserialize,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
