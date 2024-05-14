import type { Molecule } from 'openchemlib';

import { AtomPath, getAllAtomsPaths } from '../path/getAllAtomsPaths.js';
import { getConnectivityMatrix } from '../util/getConnectivityMatrix.js';
import { tagAtom } from '../util/tagAtom.js';

import { HoseCodesOptions } from './HoseCodesOptions.js';
import { getCanonizedDiaIDs } from './getCanonizedDiaIDs';
import { getCanonizedHoseCodes } from './getCanonizedHoseCodes';
import { getDiaIDsAndInfo } from './getDiaIDsAndInfo';
import {
  getHeterotopicSymmetryRanks,
  getFinalRanks,
} from './getHeterotopicSymmetryRanks';
import { getMoleculeWithH } from './getMoleculeWithH';
import { getXMolecule } from './getXMolecule';

interface ToMolfileOptions {
  version?: 2 | 3;
}

interface TopicMoleculeOptions extends HoseCodesOptions {
  maxPathLength?: 5;
}

interface GetAtomPathOptions {
  /*
   * The distance between the two atoms. If not specified, all the distances will be considered
   */
  distance?: number;
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
  options: TopicMoleculeOptions;

  private cache: any;

  constructor(molecule: Molecule, options: TopicMoleculeOptions = {}) {
    this.originalMolecule = molecule;
    this.options = { maxPathLength: 5, ...options };
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

  getHoseFragment(
    rootAtoms: number[],
    options: GetHoseFragmentOptions = {},
  ): Molecule {
    const {
      sphereSize = 2,
      tagAtoms = rootAtoms,
      tagAtomFct = tagAtom,
    } = options;
    this.moleculeWithH.ensureHelperArrays(
      this.moleculeWithH.getOCL().Molecule.cHelperNeighbours,
    );

    const copy = this.moleculeWithH.getCompactCopy();
    copy.ensureHelperArrays(copy.getOCL().Molecule.cHelperNeighbours);

    for (let i = 0; i < copy.getAllAtoms(); i++) {
      copy.setAtomMass(i, copy.getAtomMass(i) + 2);
    }

    const atomMask = new Array(copy.getAllAtoms()).fill(false);
    const atomList = new Uint8Array(copy.getAllAtoms());
    const atomMapping = new Array(copy.getAllAtoms()).fill(-1);
    const Molecule = copy.getOCL().Molecule;
    const fragment = new Molecule(0, 0);
    fragment.setFragment(true);
    let min = 0;
    let max = 0;
    for (let sphere = 0; sphere <= sphereSize; sphere++) {
      if (max === 0) {
        for (const rootAtom of rootAtoms) {
          atomList[max] = rootAtom;
          atomMask[rootAtom] = 1;
          max++;
        }
      } else {
        let newMax = max;
        for (let i = min; i < max; i++) {
          const atom = atomList[i];
          for (let j = 0; j < this.moleculeWithH.getAllConnAtoms(atom); j++) {
            const connAtom = this.moleculeWithH.getConnAtom(atom, j);
            if (!atomMask[connAtom]) {
              atomMask[connAtom] = 1;
              atomList[newMax++] = connAtom;
            }
          }
        }
        min = max;
        max = newMax;
      }
    }
    copy.copyMoleculeByAtoms(fragment, atomMask, true, atomMapping);
    for (let i = 0; i < fragment.getAllAtoms(); i++) {
      fragment.setAtomMass(i, fragment.getAtomMass(i) - 2);
    }

    for (const atom of tagAtoms) {
      tagAtomFct(fragment, atomMapping[atom]);
    }

    return fragment;
  }

  getAtomPaths(atom1: number, atom2: number, options: GetAtomPathOptions = {}) {
    const { distance } = options;
    if (distance !== undefined && distance > this.options.maxPathLength) {
      throw new Error(
        'The distance is too long, you should increase the maxPathLength when instanciating the TopicMolecule',
      );
    }
    const atomPaths = this.atomsPaths[atom1];
    const minDistance = distance || 0;
    const maxDistance = distance || this.options.maxPathLength;
    const paths = [];
    for (let i = minDistance; i <= maxDistance; i++) {
      for (const atomPath of atomPaths[i]) {
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
    this.cache.moleculeWithH = getMoleculeWithH(this.molecule);
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
    for (let i = 0; i < this.moleculeWithH.getAllAtoms(); i++) {
      diaIDs.push(this.canonizedDiaIDs[this.finalRanks[i]]);
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

  /**
   * This method returns a mapping between the diaIDs of the current molecule.
   * It expects that the initial molfile and the final molfile contains atomMapNo
   * in order to track which atom becomes which one.
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
        const oldHydrogenIDCode = originalDiaID.attachedHydrogensIDCodes[i];
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
  /*
   * List of atom numbers with the same diaID
   */
  counter: number;
  /*
   * List of atom numbers with the same diaID. The atom numbers could not be in the moecule
   * because they are hydrogens attached to a heavy atom
   */
  atoms: number[];
  oclID: string;
  atomLabel: string;
  heavyAtoms: number[];
  attachedHydrogens: number[];
  /**
   * List of atom numbers existing in the molecule. In case of implicit hydrogens we will fallback
   * to the linked heavy atom
   */
  existingAtoms: number[];
}

export function groupDiastereotopicAtomIDs(
  diaIDs: string[],
  molecule: Molecule,
  options: GroupedDiaIDsOptions = {},
) {
  const diaIDsObject = groupDiastereotopicAtomIDsAsObject(
    diaIDs,
    molecule,
    molecule,
    options,
  );
  return Object.keys(diaIDsObject).map((key) => diaIDsObject[key]);
}

function groupDiastereotopicAtomIDsAsObject(
  diaIDs: string[],
  molecule: Molecule,
  moleculeWithH: Molecule,
  options: GroupedDiaIDsOptions = {},
) {
  const { atomLabel } = options;
  const diaIDsObject: Record<string, GroupedDiaID> = {};

  for (let i = 0; i < diaIDs.length; i++) {
    if (!atomLabel || moleculeWithH.getAtomLabel(i) === atomLabel) {
      const diaID = diaIDs[i];
      if (!diaIDsObject[diaID]) {
        diaIDsObject[diaID] = {
          counter: 0,
          atoms: [],
          oclID: diaID,
          atomLabel: moleculeWithH.getAtomLabel(i),
          heavyAtoms: [],
          attachedHydrogens: [],
          existingAtoms: [],
        };
      }
      if (moleculeWithH.getAtomicNo(i) === 1) {
        const connected = moleculeWithH.getConnAtom(i, 0);
        if (!diaIDsObject[diaID].heavyAtoms.includes(connected)) {
          diaIDsObject[diaID].heavyAtoms.push(connected);
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
            diaIDsObject[diaID].attachedHydrogens.push(connected);
          }
        }
        diaIDsObject[diaID].existingAtoms.push(i);
      }
      diaIDsObject[diaID].counter++;
      diaIDsObject[diaID].atoms.push(i);
    }
  }
  for (const diaID in diaIDsObject) {
    diaIDsObject[diaID].existingAtoms.sort((a, b) => a - b);
    diaIDsObject[diaID].attachedHydrogens.sort((a, b) => a - b);
  }
  return diaIDsObject;
}
