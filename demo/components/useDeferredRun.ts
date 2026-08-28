import { useCallback, useEffect, useRef } from 'react';

/**
 * Defers a synchronous call that blocks the main thread by two animation frames,
 * so the spinner set just before it is painted first.
 * @returns the runner; it drops whatever it had already queued
 */
export function useDeferredRun(): (run: () => void) => void {
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => cancelAnimationFrame(frame.current ?? 0);
  }, []);

  return useCallback((run: () => void) => {
    cancelAnimationFrame(frame.current ?? 0);
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(run);
    });
  }, []);
}
