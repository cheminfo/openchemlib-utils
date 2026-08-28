import type { Molecule } from 'openchemlib';

import { applyFragmentLabels } from '../../src/util/applyFragmentLabels.ts';
import { getNonUniqueCustomLabels } from '../../src/util/getNonUniqueCustomLabels.ts';

import { AUTO_LABEL_ENTRIES } from './entries.ts';
import { findEntriesMatchingMolecule } from './searchEntries.ts';

export interface RunAutoLabelOptions {
  /** @default 'separated' */
  algorithm: 'firstMatch' | 'separated' | 'overlapping' | 'rigorous' | 'unique';
  /** @default '' */
  prefix: string;
  /** @default '' */
  suffix: string;
}

export interface RunAutoLabelResult {
  /** Index of the first entry with `found > 0`, or `undefined` when nothing matched. */
  winnerIndex: number | undefined;
  /** `applyFragmentLabels` return value for the winning entry. */
  found: number;
  /** How many atoms of the result molecule carry a custom label. */
  labelledAtoms: number;
  /** The labelled copy — never the caller's molecule. */
  molecule: Molecule;
  /** `getNonUniqueCustomLabels(molecule)`; non-empty means duplicated locants. */
  nonUniqueLabels: string[];
  /** Every entry that would match, in priority order — shows what the winner shadowed. */
  allMatches: number[];
  /** Molfile with the labels written as V lines, `]` stripped. */
  molfileWithLabels: string;
  /** How many entries were tried before stopping. */
  triedEntries: number;
  elapsedMs: number;
}

/** Same defaults as the library's `autoLabel()`. */
export const DEFAULT_RUN_OPTIONS: RunAutoLabelOptions = {
  algorithm: 'separated',
  prefix: '',
  suffix: '',
};

/**
 * Reproduces `autoLabel()` on a copy of the molecule while reporting which entry
 * won, what it shadowed, and whether the result has duplicate locants.
 * @param molecule - the user's molecule; it is never modified
 * @param options - algorithm and affixes forwarded to `applyFragmentLabels`
 * @returns the full outcome
 */
export function runAutoLabel(
  molecule: Molecule,
  options: RunAutoLabelOptions,
): RunAutoLabelResult {
  const start = performance.now();
  const result = molecule.getCompactCopy();
  let winnerIndex: number | undefined;
  let found = 0;
  let triedEntries = 0;
  for (const entry of AUTO_LABEL_ENTRIES) {
    triedEntries++;
    found = applyFragmentLabels(result, entry.fragment, options);
    if (found > 0) {
      winnerIndex = entry.index;
      break;
    }
  }
  return buildResult({
    molecule,
    result,
    winnerIndex,
    found: winnerIndex === undefined ? 0 : found,
    triedEntries,
    start,
  });
}

/**
 * Applies a single database entry to a copy of the molecule.
 * @param molecule - the user's molecule; it is never modified
 * @param entryIndex - position in `AUTO_LABEL_ENTRIES`
 * @param options - algorithm and affixes forwarded to `applyFragmentLabels`
 * @returns the same outcome shape, with `winnerIndex` forced to `entryIndex` when `found > 0`
 */
export function runSingleEntry(
  molecule: Molecule,
  entryIndex: number,
  options: RunAutoLabelOptions,
): RunAutoLabelResult {
  const start = performance.now();
  const result = molecule.getCompactCopy();
  const entry = AUTO_LABEL_ENTRIES.find((item) => item.index === entryIndex);
  if (entry === undefined) {
    throw new Error(`no autoLabel entry with index ${entryIndex}`);
  }
  const found = applyFragmentLabels(result, entry.fragment, options);
  return buildResult({
    molecule,
    result,
    winnerIndex: found > 0 ? entryIndex : undefined,
    found,
    triedEntries: 1,
    start,
  });
}

interface BuildResultArguments {
  molecule: Molecule;
  result: Molecule;
  winnerIndex: number | undefined;
  found: number;
  triedEntries: number;
  start: number;
}

function buildResult(parameters: BuildResultArguments): RunAutoLabelResult {
  const { molecule, result, winnerIndex, found, triedEntries, start } =
    parameters;
  let labelledAtoms = 0;
  for (let atom = 0; atom < result.getAllAtoms(); atom++) {
    if (result.getAtomCustomLabel(atom)) labelledAtoms++;
  }
  const allMatches = [...findEntriesMatchingMolecule(molecule)].toSorted(
    (a, b) => a - b,
  );
  return {
    winnerIndex,
    found,
    labelledAtoms,
    molecule: result,
    nonUniqueLabels: getNonUniqueCustomLabels(result),
    allMatches,
    molfileWithLabels: result.toMolfile({
      includeCustomAtomLabelsAsALines: false,
      includeCustomAtomLabelsAsVLines: true,
      removeCustomAtomLabels: true,
      customLabelPosition: 'normal',
    }),
    triedEntries,
    elapsedMs: performance.now() - start,
  };
}
