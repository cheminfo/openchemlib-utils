import type { Molecule } from 'openchemlib';

import type { TopicMolecule } from '../../src/topic/TopicMolecule.ts';

import type { Topicity } from './topicity.ts';

/** Which family of hydrogens the structure highlights when nothing is hovered or selected. */
export type HighlightMode =
  'none' | 'diastereotopic' | 'enantiotopic' | 'prochiral';

/** The ten controls of the options bar. The whole object is replaced on every change. */
export interface DiastereotopicOptionsState {
  /**
   * Maximum path length `TopicMolecule` explores between two atoms, 1 to 8.
   * @default 5
   */
  maxPathLength: number;

  /**
   * Above this atom count in `moleculeWithH` the library refuses to evaluate
   * heterotopicity and returns empty ID arrays, 1 to 5000.
   * @default 250
   */
  maxNbAtoms: number;

  /**
   * First HOSE sphere kept, 0 to 8.
   * @default 0
   */
  minSphereSize: number;

  /**
   * Last HOSE sphere kept, 0 to 8; `hoseCodes[i].length === maxSphereSize - minSphereSize + 1`.
   * @default 4
   */
  maxSphereSize: number;

  /**
   * Passed to `setProchiralHydrogenLabels`; when false only diastereotopic hydrogens are labelled.
   * @default false
   */
  includeEnantiotopic: boolean;

  /**
   * Render `moleculeWithH` instead of the hydrogen-collapsed `molecule`.
   * @default true
   */
  showHydrogens: boolean;

  /**
   * Print the atom index next to every atom of the rendered structure.
   * @default true
   */
  showAtomNumber: boolean;

  /**
   * Read the `hoseCodes` getter; it costs about as much as `diaIDs` again and has
   * no `maxNbAtoms` guard.
   * @default false
   */
  computeHoseCodes: boolean;

  /**
   * Recompute as soon as the structure or an option changes.
   * @default true
   */
  autoCompute: boolean;

  /**
   * Base highlight set of the annotated structure.
   * @default 'diastereotopic'
   */
  highlightMode: HighlightMode;
}

/** The defaults of every control of the options bar. */
export const DEFAULT_DIASTEREOTOPIC_OPTIONS: DiastereotopicOptionsState = {
  maxPathLength: 5,
  maxNbAtoms: 250,
  minSphereSize: 0,
  maxSphereSize: 4,
  includeEnantiotopic: false,
  showHydrogens: true,
  showAtomNumber: true,
  computeHoseCodes: false,
  autoCompute: true,
  highlightMode: 'diastereotopic',
};

/** One row of the atom table; every index is a `moleculeWithH` index. */
export interface AtomRow {
  atom: number;
  atomLabel: string;
  /** `false` when the atom only exists in `moleculeWithH` (an implicit hydrogen). */
  inMolecule: boolean;
  /** Heavy atom bearing this hydrogen, `undefined` for a heavy atom. */
  parent: number | undefined;
  /** Other hydrogens borne by `parent`. */
  siblings: number[];
  /** 1-based OCL symmetry rank; equal ranks mean topologically identical atoms. */
  symRank: number | undefined;
  /** 0-based and unique; the index into the private `canonizedDiaIDs`. */
  finalRank: number | undefined;
  diaID: string | undefined;
  enantioID: string | undefined;
  /** `true` when this environment is chirality-sensitive. */
  diaDiffersFromEnantio: boolean;
  topicity: Topicity;
  prochirality: 'r' | 's' | undefined;
  /** `Boolean(getAtomCustomLabel(atom))` after `setProchiralHydrogenLabels`. */
  labelled: boolean;
  /** Raw custom label, leading `]` kept — the superscript marker is information. */
  customLabel: string | null;
  nbEquivalentAtoms: number | undefined;
  attachedHydrogens: number[] | undefined;
  mapNo: number;
  /** One idCode per sphere from `minSphereSize` to `maxSphereSize`. */
  hoseCodes: string[] | undefined;
}

/** One row of the group table; one per distinct diaID. */
export interface GroupRow {
  oclID: string;
  atomLabel: string;
  counter: number;
  /** `moleculeWithH` indices. */
  atoms: number[];
  /** `existingAtoms` of `getDiaIDsObject()` — drawn-molecule space. */
  existingAtoms: number[];
  /** `existingAtoms` of `getGroupedDiastereotopicAtomIDs()` — `moleculeWithH` space. */
  groupedExistingAtoms: number[];
  heavyAtoms: number[];
  attachedHydrogens: number[];
  customLabels: string[];
  heavyAtomsCustomLabels: string[];
  attachedHydrogensCustomLabels: string[];
  prochiralities: Array<'r' | 's' | undefined>;
  /** Number of distinct `enantioIDs` inside the group. */
  distinctEnantioIDs: number;
  /** `true` when the group holds both `r` and `s`; this should never happen. */
  mixedProchirality: boolean;
}

/** One stereo bond of `moleculeWithH`, with its state before `ensureHeterotopicChiralBonds`. */
export interface StereoBondRow {
  bond: number;
  atom1: number;
  atom2: number;
  type: 'up' | 'down';
  /** The `(atom1, atom2)` pair carried no stereo bond before `ensureHeterotopicChiralBonds`. */
  addedByEnsure: boolean;
  atom1Parity: number;
  atom1EsrType: number;
  atom1CipParity: number;
}

/** One measured step of the analysis. */
export interface TimingEntry {
  step: string;
  ms: number;
}

/** One message the library sent to the injected `FifoLogger`. */
export interface LogEntry {
  level: string;
  message: string;
}

/** A molfile in both supported versions. */
export interface MolfileVersions {
  v2000: string;
  v3000: string;
}

/** The three molfiles of a `TopicMolecule`, taken at one point in time. */
export interface MolfileSnapshot {
  molecule: MolfileVersions;
  moleculeWithH: MolfileVersions;
  moleculeWithoutH: MolfileVersions;
}

/** The counts of the summary line. */
export interface DiastereotopicSummary {
  atomCountMolecule: number;
  atomCountMoleculeWithH: number;
  distinctDiaIDs: number;
  distinctEnantioIDs: number;
  groupCount: number;
  prochiralHydrogens: number;
  diastereotopicHydrogens: number;
  enantiotopicHydrogens: number;
  labelledCount: number;
}

/** Nothing to analyse — the shared input is empty. */
export interface DiastereotopicEmpty {
  kind: 'empty';
}

/** A library call threw; `step` names the label that failed. */
export interface DiastereotopicError {
  kind: 'error';
  step: string;
  message: string;
  stack: string | undefined;
}

/** Everything the panels of the diastereotopic tab need. */
export interface DiastereotopicOk {
  kind: 'ok';
  /** Kept so the HOSE panel can run `getHoseCodesForPath` on demand. */
  topicMolecule: TopicMolecule;
  molecule: Molecule;
  moleculeWithH: Molecule;
  /** A `getCompactCopy()` — `SvgRenderer` memoizes on molecule identity. */
  moleculeForDisplay: Molecule;
  rows: AtomRow[];
  groups: GroupRow[];
  /** `getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' })`, the NMR-relevant view. */
  hydrogenGroups: GroupRow[];
  stereoBonds: StereoBondRow[];
  chiralOrHeterotopicCarbons: number[];
  chiralCarbonsError: string | undefined;
  distanceMatrix: number[][];
  hoseCodes: string[][] | undefined;
  /** Sphere numbers covered by `hoseCodes`, from `minSphereSize` to `maxSphereSize`. */
  spheres: number[];
  molfilesBefore: MolfileSnapshot;
  molfilesAfter: MolfileSnapshot;
  /** `moleculeWithH.getAllAtoms() > maxNbAtoms`; every ID array came back empty. */
  overMaxNbAtoms: boolean;
  summary: DiastereotopicSummary;
  timings: TimingEntry[];
  logs: LogEntry[];
}

/** The three states `computeDiastereotopic` can return. */
export type DiastereotopicResult =
  DiastereotopicEmpty | DiastereotopicError | DiastereotopicOk;
