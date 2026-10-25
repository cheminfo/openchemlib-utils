import { Molecule } from 'openchemlib';

import type { PairPreset } from './pairPresets.ts';

export type PairSide = 'correct' | 'proposed';

/** One of the two editors. */
export interface EditorState {
  /** molfile the editor was last mounted with */
  initial: string;
  /** molfile currently drawn */
  current: string;
  /** bumped on every load from outside the editor, which remounts it */
  revision: number;
}

export type PairState = Record<PairSide, EditorState>;

/**
 * Builds the state of both editors from a preset pair.
 * @param preset - the pair to load
 * @param previous - the state it replaces, so both editors remount
 * @returns the new state
 */
export function loadPreset(
  preset: PairPreset,
  previous?: PairState,
): PairState {
  return {
    correct: loaded(smilesToMolfile(preset.correct), previous?.correct),
    proposed: loaded(smilesToMolfile(preset.proposed), previous?.proposed),
  };
}

/**
 * Loads a structure into one editor from outside it (paste, preset).
 * @param pair - the current state
 * @param side - the editor to load
 * @param molfile - the structure to load
 * @returns the new state
 */
export function loadSide(
  pair: PairState,
  side: PairSide,
  molfile: string,
): PairState {
  return { ...pair, [side]: loaded(molfile, pair[side]) };
}

/**
 * Records what the user drew, without remounting the editor under the pen.
 * @param pair - the current state
 * @param side - the editor drawn in
 * @param molfile - the drawn structure
 * @returns the new state
 */
export function drawSide(
  pair: PairState,
  side: PairSide,
  molfile: string,
): PairState {
  return { ...pair, [side]: { ...pair[side], current: molfile } };
}

/**
 * Exchanges the correct and the proposed structures.
 * @param pair - the current state
 * @returns the new state, with both editors remounted
 */
export function swapSides(pair: PairState): PairState {
  return {
    correct: loaded(pair.proposed.current, pair.correct),
    proposed: loaded(pair.correct.current, pair.proposed),
  };
}

function loaded(molfile: string, previous?: EditorState): EditorState {
  return {
    initial: molfile,
    current: molfile,
    revision: (previous?.revision ?? 0) + 1,
  };
}

function smilesToMolfile(smiles: string): string {
  return Molecule.fromSmiles(smiles).toMolfile();
}
