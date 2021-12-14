import { getHoseCodesForAtoms } from './getHoseCodesForAtoms.js';

/**
 * Returns the hose code for a specific atom number
 * @param {OCL.Molecule} originalMolecule
 * @param {number} rootAtom
 * @param {object} [options={}]
 * @param {boolean} [options.isTagged] Specify is the atom is already tagged
 * @param {number} [options.minSphereSize=0] Smallest hose code sphere
 * @param {number} [options.maxSphereSize=4] Largest hose code sphere
 * @param {number} [options.kind=FULL_HOSE_CODE] Kind of hose code, default usual sphere
 */
export function getHoseCodesForAtom(originalMolecule, rootAtom, options = {}) {
  return getHoseCodesForAtoms(originalMolecule, [rootAtom], options);
}
