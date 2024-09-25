import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';

import { getHoseCodesForAtomsInternal } from './getHoseCodesForAtomsInternal.js';

/**
 * Returns the hose code for a specific marked atom
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} options
 */
export function getHoseCodesFromDiastereotopicID(molecule, options = {}) {
  molecule.addImplicitHydrogens();
  ensureHeterotopicChiralBonds(molecule);
  return getHoseCodesForAtomsInternal(molecule, options);
}
