import { getXAtomicNumber } from '../util/getXAtomicNumber.js';
import { isCsp3 } from '../util/isCsp3.js';
import { makeRacemic } from '../util/makeRacemic.js';

export const FULL_HOSE_CODE = 1;
export const HOSE_CODE_CUT_C_SP3_SP3 = 2;

/**
 * Returns the hose code for specific atom numbers
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule with expandedImplicitHydrogens and ensureHeterotopicChiralBonds
 * @param {object} [options={}]
 * @param {string[]} [options.allowedCustomLabels] Array of the custom labels that are considered as root atoms. By default all atoms having a customLabel
 * @param {number} [options.minSphereSize=0] Smallest hose code sphere
 * @param {number} [options.maxSphereSize=4] Largest hose code sphere
 * @param {number} [options.kind=FULL_HOSE_CODE] Kind of hose code, default usual sphere
 */
export function getHoseCodesForAtomsInternal(molecule, options = {}) {
  const OCL = molecule.getOCL();
  const {
    allowedCustomLabels,
    minSphereSize = 0,
    maxSphereSize = 4,
    kind = FULL_HOSE_CODE,
  } = options;

  // this force reordering of atoms in order to have hydrogens at the end
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

  const rootAtoms = [];
  for (let j = 0; j < molecule.getAllAtoms(); j++) {
    if (
      allowedCustomLabels?.includes(molecule.getAtomCustomLabel(j)) ||
      molecule.getAtomCustomLabel(j)
    ) {
      rootAtoms.push(j);
    }
  }

  const fragment = new OCL.Molecule(0, 0);
  // keep track of the atoms when creating the fragment
  const mappings = [];
  const results = [];
  let min = 0;
  let max = 0;
  const atomMask = new Uint8Array(molecule.getAllAtoms());
  const atomList = new Uint8Array(molecule.getAllAtoms());

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
      molecule.copyMoleculeByAtoms(fragment, atomMask, true, mappings);
      // we using atomMapNo field in order to keep track of the original atom number even if we remove hydrogens
      for (let i = 0; i < fragment.getAllAtoms(); i++) {
        fragment.setAtomMapNo(i, mappings.indexOf(i) + 1);
      }
      fragment.removeExplicitHydrogens();
      makeRacemic(fragment);
      // we encode atom characteristics in the query features
      addQueryFeaturesAndRemoveMapNo(fragment, molecule);
      results.push(
        fragment.getCanonizedIDCode(
          OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
        ),
      );
    }
  }
  return results;
}

/**
 * If the atom is not an halogen, X or an hydrogen
 * we add query features to the atom
 * This includes aromaticity, ring size, number of hydrogens
 * @param {import('openchemlib').Molecule} fragment 
 * @param {import('openchemlib').Molecule} molecule 
 */
function addQueryFeaturesAndRemoveMapNo(fragment, molecule) {
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
