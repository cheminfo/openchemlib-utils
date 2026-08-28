import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

// 17 buttons of 21px plus the 2px border the toolbar draws around them.
const FALLBACK_FRAME_HEIGHT = 361;

/**
 * Height the drawing frame must have. The OCL toolbar is a fixed-size canvas in
 * the editor shadow root that never shrinks, so a shorter frame lets its last
 * buttons spill over whatever follows.
 * @param frameRef - element wrapping the editor
 * @param editorKey - changes whenever the editor is remounted
 * @returns the height in pixels
 */
export function useEditorFrameHeight(
  frameRef: RefObject<HTMLDivElement | null>,
  editorKey: number,
): number {
  const [height, setHeight] = useState(FALLBACK_FRAME_HEIGHT);

  useEffect(() => {
    const host = frameRef.current?.querySelector(
      '[data-openchemlib-canvas-editor]',
    );
    const toolbar = host?.shadowRoot?.querySelector('canvas');
    if (!toolbar) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const measured = Math.ceil(entry.contentRect.height);
      if (measured > 0) setHeight(measured);
    });
    observer.observe(toolbar);
    return () => observer.disconnect();
  }, [frameRef, editorKey]);

  return height;
}
