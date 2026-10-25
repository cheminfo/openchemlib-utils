import type { RefObject } from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Moves the selection of a list with ArrowUp / ArrowDown from anywhere on the
 * page, except while typing. Pair it with `scrollIntoViewOnAttach` on the
 * selected row.
 * @param ids - the ids of the visible rows, in display order
 * @param selectedId - the selected id, `undefined` when nothing is selected
 * @param onSelect - called with the id of the row to select
 * @returns the ref to put on the scrollable list container
 */
export function useArrowSelection(
  ids: readonly number[],
  selectedId: number | undefined,
  onSelect: (id: number) => void,
): RefObject<HTMLDivElement | null> {
  const listRef = useRef<HTMLDivElement>(null);
  const idsRef = useRef(ids);
  const selectedIdRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);

  useLayoutEffect(() => {
    idsRef.current = ids;
    selectedIdRef.current = selectedId;
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement
      ) {
        return;
      }
      // a hidden tab panel must not steal the arrows of the visible one
      if (!listRef.current?.checkVisibility()) return;
      const list = idsRef.current;
      if (list.length === 0) return;
      event.preventDefault();
      const current =
        selectedIdRef.current === undefined
          ? -1
          : list.indexOf(selectedIdRef.current);
      const next =
        event.key === 'ArrowDown'
          ? Math.min(current + 1, list.length - 1)
          : Math.max(current - 1, 0);
      if (next !== current) onSelectRef.current(list[next]);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return listRef;
}

/**
 * Ref callback for the selected row: React attaches it whenever a row becomes
 * the selected one, which scrolls that row into view.
 * @param element - the row element, `null` when it is detached
 */
export function scrollIntoViewOnAttach(element: HTMLElement | null): void {
  element?.scrollIntoView({ block: 'nearest' });
}
