import type { ToggleOption } from '../components/ToggleGroup.tsx';

import type { Topicity } from './topicity.ts';
import type { AtomRow } from './types.ts';

/** The quick filters offered above the atom table. */
export type AtomQuickFilter =
  'all' | 'hydrogen' | 'heavy' | 'prochiral' | 'diastereotopic';

/** The quick-filter buttons, in the order they are rendered. */
export const ATOM_QUICK_FILTERS: Array<ToggleOption<AtomQuickFilter>> = [
  { value: 'all', label: 'all' },
  { value: 'hydrogen', label: 'H only' },
  { value: 'heavy', label: 'heavy only' },
  { value: 'prochiral', label: 'prochiral only' },
  { value: 'diastereotopic', label: 'diastereotopic only' },
];

/** Tag of every topicity that gets one; `none` is rendered as an empty cell. */
export const TOPICITY_TAGS: Partial<
  Record<Topicity, { label: string; intent: 'success' | 'primary' | 'none' }>
> = {
  diastereotopic: { label: 'dia', intent: 'success' },
  enantiotopic: { label: 'enan', intent: 'primary' },
  homotopic: { label: 'homo', intent: 'none' },
};

/**
 * Applies the text filter and the quick filter of the atom table.
 * @param rows - every row of the analysis
 * @param query - substring matched against the atom index, element, diaID, enantioID and custom label
 * @param quickFilter - the active quick filter
 * @returns the rows to render, in atom order
 */
export function filterAtomRows(
  rows: AtomRow[],
  query: string,
  quickFilter: AtomQuickFilter,
): AtomRow[] {
  const needle = query.trim().toLowerCase();
  const filtered: AtomRow[] = [];
  for (const row of rows) {
    if (!matchesQuickFilter(row, quickFilter)) continue;
    if (needle !== '' && !matchesQuery(row, needle)) continue;
    filtered.push(row);
  }
  return filtered;
}

/**
 * Tells whether a HOSE sphere repeats its predecessor, which is where the
 * environment saturated and every further sphere carries no new information.
 * @param hoseCodes - the codes of one atom, one per sphere
 * @param index - position in `hoseCodes`, not the sphere number
 * @returns `true` when the sphere equals the one before it
 */
export function isSaturatedSphere(
  hoseCodes: string[] | undefined,
  index: number,
): boolean {
  if (!hoseCodes || index === 0) return false;
  const code = hoseCodes[index];
  return code !== undefined && code === hoseCodes[index - 1];
}

function matchesQuickFilter(
  row: AtomRow,
  quickFilter: AtomQuickFilter,
): boolean {
  switch (quickFilter) {
    case 'hydrogen':
      return row.atomLabel === 'H';
    case 'heavy':
      return row.atomLabel !== 'H';
    case 'prochiral':
      return row.prochirality !== undefined;
    case 'diastereotopic':
      return row.topicity === 'diastereotopic';
    case 'all':
      return true;
    default:
      return true;
  }
}

function matchesQuery(row: AtomRow, needle: string): boolean {
  const haystacks = [
    String(row.atom),
    row.atomLabel,
    row.diaID ?? '',
    row.enantioID ?? '',
    row.customLabel ?? '',
  ];
  for (const haystack of haystacks) {
    if (haystack.toLowerCase().includes(needle)) return true;
  }
  return false;
}
