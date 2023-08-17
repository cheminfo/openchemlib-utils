import type { Molecule } from 'openchemlib';

import { getConnectivityMatrix } from '../util/getConnectivityMatrix.js';

import { getCanonizedDiaIDs } from './getCanonizedDiaIDs.js';
import { getCanonizedHoseCodes } from './getCanonizedHoseCodes.js';
import { getDiaIDsAndInfo } from './getDiaIDsAndInfo.js';
import {
  getHeterotopicSymmetryRanks,
  getFinalRanks,
} from './getHeterotopicSymmetryRanks.js';
import { getMoleculeWithH } from './getMoleculeWithH.js';
import { getXMolecule } from './getXMolecule.js';

interface ToMolfileOptions {
  version?: 2 | 3;
}

/**
 * This class deals with topicity information and hose codes
 * It is optimized to avoid recalculation of the same information
 */
export class TopicMolecule {
  private readonly originalMolecule: Molecule;
  molecule: Molecule;
  idCode: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private Molecule: Molecule;
  private cache: any;

  constructor(molecule: Molecule) {
    this.originalMolecule = molecule;
    this.idCode = molecule.getIDCode();
    this.molecule = this.originalMolecule.getCompactCopy();
    this.molecule.ensureHelperArrays(
      molecule.getOCL().Molecule.cHelperNeighbours,
    );
    this.Molecule = this.molecule.getOCL().Molecule;
    //@ts-expect-error TODO
    this.molecule.ensureHelperArrays(this.Molecule.cHelperNeighbours);
    this.cache = {};
  }

  toMolfile(options: ToMolfileOptions = {}) {
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
  get moleculeWithH() {
    if (this.cache.moleculeWithH) return this.cache.moleculeWithH;
    this.cache.moleculeWithH = getMoleculeWithH(this.molecule);
    return this.cache.moleculeWithH;
  }

  private get xMolecule() {
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
    for (let i = 0; i < this.moleculeWithH.getAllAtoms(); i++) {
      diaIDs.push(this.canonizedDiaIDs[this.finalRanks[i]]);
    }
    this.cache.diaIDs = diaIDs;
    return diaIDs;
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
    this.cache.canonizedDiaIDs = getCanonizedDiaIDs(this);
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
    if (this.cache.diaIDsAndInfo) return this.cache.diaIDsAndInfo;
    this.cache.diaIDsAndInfo = getDiaIDsAndInfo(this, this.canonizedDiaIDs);
    return this.cache.diaIDsAndInfo;
  }

  /**
   * Returns symmetryRanks for all the atoms including hydrogens. Those ranks
   * deals with topicity and is related to the current moleculeWithH.
   * In order to calculate the ranks we replace all the
   * hydrogens with a X atom.
   */
  get heterotopicSymmetryRanks() {
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

  /**
   * Returns an array of objects containing the oclID and the corresponding hydrogens and atoms
   * for the specified atomLabel (if any)
   * This always applied to the molecule with expanded hydrogens and chirality
   * @param options
   * @returns
   */
  getGroupedDiastereotopicAtomIDs(options: GroupedDiaIDsOptions = {}) {
    return groupDiastereotopicAtomIDs(this.diaIDs, this.moleculeWithH, options);
  }
}

export interface DiaIDAndInfo {
  idCode: string;
  attachedHydrogensIDCodes: string[];
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
  atoms: number[];
  oclID: string;
  atomLabel: string;
}

export function groupDiastereotopicAtomIDs(
  diaIDs: string[],
  molecule: Molecule,
  options: GroupedDiaIDsOptions = {},
) {
  const { atomLabel } = options;
  const diaIDsObject: Record<string, GroupedDiaID> = {};
  for (let i = 0; i < diaIDs.length; i++) {
    if (!atomLabel || molecule.getAtomLabel(i) === atomLabel) {
      const diaID = diaIDs[i];
      if (!diaIDsObject[diaID]) {
        diaIDsObject[diaID] = {
          counter: 0,
          atoms: [],
          oclID: diaID,
          atomLabel: molecule.getAtomLabel(i),
        };
      }
      diaIDsObject[diaID].counter++;
      diaIDsObject[diaID].atoms.push(i);
    }
  }
  return Object.keys(diaIDsObject).map((key) => diaIDsObject[key]);
}
