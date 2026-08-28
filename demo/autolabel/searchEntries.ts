import type { Molecule } from 'openchemlib';
import { SSSearcher } from 'openchemlib';

import type { AutoLabelEntry } from './entries.ts';
import { AUTO_LABEL_ENTRIES } from './entries.ts';

/** Which of the two substructure directions the structure filter runs. */
export type StructureDirection = 'labelsMyMolecule' | 'containsMySketch';

/** Column the entry table is ordered by; every one is a header of the table. */
export type AutoLabelSortColumn =
  'index' | 'label' | 'mw' | 'atomCount' | 'labelledAtomCount';

/** Ordering applied to the filtered entries; `null` keeps the database order. */
export interface AutoLabelSort {
  column: AutoLabelSortColumn;
  /** @default false */
  descending: boolean;
}

export interface AutoLabelSearchState {
  /** Case-insensitive substring matched against `entry.searchText`. */
  text: string;
  /** Only family kept; `null` keeps every family. */
  family: string | null;
  queryFeatures: 'any' | 'with' | 'without';
  /** When false the `structureHits` argument of `searchEntries` is ignored. */
  structureFilter: boolean;
  direction: StructureDirection;
  /** `null` is the third state of every header: the autoLabel priority order. */
  sort: AutoLabelSort | null;
}

/** Every filter wide open, sorted in autoLabel priority order. */
export const DEFAULT_SEARCH_STATE: AutoLabelSearchState = {
  text: '',
  family: null,
  queryFeatures: 'any',
  structureFilter: false,
  direction: 'labelsMyMolecule',
  sort: null,
};

/**
 * Applies the whole search state to the precomputed entries.
 * @param entries - `AUTO_LABEL_ENTRIES`
 * @param search - the current search state
 * @param structureHits - indices matched by the structure filter, or `null` when the filter is off
 * @returns the filtered and sorted entries
 */
export function searchEntries(
  entries: AutoLabelEntry[],
  search: AutoLabelSearchState,
  structureHits: ReadonlySet<number> | null,
): AutoLabelEntry[] {
  const text = search.text.trim().toLowerCase();
  const applyStructure = search.structureFilter && structureHits !== null;
  const kept: AutoLabelEntry[] = [];
  for (const entry of entries) {
    if (search.family !== null && entry.family !== search.family) continue;
    if (search.queryFeatures === 'with' && !entry.hasQueryFeatures) continue;
    if (search.queryFeatures === 'without' && entry.hasQueryFeatures) continue;
    if (text && !entry.searchText.includes(text)) continue;
    if (applyStructure && !structureHits.has(entry.index)) continue;
    kept.push(entry);
  }
  return sortEntries(kept, search.sort);
}

/**
 * Cycles one table header through its three states: ascending, descending, then
 * back to the database order.
 * @param sort - the ordering in force
 * @param column - the clicked column
 * @returns the next ordering, `null` for the autoLabel priority order
 */
export function nextSort(
  sort: AutoLabelSort | null,
  column: AutoLabelSortColumn,
): AutoLabelSort | null {
  if (sort?.column !== column) return { column, descending: false };
  return sort.descending ? null : { column, descending: true };
}

/**
 * Direction A — the `autoLabel` direction: the database entries are fragments
 * and the user's molecule is the target.
 * @param molecule - the user's molecule; it is not modified
 * @returns indices of the entries that match it as fragments
 */
export function findEntriesMatchingMolecule(molecule: Molecule): Set<number> {
  const hits = new Set<number>();
  if (molecule.getAllAtoms() === 0) return hits;
  for (const entry of AUTO_LABEL_ENTRIES) {
    const searcher = new SSSearcher();
    searcher.setMolecule(molecule);
    searcher.setFragment(entry.fragment);
    if (searcher.isFragmentInMolecule()) hits.add(entry.index);
  }
  return hits;
}

/**
 * Direction B — the roles flip: the user's sketch becomes the fragment and each
 * database entry becomes the target. The sketch is copied before being flagged
 * as a fragment, which is mandatory: without it the search silently returns
 * nothing.
 * @param molecule - the user's sketch; it is not modified
 * @returns indices of the entries that contain it
 */
export function findEntriesContainingQuery(molecule: Molecule): Set<number> {
  const hits = new Set<number>();
  if (molecule.getAllAtoms() === 0) return hits;
  const query = molecule.getCompactCopy();
  query.setFragment(true);
  for (const entry of AUTO_LABEL_ENTRIES) {
    const searcher = new SSSearcher();
    searcher.setMolecule(entry.target);
    searcher.setFragment(query);
    if (searcher.isFragmentInMolecule()) hits.add(entry.index);
  }
  return hits;
}

function sortEntries(
  entries: AutoLabelEntry[],
  sort: AutoLabelSort | null,
): AutoLabelEntry[] {
  if (sort === null) return entries;
  const compare = COMPARATORS[sort.column];
  const sign = sort.descending ? -1 : 1;
  return entries.toSorted((a, b) => sign * compare(a, b) || a.index - b.index);
}

type EntryComparator = (a: AutoLabelEntry, b: AutoLabelEntry) => number;

const COMPARATORS: Record<AutoLabelSortColumn, EntryComparator> = {
  index: (a, b) => a.index - b.index,
  label: (a, b) => a.label.localeCompare(b.label),
  mw: (a, b) => a.mw - b.mw,
  atomCount: (a, b) => a.atomCount - b.atomCount,
  labelledAtomCount: (a, b) => a.labelledAtomCount - b.labelledAtomCount,
};
