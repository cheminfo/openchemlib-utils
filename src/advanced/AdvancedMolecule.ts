import type { Molecule } from 'openchemlib';

import { getGroupedDiastereotopicAtomIDs } from '../diastereotopic/getGroupedDiastereotopicAtomIDs.js';
import { getConnectivityMatrix } from '../util/getConnectivityMatrix.js';

import { getCanonizedDiaIDs } from './getCanonizedDiaIDs.js';
import { getDiaIDsAndH } from './getDiaIDsAndH.js';
import {
  getHeterotopicSymmetryRanks,
  getFinalRanks,
} from './getHeterotopicSymmetryRanks.js';
import { getMoleculeWithH } from './getMoleculeWithH.js';
import { getXMolecule } from './getXMolecule.js';

/**
 * This class deals with diastereotopicity information and hose codes
 * It is optimized to avoid recalculation of the same information
 */
export class AdvancedMolecule {
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

  toMolfile() {
    return this.molecule.toMolfile();
  }

  getMolecule() {
    return this.molecule;
  }

  fromMolecule(molecule: Molecule) {
    const idCode = molecule.getIDCode();
    if (idCode !== this.idCode) {
      // no way for optimisation
      return new AdvancedMolecule(molecule);
    }
    const advancedMolecule = new AdvancedMolecule(molecule);
    advancedMolecule.cache = {
      canonizedDiaIDs: this.cache.canonizedDiaIDs,
    };
    return advancedMolecule;
  }

  get moleculeWithH() {
    if (this.cache.moleculeWithH) return this.cache.moleculeWithH;
    this.cache.moleculeWithH = getMoleculeWithH(this.molecule);
    return this.cache.moleculeWithH;
  }

  get xMolecule() {
    if (this.cache.xMolecule) return this.cache.xMolecule;
    this.cache.xMolecule = getXMolecule(this.moleculeWithH);
    return this.cache.xMolecule;
  }

  /**
   * This is related to the current moleculeWithH. The order is NOT canonized
   */
  get diaIDs() {
    if (this.cache.diaIDs) return this.cache.diaIDs;
    const diaIDs = [];
    for (let i = 0; i < this.moleculeWithH.getAllAtoms(); i++) {
      diaIDs.push(this.canonizedDiaIDs[this.finalRanks[i]]);
    }
    this.cache.diaIDs = diaIDs;
    return diaIDs;
  }

  get canonizedDiaIDs() {
    if (this.cache.canonizedDiaIDs) return this.cache.canonizedDiaIDs;
    this.cache.canonizedDiaIDs = getCanonizedDiaIDs(this);
    return this.cache.canonizedDiaIDs;
  }

  /**
   * Returns the distance matrix for the current moleculeWithH
   */
  get distanceMatrix() {
    return getConnectivityMatrix(this.moleculeWithH, { pathLength: true });
  }

  get diaIDsAndH() {
    if (this.cache.diaIDsAndH) return this.cache.diaIDsAndH;
    this.cache.diaIDsAndH = getDiaIDsAndH(this);
    return this.cache.diaIDsAndH;
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

  toMolfileWithH() {
    return this.moleculeWithH.toMolfile();
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

export interface DiaIDAndH {
  oclID: string;
  hydrogens: string[];
  heavyAtom: string | undefined;
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
