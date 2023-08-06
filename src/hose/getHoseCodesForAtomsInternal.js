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
  const results = [];
  let min = 0;
  let max = 0;
  const atomMask = new Array(molecule.getAllAtoms());
  const atomList = new Array(molecule.getAllAtoms());

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
    molecule.copyMoleculeByAtoms(fragment, atomMask, true, null);
    if (sphere >= minSphereSize) {
      makeRacemic(fragment);
      results.push(
        fragment.getCanonizedIDCode(
          OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
        ),
      );
    }
  }
  return results;
}
