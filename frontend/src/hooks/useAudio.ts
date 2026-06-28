import { useCallback, useRef } from "react";

interface AudioEvent {
  type: "hover" | "click" | "open" | "close" | "success" | "reveal";
  intensity?: number;
}

export function useAudio() {
  const enabledRef = useRef(false);

  const play = useCallback((_event: AudioEvent) => {
    if (!enabledRef.current) return;
  }, []);

  const enable = useCallback(() => {
    enabledRef.current = true;
  }, []);

  const disable = useCallback(() => {
    enabledRef.current = false;
  }, []);

  return { play, enable, disable, isEnabled: enabledRef.current };
}
