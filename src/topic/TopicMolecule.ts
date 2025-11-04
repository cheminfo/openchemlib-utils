import type { LightLogger } from 'cheminfo-types';
import type { Molecule } from 'openchemlib';

import { getHoseCodesForAtomsAsFragments } from '../hose/getHoseCodesForAtomsAsFragments.js';
import type { AtomPath } from '../path/getAllAtomsPaths.ts';
import { getAllAtomsPaths } from '../path/getAllAtomsPaths.ts';
import { getConnectivityMatrix } from '../util/getConnectivityMatrix.js';

import type { HoseCodesOptions } from './HoseCodesOptions.js';
import { getCanonizedDiaIDs } from './getCanonizedDiaIDs.ts';
import { getCanonizedHoseCodes } from './getCanonizedHoseCodes.ts';
import type {
  HoseCodesForPathOptions,
  HosesForPath,
} from './getCanonizedHoseCodesForPaths.ts';
import { getCanonizedHoseCodesForPath } from './getCanonizedHoseCodesForPaths.ts';
import { getDiaIDsAndInfo } from './getDiaIDsAndInfo.ts';
import {
  getFinalRanks,
  getHeterotopicSymmetryRanks,
} from './getHeterotopicSymmetryRanks.ts';
import { getMoleculeWithH } from './getMoleculeWithH.ts';
import { getXMolecule } from './getXMolecule.ts';

interface ToMolfileOptions {
  version?: 2 | 3;
}

interface TopicMoleculeOptions extends HoseCodesOptions {
  /**
   * The maximum path length to consider when calculating the paths between atoms
   * @default 5
   */
  maxPathLength?: number;

  /**
   * The maximum number of atoms to consider when dealing with diastereotopicity
   */
  maxNbAtoms?: number;

  /**
   * The logger to use in order to retrieve some debug or warning information
   * @default console
   */
  logger?: LightLogger;
}

type TopicMoleculeInternalOptions = Omit<
  TopicMoleculeOptions,
  'maxPathLength' | 'maxNbAtoms' | 'logger'
> &
  Required<
    Pick<TopicMoleculeOptions, 'maxPathLength' | 'maxNbAtoms' | 'logger'>
  >;

interface GetAtomPathOptions {
  /*
   * The distance between the two atoms. If not specified, all the distances will be considered
   */
  pathLength?: number;
}

export interface GetAtomPathFromOptions {
  /*
   * The minimum distance between the two atoms.
   * @default 1
   */
  minPathLength?: number;
  /*
   * The maximum distance between the two atoms.
   * @default maxPathLength
   */
  maxPathLength?: number;
  /*
   * The atomic number of the final atom. By default we take all path
   */
  toAtomicNo?: number;
}

interface GetHoseFragmentOptions {
  /*
   * The sphere size around any selected atoms to consider. Default is 2
   */
  sphereSize?: number;

  /**
   * The atoms to tag in the fragment
   * @default rootAtoms
   */
  tagAtoms?: number[];

  /**
   * The function to tag the atoms in place !
   * @default tagAtom
   */
  tagAtomFct?: (molecule: Molecule, iAtom: number) => undefined;
}

/**
 * This class deals with topicity information and hose codes
 * It is optimized to avoid recalculation of the same information
 */
export class TopicMolecule {
  private readonly originalMolecule: Molecule;
  molecule: Molecule;
  idCode: string;
  options: TopicMoleculeInternalOptions;

  private cache: any;

  constructor(molecule: Molecule, options: TopicMoleculeOptions = {}) {
    this.originalMolecule = molecule;
    this.options = {
      maxPathLength: 5,
      maxNbAtoms: 250,
      logger: console,
      ...options,
    };
    this.idCode = molecule.getIDCode();
    this.molecule = this.originalMolecule.getCompactCopy();
    this.molecule.ensureHelperArrays(
      molecule.getOCL().Molecule.cHelperNeighbours,
    );
    this.molecule.ensureHelperArrays(
      this.molecule.getOCL().Molecule.cHelperNeighbours,
    );
    this.cache = {};
  }

  /**
   * This method ensures that all the atoms have a mapNo corresponding to the atom number.
   * It will enforce mapNo in molecule and moleculeWithH
   * We start numbering the atoms at 1
   */
  setAtomNoInMapNo() {
    const molecules = [this.molecule, this.moleculeWithH];
    for (const molecule of molecules) {
      for (let i = 0; i < molecule.getAllAtoms(); i++) {
        molecule.setAtomMapNo(i, i + 1, false);
      }
    }
  }

  /**
   * This method ensures that all the atoms have a mapNo in the molecule (and not the moleculeWithH! )
   */
  ensureMapNo() {
    const existingMapNo: Record<string, boolean> = {};
    for (let i = 0; i < this.molecule.getAllAtoms(); i++) {
      const mapNo = this.molecule.getAtomMapNo(i);
      if (mapNo) {
        if (existingMapNo[mapNo]) {
          throw new Error(
            'The molecule contains several atoms with the same mapNo',
          );
        }
        existingMapNo[mapNo] = true;
      }
    }
    let nextMapNo = 1;
    for (let i = 0; i < this.molecule.getAllAtoms(); i++) {
      const mapNo = this.molecule.getAtomMapNo(i);
      if (!mapNo) {
        while (existingMapNo[nextMapNo]) {
          nextMapNo++;
        }
        existingMapNo[nextMapNo] = true;
        this.molecule.setAtomMapNo(i, nextMapNo, false);
      }
    }
  }

  /**
   * For each atom we will return an array of objects that contains the
   * different possible path as well as the canonic hose codes
   * @param options
   * @returns
   */
  getHoseCodesForPath(options: HoseCodesForPathOptions = {}): HosesForPath[] {
    return getCanonizedHoseCodesForPath(this, options);
  }

  /**
   * Return one fragment for a specific sphere size and specific root atoms
   * @param rootAtoms
   * @param options
   * @returns
   */
  getHoseFragment(
    rootAtoms: number[],
    options: GetHoseFragmentOptions = {},
  ): Molecule {
    const { sphereSize = 2, tagAtoms = rootAtoms, tagAtomFct } = options;

    const fragments = getHoseCodesForAtomsAsFragments(this.moleculeWithH, {
      rootAtoms,
      minSphereSize: sphereSize,
      maxSphereSize: sphereSize,
      tagAtoms,
      tagAtomFct,
    });

    return fragments[0];
  }

  getAtomPathsFrom(atom: number, options: GetAtomPathFromOptions = {}) {
    const {
      minPathLength = 1,
      maxPathLength = this.options.maxPathLength,
      toAtomicNo,
    } = options;
    if (maxPathLength > this.options.maxPathLength) {
      throw new Error(
        'The maxPathLength is too long, you should increase the maxPathLength when instantiating the TopicMolecule',
      );
    }
    const atomPaths = this.atomsPaths[atom];
    if (!atomPaths) {
      throw new Error('Unexpected missing atom path');
    }
    const paths = [];
    for (let i = minPathLength; i <= maxPathLength; i++) {
      const atomPathValue = atomPaths[i];
      if (!atomPathValue) {
        throw new Error(`Unexpected missing atom path at index ${i}`);
      }
      for (const atomPath of atomPathValue) {
        if (
          !toAtomicNo ||
          this.moleculeWithH.getAtomicNo(atomPath.path.at(-1) as number) ===
            toAtomicNo
        ) {
          paths.push(atomPath.path);
        }
      }
    }
    return paths;
  }

  getAtomPaths(atom1: number, atom2: number, options: GetAtomPathOptions = {}) {
    const { pathLength } = options;
    if (pathLength !== undefined && pathLength > this.options.maxPathLength) {
      throw new Error(
        'The distance is too long, you should increase the maxPathLength when instantiating the TopicMolecule',
      );
    }
    const atomPaths = this.atomsPaths[atom1];
    if (!atomPaths) {
      throw new Error('Unexpected missing atom path');
    }
    const minDistance = pathLength || 0;
    const maxDistance = pathLength || this.options.maxPathLength;
    const paths = [];
    for (let i = minDistance; i <= maxDistance; i++) {
      const atomPathValue = atomPaths[i];
      if (!atomPathValue) {
        throw new Error(`Unexpected missing atom path at index ${i}`);
      }
      for (const atomPath of atomPathValue) {
        if (atomPath.path.at(-1) === atom2) {
          paths.push(atomPath.path);
        }
      }
    }
    return paths;
  }

  get atomsPaths(): AtomPath[][][] {
    if (this.cache.atomsPaths) return this.cache.atomsPaths;
    this.cache.atomsPaths = getAllAtomsPaths(this.moleculeWithH, {
      maxPathLength: this.options.maxPathLength,
    });
    return this.cache.atomsPaths;
  }

  toMolfile(options: ToMolfileOptions = {}): string {
    const { version = 2 } = options;
    if (version === 2) {
      return this.molecule.toMolfile();
    }
    return this.molecule.toMolfileV3();
  }

  getMolecule() {
    return this.molecule;
  }

  /**
   * Returns a new TopicMolecule but will copy precalculated information
   * if possible (same idCode). This is very practical when expanding hydrogens
   * for example.
   * @param molecule
   * @returns
   */
  fromMolecule(molecule: Molecule) {
    const idCode = molecule.getIDCode();
    if (idCode !== this.idCode) {
      // no way for optimisation
      return new TopicMolecule(molecule);
    }
    const topicMolecule = new TopicMolecule(molecule);
    topicMolecule.cache = {
      canonizedDiaIDs: this.cache.canonizedDiaIDs,
      canonizedHoseCodes: this.cache.canonizedHoseCodes,
    };
    return topicMolecule;
  }

  /**
   * Returns a molecule with all the hydrogens added. The order is NOT canonized
   */
  get moleculeWithH(): Molecule {
    if (this.cache.moleculeWithH) return this.cache.moleculeWithH;
    this.cache.moleculeWithH = getMoleculeWithH(this.molecule, {
      maxNbAtoms: this.options.maxNbAtoms,
      logger: this.options.logger,
    });
    return this.cache.moleculeWithH;
  }

  private get xMolecule(): Molecule {
    if (this.cache.xMolecule) return this.cache.xMolecule;
    this.cache.xMolecule = getXMolecule(this.moleculeWithH);
    return this.cache.xMolecule;
  }

  /**
   * This is related to the current moleculeWithH. The order is NOT canonized
   */
  get diaIDs(): string[] {
    if (this.cache.diaIDs) return this.cache.diaIDs;
    const diaIDs = [];
    if (this.moleculeWithH.getAllAtoms() > this.options.maxNbAtoms) {
      this.options.logger.warn(
        `too many atoms to evaluate heterotopicity: ${this.moleculeWithH.getAllAtoms()} > ${this.options.maxNbAtoms}`,
      );
    } else {
      for (let i = 0; i < this.moleculeWithH.getAllAtoms(); i++) {
        diaIDs.push(this.canonizedDiaIDs[this.finalRanks[i]]);
      }
    }
    this.cache.diaIDs = diaIDs;
    return diaIDs;
  }

  /**
   * We return the atomIDs corresponding to the specified diaID as well has the attached hydrogens or heavy atoms
   * @param diaID
   * @returns
   */
  getDiaIDsObject() {
    return groupDiastereotopicAtomIDsAsObject(
      this.diaIDs,
      this.molecule,
      this.moleculeWithH,
    );
  }

  /**
   * This is related to the current moleculeWithH. The order is NOT canonized
   */
  get hoseCodes() {
    if (this.cache.hoseCodes) return this.cache.hoseCodes;
    const hoseCodes = [];
    for (let i = 0; i < this.moleculeWithH.getAllAtoms(); i++) {
      hoseCodes.push(this.canonizedHoseCodes[this.finalRanks[i]]);
    }
    this.cache.hoseCodes = hoseCodes;
    return hoseCodes;
  }

  private get canonizedDiaIDs() {
    if (this.cache.canonizedDiaIDs) return this.cache.canonizedDiaIDs;
    this.cache.canonizedDiaIDs = getCanonizedDiaIDs(this, {
      maxNbAtoms: this.options.maxNbAtoms,
      logger: this.options.logger,
    });
    return this.cache.canonizedDiaIDs;
  }

  private get canonizedHoseCodes() {
    if (this.cache.canonizedHoseCodes) {
      return this.cache.canonizedHoseCodes;
    }
    this.cache.canonizedHoseCodes = getCanonizedHoseCodes(this);
    return this.cache.canonizedHoseCodes;
  }

  /**
   * Returns the distance matrix for the current moleculeWithH
   */
  get distanceMatrix() {
    return getConnectivityMatrix(this.moleculeWithH, { pathLength: true });
  }

  get diaIDsAndInfo(): DiaIDAndInfo[] {
    if (this.cache.diaIDsAndInfo) {
      return this.cache.diaIDsAndInfo;
    }
    this.cache.diaIDsAndInfo = getDiaIDsAndInfo(this, this.canonizedDiaIDs);
    return this.cache.diaIDsAndInfo;
  }

  /**
   * Returns symmetryRanks for all the atoms including hydrogens. Those ranks
   * deals with topicity and is related to the current moleculeWithH.
   * In order to calculate the ranks we replace all the
   * hydrogens with a X atom.
   */
  get heterotopicSymmetryRanks(): number[] {
    if (this.cache.heterotopicSymmetryRanks) {
      return this.cache.heterotopicSymmetryRanks;
    }
    this.cache.heterotopicSymmetryRanks = getHeterotopicSymmetryRanks(
      this.xMolecule,
    );
    return [...this.cache.heterotopicSymmetryRanks];
  }

  /**
   * Returns finalRanks for all the atoms including hydrogens. Those ranks
   * deals with topicity and is related to the current moleculeWithH.
   * All the atoms have a unique identifier.j
   * In order to calculate the ranks we replace all the
   * hydrogens with a X atom.
   */
  get finalRanks() {
    if (this.cache.finalRanks) return this.cache.finalRanks;
    this.cache.finalRanks = getFinalRanks(this.xMolecule);
    return this.cache.finalRanks;
  }

  toMolfileWithH(options: ToMolfileOptions = {}) {
    const { version = 2 } = options;
    if (version === 2) {
      return this.moleculeWithH.toMolfile();
    }
    return this.moleculeWithH.toMolfileV3();
  }

  toMolfileWithoutH(options: ToMolfileOptions = {}) {
    const molecule = this.molecule.getCompactCopy();
    molecule.ensureHelperArrays(molecule.getOCL().Molecule.cHelperNeighbours);
    const atomsToDelete = [];
    for (let atomID = 0; atomID < molecule.getAtoms(); atomID++) {
      if (molecule.getExplicitHydrogens(atomID) > 0) {
        for (let i = 0; i < molecule.getAllConnAtoms(atomID); i++) {
          const connectedAtom = molecule.getConnAtom(atomID, i);
          if (molecule.getAtomicNo(connectedAtom) === 1) {
            atomsToDelete.push(connectedAtom);
          }
        }
      }
    }
    molecule.deleteAtoms(atomsToDelete);

    const { version = 2 } = options;
    if (version === 2) {
      return molecule.toMolfile();
    }
    return molecule.toMolfileV3();
  }

  /**
   * Returns an array of objects containing the oclID and the corresponding hydrogens and atoms
   * for the specified atomLabel (if any)
   * This always applied to the molecule with expanded hydrogens and chirality
   * @param options
   * @returns
   */
  getGroupedDiastereotopicAtomIDs(options: GroupedDiaIDsOptions = {}) {
    if (!this.diaIDs) return undefined;
    return groupDiastereotopicAtomIDs(this.diaIDs, this.moleculeWithH, options);
  }

  /**
   * This method returns a mapping between the diaIDs of the current molecule.
   * It expects that the initial molfile and the final molfile contains atomMapNo
   * in order to track which atom becomes which one.
   * @param molecule
   */
  getDiaIDsMapping(molecule: Molecule) {
    const topicMolecule = new TopicMolecule(molecule);

    const originalDiaIDs = this.diaIDsAndInfo.filter(
      (diaID) => diaID.atomMapNo,
    );
    const destinationDiaIDs = topicMolecule.diaIDsAndInfo.filter(
      (diaID) => diaID.atomMapNo,
    );

    const mapping: Record<string, string | undefined> = {};
    // we first check all the atoms present in the molfile
    for (const destinationDiaID of destinationDiaIDs) {
      const originalDiaID = originalDiaIDs.find(
        (diaID) => diaID.atomMapNo === destinationDiaID.atomMapNo,
      ) as DiaIDAndInfo;
      const newIDCode = destinationDiaID.idCode;
      const oldIDCode = originalDiaID.idCode;
      if (oldIDCode in mapping) {
        if (mapping[oldIDCode] !== newIDCode) {
          mapping[oldIDCode] = undefined;
        }
      } else {
        mapping[oldIDCode] = newIDCode;
      }
    }

    // we now check all the attached hydrogens that are not defined in the molfile and were not yet mapped
    for (const destinationDiaID of destinationDiaIDs) {
      const originalDiaID = originalDiaIDs.find(
        (diaID) => diaID.atomMapNo === destinationDiaID.atomMapNo,
      ) as DiaIDAndInfo;
      for (let i = 0; i < originalDiaID.attachedHydrogensIDCodes.length; i++) {
        const oldHydrogenIDCode = originalDiaID.attachedHydrogensIDCodes.at(
          i,
        ) as string;
        if (mapping[oldHydrogenIDCode]) continue;
        const newHydrogenIDCode = destinationDiaID.attachedHydrogensIDCodes[i];
        if (oldHydrogenIDCode && newHydrogenIDCode) {
          if (oldHydrogenIDCode in mapping) {
            if (mapping[oldHydrogenIDCode] !== newHydrogenIDCode) {
              mapping[oldHydrogenIDCode] = undefined;
            }
          } else {
            mapping[oldHydrogenIDCode] = newHydrogenIDCode;
          }
        }
      }
    }
    return mapping;
  }
}

export interface DiaIDAndInfo {
  idCode: string;
  attachedHydrogensIDCodes: string[];
  attachedHydrogens: number[];
  nbAttachedHydrogens: number;
  atomLabel: string;
  nbEquivalentAtoms: number;
  heavyAtom: string | undefined;
  atomMapNo: number | undefined;
}

export interface GroupedDiaIDsOptions {
  atomLabel?: string;
}

export interface GroupedDiaID {
  counter: number;
  /*
   * Number of atoms with the same diaID.
   */
  /**
   * Diastereotopic ID of the group
   */
  oclID: string;
  /**
   * Atom label (C, N, O, etc.)
   */
  atomLabel: string;
  /*
   * List of atom numbers with the same diaID
   */
  atoms: number[];
  /**
   * List of atom numbers existing in the molecule. In case of implicit hydrogens we will fallback
   * to the linked heavy atom
   */
  existingAtoms: number[];
  /**
   * List of connected heavy atoms in the case of hydrogens
   */
  heavyAtoms: number[];
  /**
   * Lists of connected hydrogens in the case of heavy atoms
   */
  attachedHydrogens: number[];
  /**
   * List of custom labels found for the atoms in the group
   */
  customLabels: string[];
  /**
   * In the case of heavy atoms, list of custom labels found for the attached hydrogens in the group
   */
  attachedHydrogensCustomLabels: string[];
  /**
   * In the case of hydrogens, list of custom labels found for the connected heavy atoms in the group
   */
  heavyAtomsCustomLabels: string[];
}

export function groupDiastereotopicAtomIDs(
  diaIDs: string[],
  molecule: Molecule,
  options: GroupedDiaIDsOptions = {},
): GroupedDiaID[] {
  const diaIDsObject = groupDiastereotopicAtomIDsAsObject(
    diaIDs,
    molecule,
    molecule,
    options,
  );
  return Object.values(diaIDsObject);
}

function groupDiastereotopicAtomIDsAsObject(
  diaIDs: string[],
  molecule: Molecule,
  moleculeWithH: Molecule,
  options: GroupedDiaIDsOptions = {},
): Record<string, GroupedDiaID> {
  const { atomLabel } = options;
  const diaIDsObject: Record<string, GroupedDiaID> = {};

  for (let i = 0; i < diaIDs.length; i++) {
    if (!atomLabel || moleculeWithH.getAtomLabel(i) === atomLabel) {
      const diaID = diaIDs[i];
      if (!diaIDsObject[diaID]) {
        diaIDsObject[diaID] = {
          counter: 0,
          oclID: diaID,
          atomLabel: moleculeWithH.getAtomLabel(i),
          atoms: [],
          existingAtoms: [],
          heavyAtoms: [],
          attachedHydrogens: [],
          customLabels: [],
          attachedHydrogensCustomLabels: [],
          heavyAtomsCustomLabels: [],
        };
      }

      const customLabel = moleculeWithH.getAtomCustomLabel(i);
      if (
        customLabel &&
        !diaIDsObject[diaID].customLabels.includes(customLabel)
      ) {
        diaIDsObject[diaID].customLabels.push(customLabel);
      }
      if (moleculeWithH.getAtomicNo(i) === 1) {
        const connected = moleculeWithH.getConnAtom(i, 0);
        if (!diaIDsObject[diaID].heavyAtoms.includes(connected)) {
          diaIDsObject[diaID].heavyAtoms.push(connected);
        }
        const heavyAtomCustomLabel = molecule.getAtomCustomLabel(connected);
        if (
          heavyAtomCustomLabel &&
          !diaIDsObject[diaID].heavyAtomsCustomLabels.includes(
            heavyAtomCustomLabel,
          )
        ) {
          diaIDsObject[diaID].heavyAtomsCustomLabels.push(heavyAtomCustomLabel);
        }
        if (molecule.getAtomicNo(i)) {
          diaIDsObject[diaID].existingAtoms.push(i);
        } else if (!diaIDsObject[diaID].existingAtoms.includes(connected)) {
          diaIDsObject[diaID].existingAtoms.push(connected);
        }
      } else {
        for (let j = 0; j < moleculeWithH.getAllConnAtoms(i); j++) {
          const connected = moleculeWithH.getConnAtom(i, j);
          if (moleculeWithH.getAtomicNo(connected) === 1) {
            const attachedHydrogenCustomLabel =
              molecule.getAtomCustomLabel(connected);
            if (
              attachedHydrogenCustomLabel &&
              !diaIDsObject[diaID].attachedHydrogensCustomLabels.includes(
                attachedHydrogenCustomLabel,
              )
            ) {
              diaIDsObject[diaID].attachedHydrogensCustomLabels.push(
                attachedHydrogenCustomLabel,
              );
            }
            diaIDsObject[diaID].attachedHydrogens.push(connected);
          }
        }
        diaIDsObject[diaID].existingAtoms.push(i);
      }
      diaIDsObject[diaID].counter++;
      diaIDsObject[diaID].atoms.push(i);
    }
  }
  for (const diaIDObject of Object.values(diaIDsObject)) {
    diaIDObject.existingAtoms.sort((a, b) => a - b);
    diaIDObject.attachedHydrogens.sort((a, b) => a - b);
  }
  return diaIDsObject;
}
