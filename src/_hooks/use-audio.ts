"use client";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { GeneralContext } from "../app/general-context";

const INACTIVITY_TIMEOUT = 10000;

export function useAudio() {
  const { isMuted, handleToggleMute } = useContext(GeneralContext);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [clickBuffer, setClickBuffer] = useState<AudioBuffer | null>(null);
  const [backgroundBuffer, setBackgroundBuffer] = useState<AudioBuffer | null>(
    null
  );
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      setAudioContext(context);

      const loadAudio = async (url: string): Promise<AudioBuffer | null> => {
        const response = await fetch(url);
        const arrayBuffer = await response?.arrayBuffer();
        return context?.decodeAudioData(arrayBuffer);
      };

      const clickBuffer = await loadAudio("/sounds/click.mp3");
      const backgroundBuffer = await loadAudio("/sounds/background.mp3");
      setClickBuffer(clickBuffer);
      setBackgroundBuffer(backgroundBuffer);
    };

    initAudio();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pauseAudio = useCallback(() => {
    if (sourceNode) {
      sourceNode.stop();
      setIsPlaying(false);
    }
  }, [sourceNode]);

  const playBackgroundAudio = useCallback(() => {
    if (audioContext && backgroundBuffer) {
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isMuted ? 0 : 0.2; // 20 %
      gainNode.connect(audioContext.destination);

      const source = audioContext.createBufferSource();
      source.buffer = backgroundBuffer;
      source.loop = true;

      source.connect(gainNode);
      source.start();

      setSourceNode(source);
      setIsPlaying(true);
    }
  }, [audioContext, backgroundBuffer, isMuted]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      pauseAudio();
    }, INACTIVITY_TIMEOUT);
  }, [pauseAudio]);

  const playBackgroundAudioOnClick = useCallback(() => {
    if (!isPlaying) {
      playBackgroundAudio();
    }
    resetInactivityTimer();
  }, [isPlaying, playBackgroundAudio, resetInactivityTimer]);

  const playClickAudio = useCallback(() => {
    if (audioContext && clickBuffer) {
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isMuted ? 0 : 0.6; // 60 %
      gainNode.connect(audioContext.destination);

      const source = audioContext.createBufferSource();
      source.buffer = clickBuffer;
      source.connect(gainNode);
      source.start();
    }
    playBackgroundAudioOnClick();
  }, [audioContext, clickBuffer, isMuted, playBackgroundAudioOnClick]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      pauseAudio();
    }
  }, [pauseAudio]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resetInactivityTimer();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [handleVisibilityChange, resetInactivityTimer]);

  return {
    playClickAudio,
    playBackgroundAudio,
    pauseAudio,
    isPlaying,
    isMuted,
    handleToggleMute,
  };
}
