import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * Tracks the content width of an element so a pixel-sized depictor can fill it.
 * @param fallback - width in pixels used until the element has been measured
 * @returns the ref to attach to the element, and its current width
 */
export function useElementWidth(
  fallback: number,
): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
