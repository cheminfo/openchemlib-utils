import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';
import { tagAtom } from '../util/tagAtom.js';

import { getHoseCodesForAtomsInternal } from './getHoseCodesForAtomsInternal.js';

/**
 * Returns the hose codes for all atoms in the molecule
 * @param {*} molecule
 * @param {object} [options={}]
 * @param {string[]} [options.atomLabels]
 * @param {number} [options.minSphereSize=0]
 * @param {number} [options.maxSphereSize=4]
 * @returns
 */
export function getHoseCodes(molecule, options = {}) {
  const { atomLabels, minSphereSize, maxSphereSize } = options;
  const { Molecule } = molecule.getOCL();

  const atomicNumbers = atomLabels?.map((label) =>
    Molecule.getAtomicNoFromLabel(label),
  );

  const internalMolecule = molecule.getCompactCopy();
  internalMolecule.addImplicitHydrogens();
  ensureHeterotopicChiralBonds(internalMolecule);

  const results = [];

  for (let i = 0; i < internalMolecule.getAllAtoms(); i++) {
    if (
      atomicNumbers &&
      !atomicNumbers.includes(internalMolecule.getAtomicNo(i))
    ) {
      results.push(undefined);
    } else {
      const tempMolecule = internalMolecule.getCompactCopy();
      tagAtom(tempMolecule, i);
      results.push(
        getHoseCodesForAtomsInternal(tempMolecule, {
          minSphereSize,
          maxSphereSize,
        }),
      );
    }
  }

  return results;
}
