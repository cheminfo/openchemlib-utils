import type { Molecule } from 'openchemlib';
import { SSSearcher } from 'openchemlib';

import type { NMRHint, PossibleHint } from '../../src/util/getNMRHints.ts';

import type { HintCatalogEntry } from './hintCatalog.ts';

/**
 * Why a fragment hint did or did not end up in the result, in the order
 * `getNMRHints` decides it.
 */
export type HintStatus =
  | 'fired'
  | 'gated'
  | 'absentFromCorrect'
  | 'presentInProposed'
  | 'invalid'
  | 'idle';

export interface HintTrace {
  entry: HintCatalogEntry;
  /** per `anyMatches` fragment, whether the proposed molecule contains it */
  gate: Array<boolean | undefined>;
  inCorrect?: boolean;
  inProposed?: boolean;
  status: HintStatus;
}

/**
 * Replays the fragment part of `getNMRHints` hint by hint, keeping every
 * intermediate answer instead of only the hints that fire.
 * @param catalog - the decoded hint list
 * @param correct - the expected structure; the trace is idle without it
 * @param proposed - the structure to judge; the trace is idle without it
 * @returns one trace per catalog entry, in the same order
 */
export function traceHints(
  catalog: HintCatalogEntry[],
  correct: Molecule | undefined,
  proposed: Molecule | undefined,
): HintTrace[] {
  if (!correct || !proposed) {
    return catalog.map((entry) => ({
      entry,
      gate: entry.anyMatches.map(() => undefined),
      status: entry.issues.some(isDanger) ? 'invalid' : 'idle',
    }));
  }
  const inCorrect = createSearcher(correct);
  const inProposed = createSearcher(proposed);
  return catalog.map((entry) => traceEntry(entry, inCorrect, inProposed));
}

/**
 * Links every hint `getNMRHints` returned to the catalog entry it comes from.
 * @param hints - the result of `getNMRHints`
 * @param traces - the trace of the same pair
 * @returns per returned hint, the catalog index, or `undefined` for a global check
 */
export function attributeHints(
  hints: NMRHint[],
  traces: HintTrace[],
): Array<number | undefined> {
  const firedByKey = new Map<string, number[]>();
  for (const trace of traces) {
    if (trace.status !== 'fired') continue;
    const key = hintKey(trace.entry.hint);
    const indices = firedByKey.get(key) ?? [];
    indices.push(trace.entry.index);
    firedByKey.set(key, indices);
  }
  return hints.map((hint) => {
    const possibleHint = hint as Partial<PossibleHint>;
    if (possibleHint.idCode === undefined) return undefined;
    return firedByKey.get(hintKey(possibleHint))?.shift();
  });
}

/**
 * Checks that the trace predicts exactly the fragment hints `getNMRHints` returned,
 * so a drift between this replay and the library cannot go unnoticed.
 * @param hints - the result of `getNMRHints`
 * @param traces - the trace of the same pair
 * @returns a description of the disagreement, or `undefined` when both agree
 */
export function findTraceMismatch(
  hints: NMRHint[],
  traces: HintTrace[],
): string | undefined {
  const expected = traces
    .filter((trace) => trace.status === 'fired')
    .map((trace) => hintKey(trace.entry.hint));
  const actual = hints
    .map((hint) => hint as Partial<PossibleHint>)
    .filter((hint) => hint.idCode !== undefined)
    .map(hintKey);
  if (expected.join('\n') === actual.join('\n')) return undefined;
  return `the trace predicts ${expected.length} fragment hint(s) but getNMRHints returned ${actual.length}, or in another order`;
}

/**
 * Atoms of a molecule covered by any match of a fragment, to highlight them.
 * @param fragment - the query fragment
 * @param molecule - the molecule searched
 * @returns the matched atom indices, sorted, without duplicates
 */
export function findMatchAtoms(
  fragment: Molecule,
  molecule: Molecule,
): number[] {
  const searcher = new SSSearcher();
  searcher.setMol(fragment, molecule);
  searcher.findFragmentInMolecule({ countMode: 'overlapping' });
  const atoms = new Set<number>();
  for (const match of searcher.getMatchList()) {
    for (const atom of match) {
      if (atom >= 0) atoms.add(atom);
    }
  }
  return [...atoms].toSorted((a, b) => a - b);
}

function traceEntry(
  entry: HintCatalogEntry,
  inCorrect: (fragment: Molecule | undefined) => boolean | undefined,
  inProposed: (fragment: Molecule | undefined) => boolean | undefined,
): HintTrace {
  const gate = entry.anyMatches.map((anyMatch) =>
    inProposed(anyMatch.molecule),
  );
  const trace = {
    entry,
    gate,
    inCorrect: inCorrect(entry.fragment.molecule),
    inProposed: inProposed(entry.fragment.molecule),
  };
  return { ...trace, status: getStatus(trace) };
}

function getStatus(trace: Omit<HintTrace, 'status'>): HintStatus {
  if (trace.entry.issues.some(isDanger)) return 'invalid';
  if (trace.gate.length > 0 && !trace.gate.includes(true)) return 'gated';
  if (!trace.inCorrect) return 'absentFromCorrect';
  if (trace.inProposed) return 'presentInProposed';
  return 'fired';
}

function createSearcher(molecule: Molecule) {
  const searcher = new SSSearcher();
  searcher.setMolecule(molecule);
  return (fragment: Molecule | undefined) => {
    if (!fragment) return undefined;
    searcher.setFragment(fragment);
    return searcher.isFragmentInMolecule();
  };
}

function isDanger(issue: { level: string }) {
  return issue.level === 'danger';
}

function hintKey(hint: Partial<PossibleHint>): string {
  return JSON.stringify([hint.idCode, hint.message, hint.remarks ?? '']);
}
