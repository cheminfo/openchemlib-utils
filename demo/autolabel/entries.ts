import { Molecule } from 'openchemlib';

import { autoLabelDatabase } from '../../src/util/autoLabelDatabase.ts';
import { errorMessage } from '../components/errorMessage.ts';

import { ENTRY_FAMILIES, FALLBACK_FAMILY } from './families.ts';

/** How the custom labels of an entry are shown in the detail depiction. */
export type EntryLabelMode = 'stored' | 'normalised' | 'hidden';

export interface AutoLabelEntry {
  /** Position in `autoLabelDatabase` — this is the autoLabel priority, 0 wins first. */
  index: number;
  label: string;
  /** Hard-coded from the template folder; not stored in the database itself. */
  family: string;
  /** As shipped — computed BEFORE `setFragment(true)`, so it includes hydrogens. */
  mf: string;
  mw: number;
  idCode: string;
  coordinates: string;
  /** `Molecule.fromIDCode(idCode, false)` — the search fragment. Never mutate. */
  fragment: Molecule;
  /** `fromIDCode(idCode, coordinates)` + `removeQueryFeatures()` + `setFragment(false)`. Never mutate. */
  target: Molecule;
  atomCount: number;
  labelledAtomCount: number;
  /** Raw `getAtomCustomLabel(i)` per atom, `null` where unlabelled. */
  rawLabels: Array<string | null>;
  /** `]`-stripped, space-trimmed, primes normalised to U+0027. */
  normalizedLabels: string[];
  /** Lowercased `label + ' ' + mf + ' ' + normalizedLabels.join(' ')`. */
  searchText: string;
  hasQueryFeatures: boolean;
  ringCount: number;
}

/** An entry of `autoLabelDatabase` that could not be decoded at module load. */
export interface AutoLabelEntryError {
  index: number;
  label: string;
  message: string;
}

const ENTRY_ERRORS: AutoLabelEntryError[] = [];

/** The whole database, decoded once at module load, in autoLabel priority order. */
export const AUTO_LABEL_ENTRIES: AutoLabelEntry[] = buildEntries();

/** Entries that failed to decode; empty with the database as shipped. */
export const AUTO_LABEL_ENTRY_ERRORS: AutoLabelEntryError[] = ENTRY_ERRORS;

/** Every distinct family present in the database, sorted alphabetically. */
export const AUTO_LABEL_FAMILIES: string[] = [
  ...new Set(AUTO_LABEL_ENTRIES.map((entry) => entry.family)),
].toSorted();

/** Smallest and largest molecular weight over the whole database. */
export const MW_RANGE: { min: number; max: number } = getMwRange();

/**
 * Strips the OCL superscript marker and normalises the two prime characters the
 * database mixes, so a search box matches `1'` and `]1′` alike.
 * @param raw - a raw `getAtomCustomLabel` value
 * @returns the normalised label
 */
export function normalizeLabel(raw: string): string {
  return raw
    .replace(/^\]/, '')
    .replaceAll('′', "'")
    .replaceAll('″', "''")
    .trim();
}

/**
 * Returns the molecule to depict for an entry under the requested label mode.
 * The result is cached per entry and mode; `entry.target` is never mutated.
 * @param entry - the entry to depict
 * @param mode - how its custom labels should be shown
 * @returns a molecule that must not be mutated by the caller
 */
export function getEntryDisplayMolecule(
  entry: AutoLabelEntry,
  mode: EntryLabelMode,
): Molecule {
  if (mode === 'stored') return entry.target;
  const key = `${entry.index}:${mode}`;
  const cached = displayCache.get(key);
  if (cached) return cached;
  const molecule = entry.target.getCompactCopy();
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    const raw = entry.rawLabels[atom];
    if (mode === 'hidden') {
      molecule.setAtomCustomLabel(atom, null);
    } else if (raw) {
      molecule.setAtomCustomLabel(atom, normalizeLabel(raw));
    }
  }
  displayCache.set(key, molecule);
  return molecule;
}

const displayCache = new Map<string, Molecule>();

function buildEntries(): AutoLabelEntry[] {
  const entries: AutoLabelEntry[] = [];
  for (let index = 0; index < autoLabelDatabase.length; index++) {
    const shipped = autoLabelDatabase[index];
    try {
      entries.push(buildEntry(index, shipped));
    } catch (error) {
      ENTRY_ERRORS.push({
        index,
        label: shipped.label,
        message: errorMessage(error),
      });
    }
  }
  return entries;
}

function buildEntry(
  index: number,
  shipped: (typeof autoLabelDatabase)[number],
): AutoLabelEntry {
  const fragment = Molecule.fromIDCode(shipped.idCode, false);
  const hasQueryFeatures = detectQueryFeatures(fragment);

  const target = Molecule.fromIDCode(shipped.idCode, shipped.coordinates);
  target.removeQueryFeatures();
  target.setFragment(false);
  target.ensureHelperArrays(Molecule.cHelperRings);

  const atomCount = target.getAllAtoms();
  const rawLabels = new Array<string | null>(atomCount);
  const normalizedLabels: string[] = [];
  for (let atom = 0; atom < atomCount; atom++) {
    const raw = target.getAtomCustomLabel(atom);
    rawLabels[atom] = raw;
    if (raw) normalizedLabels.push(normalizeLabel(raw));
  }

  return {
    index,
    label: shipped.label,
    family: ENTRY_FAMILIES[shipped.label] ?? FALLBACK_FAMILY,
    mf: shipped.mf,
    mw: shipped.mw,
    idCode: shipped.idCode,
    coordinates: shipped.coordinates,
    fragment,
    target,
    atomCount,
    labelledAtomCount: normalizedLabels.length,
    rawLabels,
    normalizedLabels,
    searchText:
      `${shipped.label} ${shipped.mf} ${normalizedLabels.join(' ')}`.toLowerCase(),
    hasQueryFeatures,
    ringCount: target.getRingSet().getSize(),
  };
}

function detectQueryFeatures(molecule: Molecule): boolean {
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    const features = molecule.getAtomQueryFeaturesObject(atom);
    for (const value of Object.values(features)) {
      if (value) return true;
    }
  }
  return false;
}

function getMwRange(): { min: number; max: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const { mw } of AUTO_LABEL_ENTRIES) {
    if (mw < min) min = mw;
    if (mw > max) max = mw;
  }
  return { min, max };
}
