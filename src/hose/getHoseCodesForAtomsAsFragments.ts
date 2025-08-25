import type { Molecule } from 'openchemlib';

import { getXAtomicNumber } from '../util/getXAtomicNumber.js';
import { isCsp3 } from '../util/isCsp3.js';
import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom.js';

import type { HoseCodesForAtomsOptions } from './HoseCodesForAtomsOptions.js';

export const FULL_HOSE_CODE = 1;
export const HOSE_CODE_CUT_C_SP3_SP3 = 2;

/**
 * Returns an array of hose code fragments for the specified molecule.
 * @param molecule - The OCL molecule to process.
 * @param options - Options for generating hose codes.
 * @returns An array of hose code fragments.
 */
export function getHoseCodesForAtomsAsFragments(
  molecule: Molecule,
  options: HoseCodesForAtomsOptions = {},
): Molecule[] {
  const OCL = molecule.getOCL();
  const {
    allowedCustomLabels,
    minSphereSize = 0,
    maxSphereSize = 4,
    kind = FULL_HOSE_CODE,
    tagAtoms = [],
    tagAtomFct = tagAtom,
  } = options;
  const rootAtoms = options.rootAtoms ? options.rootAtoms.slice() : [];

  molecule = molecule.getCompactCopy();

  if (tagAtoms.length > 0) {
    internalTagAtoms(molecule, tagAtoms, rootAtoms, tagAtomFct);
  } else {
    // this force reordering of atoms in order to have hydrogens at the end
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
  }

  if (rootAtoms.length === 0) {
    for (let j = 0; j < molecule.getAllAtoms(); j++) {
      if (
        allowedCustomLabels?.includes(molecule.getAtomCustomLabel(j)) ||
        molecule.getAtomCustomLabel(j)
      ) {
        rootAtoms.push(j);
      }
    }
  }

  const fragments: Molecule[] = [];

  // keep track of the atoms when creating the fragment
  const mappings: number[] = [];
  let min = 0;
  let max = 0;
  const atomMask = new Array<boolean>(molecule.getAllAtoms()).fill(false);
  const atomList = new Array<number>(molecule.getAllAtoms());

  for (let sphere = 0; sphere <= maxSphereSize; sphere++) {
    if (max === 0) {
      for (const rootAtom of rootAtoms) {
        atomList[max] = rootAtom;
        atomMask[rootAtom] = true;
        max++;
      }
    } else {
      let newMax = max;
      for (let i = min; i < max; i++) {
        const atom = atomList[i];
        for (let j = 0; j < molecule.getAllConnAtoms(atom); j++) {
          const connAtom = molecule.getConnAtom(atom, j);
          if (!atomMask[connAtom]) {
            switch (kind) {
              case FULL_HOSE_CODE:
                atomMask[connAtom] = true;
                atomList[newMax++] = connAtom;
                break;
              case HOSE_CODE_CUT_C_SP3_SP3:
                if (!(isCsp3(molecule, atom) && isCsp3(molecule, connAtom))) {
                  atomMask[connAtom] = true;
                  atomList[newMax++] = connAtom;
                }
                break;
              default:
                throw new Error('getHoseCoesForAtom unknown kind');
            }
          }
        }
      }
      min = max;
      max = newMax;
    }

    if (sphere >= minSphereSize) {
      const fragment = new OCL.Molecule(0, 0);
      molecule.copyMoleculeByAtoms(fragment, atomMask, true, mappings);
      // we using atomMapNo field in order to keep track of the original atom number even if we remove hydrogens
      for (let i = 0; i < fragment.getAllAtoms(); i++) {
        fragment.setAtomMapNo(i, mappings.indexOf(i) + 1);
      }

      fragment.removeExplicitHydrogens();
      makeRacemic(fragment);
      // we encode atom characteristics in the query features
      addQueryFeaturesAndRemoveMapNo(fragment, molecule);
      fragments.push(fragment);
    }
  }
  return fragments;
}

/**
 * If the atom is not an halogen, X or an hydrogen
 * we add query features to the atom
 * This includes aromaticity, ring size, number of hydrogens
 * @param fragment
 * @param molecule
 */
function addQueryFeaturesAndRemoveMapNo(
  fragment: Molecule,
  molecule: Molecule,
) {
  const Molecule = molecule.getOCL().Molecule;
  for (let i = 0; i < fragment.getAllAtoms(); i++) {
    const mapping = fragment.getAtomMapNo(i) - 1;
    fragment.setAtomMapNo(i, 0);
    if (
      [1, 9, 17, 35, 53, getXAtomicNumber(molecule)].includes(
        fragment.getAtomicNo(i),
      )
    ) {
      continue;
    }

    // aromaticity
    const isAromatic = molecule.isAromaticAtom(mapping);
    if (isAromatic) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFAromatic, true);
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNotAromatic, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFAromatic, false);
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNotAromatic, true);
    }

    // cycles
    const smallestRing = molecule.getAtomRingSize(mapping);
    switch (smallestRing) {
      case 0:
        break;
      case 3:
        fragment.setAtomQueryFeature(i, Molecule.cAtomQFRingSize3, true);
        break;
      case 4:
        fragment.setAtomQueryFeature(i, Molecule.cAtomQFRingSize4, true);
        break;
      case 5:
        fragment.setAtomQueryFeature(i, Molecule.cAtomQFRingSize5, true);
        break;
      case 6:
        fragment.setAtomQueryFeature(i, Molecule.cAtomQFRingSize6, true);
        break;
      case 7:
        fragment.setAtomQueryFeature(i, Molecule.cAtomQFRingSize7, true);
        break;
      default:
        fragment.setAtomQueryFeature(i, Molecule.cAtomQFRingSizeLarge, true);
    }

    const nbHydrogens = molecule.getAllHydrogens(mapping);
    if (nbHydrogens === 0) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot0Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot0Hydrogen, true);
    }
    if (nbHydrogens === 1) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot1Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot1Hydrogen, true);
    }
    if (nbHydrogens === 2) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot2Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot2Hydrogen, true);
    }
    if (nbHydrogens === 3) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot3Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot3Hydrogen, true);
    }
  }
}

// tagging atoms may change the order of the atoms because hydrogens must be at the end of the file
// in order to remember the rootAtoms we will tag before
function internalTagAtoms(
  molecule: Molecule,
  tagAtoms: number[],
  rootAtoms: number[],
  tagAtomFct: (molecule: Molecule, atomIndex: number) => void,
) {
  const OCL = molecule.getOCL();

  if (tagAtoms) {
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
      molecule.setAtomMapNo(i, i + 1);
    }
    if (tagAtoms.length > 0) {
      for (const atom of tagAtoms) {
        tagAtomFct(molecule, atom);
      }
    }
  }

  // this force reordering of atoms in order to have hydrogens at the end
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

  if (rootAtoms.length > 0) {
    const mapping = new Int32Array(molecule.getAllAtoms());
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
      mapping[molecule.getAtomMapNo(i) - 1] = i;
    }
    for (let i = 0; i < rootAtoms.length; i++) {
      rootAtoms[i] = mapping[rootAtoms[i]];
    }
  }
}
