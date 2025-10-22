import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';
import { getCompactCopyWithoutCustomLabels } from '../util/getCompactCopyWithoutCustomLabels.ts';
import { tagAtom } from '../util/tagAtom.ts';

import { getHoseCodesForAtomsAsStrings } from './getHoseCodesForAtomsAsStrings.js';

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

  const internalMolecule = getCompactCopyWithoutCustomLabels(molecule);
  internalMolecule.addImplicitHydrogens();
  ensureHeterotopicChiralBonds(internalMolecule);

  const hoses = [];

  for (let i = 0; i < internalMolecule.getAllAtoms(); i++) {
    if (
      atomicNumbers &&
      !atomicNumbers.includes(internalMolecule.getAtomicNo(i))
    ) {
      hoses.push(undefined);
    } else {
      const tempMolecule = internalMolecule.getCompactCopy();
      tagAtom(tempMolecule, i);
      hoses.push(
        getHoseCodesForAtomsAsStrings(tempMolecule, {
          minSphereSize,
          maxSphereSize,
        }),
      );
    }
  }

  return hoses;
}
