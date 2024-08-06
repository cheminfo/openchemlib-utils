import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';
import { tagAtom } from '../util/tagAtom';

import { getHoseCodesForAtomsInternal } from './getHoseCodesForAtomsInternal.js';

export const FULL_HOSE_CODE = 1;
export const HOSE_CODE_CUT_C_SP3_SP3 = 2;

/**
 * Returns the hose code for specific atom numbers
 * @param {import('openchemlib').Molecule} originalMolecule - The OCL molecule to be fragmented
 * @param {number[]} rootAtoms
 * @param {object} [options={}]
 * @param {number} [options.minSphereSize=0] - Smallest hose code sphere
 * @param {number} [options.maxSphereSize=4] - Largest hose code sphere
 * @param {number} [options.kind=FULL_HOSE_CODE] - Kind of hose code, default usual sphere
 */
export function getHoseCodesForAtoms(
  originalMolecule,
  rootAtoms = [],
  options = {},
) {
  const {
    minSphereSize = 0,
    maxSphereSize = 4,
    kind = FULL_HOSE_CODE,
  } = options;

  const molecule = originalMolecule.getCompactCopy();
  // those 2 lines should be done only once
  molecule.addImplicitHydrogens();
  ensureHeterotopicChiralBonds(molecule);

  const allowedCustomLabels = [];
  for (const rootAtom of rootAtoms) {
    allowedCustomLabels.push(tagAtom(molecule, rootAtom));
  }

  return getHoseCodesForAtomsInternal(molecule, {
    minSphereSize,
    maxSphereSize,
    allowedCustomLabels,
    kind,
  });
}
