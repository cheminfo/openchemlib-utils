import { Molecule } from 'openchemlib';

import { errorMessage } from '../components/errorMessage.ts';

import type { AutoLabelEntry } from './entries.ts';
import { AUTO_LABEL_ENTRIES } from './entries.ts';
import type {
  RunAutoLabelOptions,
  RunAutoLabelResult,
} from './runAutoLabel.ts';
import { runAutoLabel, runSingleEntry } from './runAutoLabel.ts';

/** The `applyFragmentLabels` matching modes the playground offers. */
export type Algorithm = RunAutoLabelOptions['algorithm'];

/** One run, plus the inputs it was made from so a later change reads as stale. */
export interface RunView {
  /** `auto` is derived from the current inputs; the other two come from a button. */
  source: 'auto' | 'all' | 'single';
  /** Molfile and options the run was made from. */
  key: string;
  result?: RunAutoLabelResult;
  error?: string;
}

/** The outcome of a run that either produced a result or threw. */
export interface RunOutcome {
  result?: RunAutoLabelResult;
  error?: string;
}

/** The outcome of parsing the shared molfile. */
export interface ParsedMolecule {
  molecule?: Molecule;
  error?: string;
}

/** `'existence'` is absent on purpose: it reports a hit but applies no label. */
export const ALGORITHMS: Algorithm[] = [
  'firstMatch',
  'separated',
  'overlapping',
  'rigorous',
  'unique',
];

/** Why the library sticks to `separated`, and what the other modes cost. */
export const ALGORITHM_HELP =
  '`autoLabel` uses `separated` because it is the only mode that guarantees non-overlapping matches. On a cholestane skeleton the `Pregnane` entry labels 21 atoms under `separated` but 22 under `overlapping` / `rigorous` / `unique`, giving two atoms the same locant `21`.';

/** The single most confusing behaviour of the database, in plain words. */
export const NO_MATCH_TEXT =
  'every steroid and triterpene template is drawn fully saturated and `SSSearcher` requires an exact bond order, so real cholesterol (Δ5) and any Δ4 / 3-keto steroid get zero labels. Try `5α-cholestan-3β-ol` from the presets to see the difference.';

/**
 * Identifies the run the current inputs would produce, so a stored result can be
 * told apart from a stale one.
 * @param molfile - the settled molfile
 * @param options - the current algorithm and affixes
 * @returns an opaque key
 */
export function makeRunKey(
  molfile: string,
  options: RunAutoLabelOptions,
): string {
  return JSON.stringify([
    molfile,
    options.algorithm,
    options.prefix,
    options.suffix,
  ]);
}

/**
 * Tells a parse failure apart from a failed run.
 * @param parsed - the outcome of parsing the shared molfile
 * @param view - the run currently on screen, if any
 * @returns the callout to show, or `undefined` when nothing failed
 */
export function describeFailure(
  parsed: ParsedMolecule,
  view: RunView | undefined,
): { title: string; message: string } | undefined {
  if (parsed.error) {
    return { title: 'Cannot parse the molecule', message: parsed.error };
  }
  if (view?.error) return { title: 'The run threw', message: view.error };
  return undefined;
}

/**
 * Names the block listing the entries a run matched but did not use.
 * @param winnerIndex - the winning entry, or `undefined` when nothing matched
 * @returns the heading
 */
export function shadowedHeading(winnerIndex: number | undefined): string {
  return winnerIndex === undefined
    ? 'matched as substructures, but labelled nothing'
    : 'also matched, but never reached';
}

/**
 * Describes how much of the database a run walked.
 * @param single - whether a single entry was applied
 * @param triedEntries - how many entries were tried
 * @returns the sentence shown on the winner card
 */
export function describeTried(single: boolean, triedEntries: number): string {
  return single
    ? 'this entry only'
    : `tried ${triedEntries} of ${AUTO_LABEL_ENTRIES.length} entries`;
}

/**
 * Looks an entry up by its database index.
 * @param index - position in `autoLabelDatabase`, or `undefined`
 * @returns the entry, or `undefined` when there is none
 */
export function findEntry(
  index: number | undefined,
): AutoLabelEntry | undefined {
  if (index === undefined) return undefined;
  return AUTO_LABEL_ENTRIES.find((entry) => entry.index === index);
}

/**
 * Parses the shared molfile into a molecule.
 * @param molfile - the V2000 molfile of the shared input
 * @returns the molecule, an error message, or neither when no structure is drawn
 */
export function parseMolecule(molfile: string): ParsedMolecule {
  if (!molfile.trim()) return {};
  try {
    const molecule = Molecule.fromMolfile(molfile);
    // An empty editor still emits a molfile, it simply has no atom.
    if (molecule.getAllAtoms() === 0) return {};
    return { molecule };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

/**
 * Runs the whole database, or a single entry, without ever letting a throw
 * reach the render tree.
 * @param molecule - the user's molecule; it is never modified
 * @param options - algorithm and affixes forwarded to `applyFragmentLabels`
 * @param entryIndex - when given, only that entry is applied
 * @returns the result, or the message of whatever was thrown
 */
export function execute(
  molecule: Molecule,
  options: RunAutoLabelOptions,
  entryIndex?: number,
): RunOutcome {
  try {
    const result =
      entryIndex === undefined
        ? runAutoLabel(molecule, options)
        : runSingleEntry(molecule, entryIndex, options);
    return { result };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}
