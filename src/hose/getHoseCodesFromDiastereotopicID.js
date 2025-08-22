import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';

import { getHoseCodesForAtomsAsStrings } from './getHoseCodesForAtomsAsStrings.js';

/**
 * Returns an array of strings (idCodes) specified molecule. Each string corresponds to a
 * hose code. By default it will calculate the hose codes for sphere 0 to 4 and will reuse
 * the existing tagged atoms.
 * This method ensure implicity hydrogens and possible missing chiral bonds.
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to process.
 * @param {object} options - Options for generating hose codes.
 * @param {string[]} [options.allowedCustomLabels] - Array of the custom labels that are considered as root atoms. By default all atoms having a customLabel
 * @param {number} [options.minSphereSize=0] - Smallest hose code sphere
 * @param {number} [options.maxSphereSize=4] - Largest hose code sphere
 * @param {number} [options.kind=FULL_HOSE_CODE] - Kind of hose code, default usual sphere
 *  @param {number[]} [options.rootAtoms=[]] - Array of atom from which we should start to create the HOSE. By default we will used the taggedAtoms
 * @param {number[]} [options.tagAtoms=[]] - Array of atom indices to tag as root atoms
 * @param {Function} [options.tagAtomFct=tagAtom] - Function to tag an atom as root atom. By default it is defined internal
 * @returns {Array} - An array of hose code fragments.
 */
export function getHoseCodesFromDiastereotopicID(molecule, options = {}) {
  molecule.addImplicitHydrogens();
  ensureHeterotopicChiralBonds(molecule);
  return getHoseCodesForAtomsAsStrings(molecule, options);
}
