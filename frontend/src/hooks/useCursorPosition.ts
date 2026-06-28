import { useState, useEffect, useCallback, useRef } from "react";

interface CursorPosition {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

export function useCursorPosition() {
  const [pos, setPos] = useState<CursorPosition>({ x: 0, y: 0, nx: 0.5, ny: 0.5 });
  const frameRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        nx: e.clientX / window.innerWidth,
        ny: e.clientY / window.innerHeight,
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, [handleMouseMove]);

  return pos;
}
