import { isCsp3 } from '../util/isCsp3';
import { makeRacemic } from '../util/makeRacemic';
import { tagAtom } from '../util/tagAtom';

export const FULL_HOSE_CODE = 1;
export const HOSE_CODE_CUT_C_SP3_SP3 = 2;

/**
 * Returns the hose code for a specific atom number
 * @param {OCL.Molecule} originalMolecule
 * @param {array<number>} rootAtoms
 * @param {object} [options={}]
 * @param {boolean} [options.isTagged] Specify is the atoms are already tagged
 * @param {number} [options.minSphereSize=0] Smallest hose code sphere
 * @param {number} [options.maxSphereSize=4] Largest hose code sphere
 * @param {number} [options.kind=FULL_HOSE_CODE] Kind of hose code, default usual sphere
 */
export function getHoseCodesForAtoms(
  originalMolecule,
  rootAtoms = [],
  options = {},
) {
  const OCL = originalMolecule.getOCL();
  const {
    minSphereSize = 0,
    maxSphereSize = 4,
    kind = FULL_HOSE_CODE,
    isTagged = false,
  } = options;

  const molecule = originalMolecule.getCompactCopy();

  if (!isTagged) {
    const tags = [];
    for (let i = 0; i < rootAtoms.length; i++) {
      let rootAtom = rootAtoms[i];
      tags.push(tagAtom(molecule, rootAtom));
      molecule.addImplicitHydrogens();
      molecule.addMissingChirality();
      molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
      // because ensuring helper reorder atoms we need to look again for it
    }
    rootAtoms.length = 0;
    for (let j = 0; j < molecule.getAllAtoms(); j++) {
      if (tags.includes(molecule.getAtomCustomLabel(j))) {
        rootAtoms.push(j);
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
      for (let rootAtom of rootAtoms) {
        atomList[max] = rootAtom;
        atomMask[rootAtom] = true;
        max++;
      }
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
