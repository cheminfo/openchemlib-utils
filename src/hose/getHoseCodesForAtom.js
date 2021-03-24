import { isCsp3 } from '../util/isCsp3';
import { makeRacemic } from '../util/makeRacemic';
import { tagAtom } from '../util/tagAtom';

export const FULL_HOSE_CODE = 1;
export const HOSE_CODE_CUT_C_SP3_SP3 = 2;

/**
 * Returns the hose code for a specific atom number
 * @param {OCL.Molecule} originalMolecule
 * @param {number} rootAtom
 * @param {object} [options={}]
 * @param {boolean} [options.isTagged] Specify is the atom is already tagged
 */
export function getHoseCodesForAtom(originalMolecule, rootAtom, options = {}) {
  const OCL = originalMolecule.getOCL();
  const {
    minSphereSize = 0,
    maxSphereSize = 4,
    kind = FULL_HOSE_CODE,
    isTagged = false,
  } = options;

  const molecule = originalMolecule.getCompactCopy();

  if (!isTagged) {
    let tag = tagAtom(molecule, rootAtom);
    molecule.addImplicitHydrogens();
    molecule.addMissingChirality();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    // because ensuring helper reorder atoms we need to look again for it
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
      if (tag === molecule.getAtomCustomLabel(i)) {
        rootAtom = i;
        break;
      }
    }
  }

  let fragment = new OCL.Molecule(0, 0);
  let results = [];
  let min = 0;
  let max = 0;
  let atomMask = new Array(molecule.getAllAtoms());
  let atomList = new Array(molecule.getAllAtoms());

  for (let sphere = 0; sphere <= maxSphereSize; sphere++) {
    if (max === 0) {
      atomList[0] = rootAtom;
      atomMask[rootAtom] = true;
      max = 1;
    } else {
      let newMax = max;
      for (let i = min; i < max; i++) {
        let atom = atomList[i];
        for (let j = 0; j < molecule.getAllConnAtoms(atom); j++) {
          let connAtom = molecule.getConnAtom(atom, j);
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
