import { Molecule } from 'openchemlib';

import type {
  DiaIDAndInfo,
  GroupedDiaID,
  TopicMolecule,
} from '../../src/topic/TopicMolecule.ts';

import { classifyTopicity, getSiblingHydrogens } from './topicity.ts';
import type {
  AtomRow,
  GroupRow,
  MolfileSnapshot,
  MolfileVersions,
  StereoBondRow,
} from './types.ts';

/** Everything `buildAtomRows` needs; every array is indexed by `moleculeWithH` atom. */
export interface AtomRowsInput {
  moleculeWithH: Molecule;
  atomCountMolecule: number;
  symRanks: number[];
  finalRanks: number[];
  diaIDs: string[];
  enantioIDs: string[];
  prochiralities: Array<'r' | 's' | undefined>;
  diaIDsAndInfo: DiaIDAndInfo[];
  hoseCodes: string[][] | undefined;
}

/** The two atom-indexed arrays a group row needs, plus the drawn-space grouping. */
export interface GroupRowsContext {
  diaIDsObject: Record<string, GroupedDiaID>;
  prochiralities: Array<'r' | 's' | undefined>;
  enantioIDs: string[];
}

/**
 * Builds one atom-table row per `moleculeWithH` atom. Must run before
 * `setProchiralHydrogenLabels`, which renumbers the labelled hydrogens; the labels are
 * filled in afterwards by `applyCustomLabels`.
 * @param input - the molecule and every atom-indexed array read from the `TopicMolecule`
 * @returns one row per atom of `moleculeWithH`
 */
export function buildAtomRows(input: AtomRowsInput): AtomRow[] {
  const {
    moleculeWithH,
    atomCountMolecule,
    symRanks,
    finalRanks,
    diaIDs,
    enantioIDs,
    prochiralities,
    diaIDsAndInfo,
    hoseCodes,
  } = input;
  const atomCount = moleculeWithH.getAllAtoms();
  const rows: AtomRow[] = [];
  for (let atom = 0; atom < atomCount; atom++) {
    const siblings = getSiblingHydrogens(moleculeWithH, atom);
    const isHydrogen = moleculeWithH.getAtomicNo(atom) === 1;
    const parent =
      isHydrogen && moleculeWithH.getAllConnAtoms(atom) > 0
        ? moleculeWithH.getConnAtom(atom, 0)
        : undefined;
    const info: DiaIDAndInfo | undefined = diaIDsAndInfo[atom];
    const diaID: string | undefined = diaIDs[atom];
    const enantioID: string | undefined = enantioIDs[atom];
    rows.push({
      atom,
      atomLabel: moleculeWithH.getAtomLabel(atom),
      inMolecule: atom < atomCountMolecule,
      parent,
      siblings,
      symRank: symRanks[atom],
      finalRank: finalRanks[atom],
      diaID,
      enantioID,
      diaDiffersFromEnantio:
        diaID !== undefined && enantioID !== undefined && diaID !== enantioID,
      topicity: classifyTopicity(atom, siblings, diaIDs, enantioIDs),
      prochirality: prochiralities[atom],
      labelled: false,
      customLabel: null,
      nbEquivalentAtoms: info?.nbEquivalentAtoms,
      attachedHydrogens: info?.attachedHydrogens,
      mapNo: moleculeWithH.getAtomMapNo(atom),
      hoseCodes: hoseCodes?.[atom],
    });
  }
  return rows;
}

/**
 * Copies the custom labels of `moleculeWithH` onto rows built before the labelling.
 * `getAtomCustomLabel` reads no helper array, so the atom order is still the one the
 * rows were built in; it must be called before anything ensures the helper arrays.
 * @param rows - the rows to complete, mutated in place
 * @param moleculeWithH - the molecule `setProchiralHydrogenLabels` has just labelled
 * @returns the number of labelled atoms
 */
export function applyCustomLabels(
  rows: AtomRow[],
  moleculeWithH: Molecule,
): number {
  let labelled = 0;
  for (const row of rows) {
    const customLabel = moleculeWithH.getAtomCustomLabel(row.atom);
    row.customLabel = customLabel;
    row.labelled = Boolean(customLabel);
    if (customLabel) labelled++;
  }
  return labelled;
}

/**
 * Merges the two grouping APIs into one row per distinct diaID.
 * `existingAtoms` comes from `getDiaIDsObject()` (drawn-molecule space) and
 * `groupedExistingAtoms` from `getGroupedDiastereotopicAtomIDs()` (`moleculeWithH` space).
 * @param entries - the output of `getGroupedDiastereotopicAtomIDs`
 * @param context - the `getDiaIDsObject()` record and the atom-indexed arrays
 * @returns one row per group
 */
export function buildGroupRows(
  entries: GroupedDiaID[],
  context: GroupRowsContext,
): GroupRow[] {
  const rows: GroupRow[] = [];
  for (const entry of entries) {
    const drawn: GroupedDiaID | undefined = context.diaIDsObject[entry.oclID];
    const prochiralities: Array<'r' | 's' | undefined> = [];
    const enantioIDs = new Set<string>();
    let hasR = false;
    let hasS = false;
    for (const atom of entry.atoms) {
      const prochirality = context.prochiralities[atom];
      prochiralities.push(prochirality);
      if (prochirality === 'r') hasR = true;
      if (prochirality === 's') hasS = true;
      const enantioID: string | undefined = context.enantioIDs[atom];
      if (enantioID !== undefined) enantioIDs.add(enantioID);
    }
    rows.push({
      oclID: entry.oclID,
      atomLabel: entry.atomLabel,
      counter: entry.counter,
      atoms: entry.atoms,
      existingAtoms: drawn?.existingAtoms ?? [],
      groupedExistingAtoms: entry.existingAtoms,
      heavyAtoms: entry.heavyAtoms,
      attachedHydrogens: entry.attachedHydrogens,
      customLabels: entry.customLabels,
      heavyAtomsCustomLabels: entry.heavyAtomsCustomLabels,
      attachedHydrogensCustomLabels: entry.attachedHydrogensCustomLabels,
      prochiralities,
      distinctEnantioIDs: enantioIDs.size,
      mixedProchirality: hasR && hasS,
    });
  }
  return rows;
}

/** One wedge or hash bond, before the `ensureHeterotopicChiralBonds` diff is applied. */
export interface StereoBond {
  bond: number;
  atom1: number;
  atom2: number;
  type: 'up' | 'down';
}

/**
 * Collects every wedge (`cBondTypeUp`) or hash (`cBondTypeDown`) bond of a molecule.
 * @param molecule - the molecule to scan; it is only read
 * @returns one entry per stereo bond, in bond order
 */
export function collectStereoBonds(molecule: Molecule): StereoBond[] {
  const stereoBonds: StereoBond[] = [];
  const bondCount = molecule.getAllBonds();
  for (let bond = 0; bond < bondCount; bond++) {
    const type = molecule.getBondType(bond);
    if (type !== Molecule.cBondTypeUp && type !== Molecule.cBondTypeDown) {
      continue;
    }
    stereoBonds.push({
      bond,
      atom1: molecule.getBondAtom(0, bond),
      atom2: molecule.getBondAtom(1, bond),
      type: type === Molecule.cBondTypeUp ? 'up' : 'down',
    });
  }
  return stereoBonds;
}

/**
 * Takes the three molfiles of a `TopicMolecule` in both versions, without ever
 * mutating it.
 * @param topicMolecule - the analysed molecule
 * @returns the six molfile strings
 */
export function snapshotMolfiles(
  topicMolecule: TopicMolecule,
): MolfileSnapshot {
  return {
    molecule: molfileVersions(topicMolecule.getMolecule()),
    moleculeWithH: molfileVersions(topicMolecule.moleculeWithH),
    moleculeWithoutH: {
      v2000: topicMolecule.toMolfileWithoutH({ version: 2 }),
      v3000: topicMolecule.toMolfileWithoutH({ version: 3 }),
    },
  };
}

// toMolfileV3() ensures the helper arrays, which reorders a labelled molecule.
function molfileVersions(molecule: Molecule): MolfileVersions {
  return {
    v2000: molecule.getCompactCopy().toMolfile(),
    v3000: molecule.getCompactCopy().toMolfileV3(),
  };
}

/**
 * Lists the stereo bonds of `moleculeWithH` and marks the ones
 * `ensureHeterotopicChiralBonds` invented, comparing against the drawn structure.
 * @param molfile - the molfile the analysis started from
 * @param moleculeWithH - the hydrogen-expanded molecule of the `TopicMolecule`
 * @returns one row per stereo bond of `moleculeWithH`
 */
export function diffStereoBonds(
  molfile: string,
  moleculeWithH: Molecule,
): StereoBondRow[] {
  const reference = Molecule.fromMolfile(molfile).getCompactCopy();
  reference.addImplicitHydrogens();
  const before = collectStereoBonds(reference);
  const cip = moleculeWithH.getCompactCopy();
  cip.ensureHelperArrays(Molecule.cHelperCIP);
  return collectStereoBonds(moleculeWithH).map((stereoBond) => ({
    ...stereoBond,
    addedByEnsure: !before.some(
      (other) =>
        (other.atom1 === stereoBond.atom1 &&
          other.atom2 === stereoBond.atom2) ||
        (other.atom1 === stereoBond.atom2 && other.atom2 === stereoBond.atom1),
    ),
    atom1Parity: moleculeWithH.getAtomParity(stereoBond.atom1),
    atom1EsrType: moleculeWithH.getAtomESRType(stereoBond.atom1),
    atom1CipParity: cip.getAtomCIPParity(stereoBond.atom1),
  }));
}
