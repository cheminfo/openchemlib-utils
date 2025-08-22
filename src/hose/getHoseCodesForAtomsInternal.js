import { getHoseCodesForAtomsAsFragments } from './getHoseCodesForAtomsAsFragments.js';

/**
 * Returns an array of strings (idCodes) specified molecule. Each string corresponds to a
 * hose code. By default it will calculate the hose codes for sphere 0 to 4 and will reuse
 * the existing tagged atoms.
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to process.
 * @param {object} options - Options for generating hose codes.
 * @param {string[]} [options.allowedCustomLabels] - Array of the custom labels that are considered as root atoms. By default all atoms having a customLabel
 * @param {number} [options.minSphereSize=0] - Smallest hose code sphere
 * @param {number} [options.maxSphereSize=4] - Largest hose code sphere
 * @param {number} [options.kind=FULL_HOSE_CODE] - Kind of hose code, default usual sphere
 * @param {number[]} [options.tagAtoms=[]] - Array of atom indices to tag as root atoms
 * @param {Function} [options.tagAtomFct=tagAtom] - Function to tag an atom as root atom. By default it is defined internal
 * @returns {Array} - An array of hose code fragments.
 */

export function getHoseCodesForAtomsInternal(molecule, options = {}) {
  const fragments = getHoseCodesForAtomsAsFragments(molecule, options);
  const OCL = molecule.getOCL();
  const hoses = [];
  for (const fragment of fragments) {
    hoses.push(
      fragment.getCanonizedIDCode(
        OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
      ),
    );
  }
  return hoses;
}
