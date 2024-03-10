import type { Molecule } from 'openchemlib';

import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';

const MAX_NB_ATOMS = 250;

/**
 * Expand all the implicit hydrogens and ensure chiral bonds on heterotopic bonds
 * @param molecule
 * @returns
 */
export function getMoleculeWithH(molecule: Molecule) {
  const moleculeWithH = molecule.getCompactCopy();
  moleculeWithH.addImplicitHydrogens();
  if (moleculeWithH.getAllAtoms() > MAX_NB_ATOMS) {
    throw new Error(
      `too many atoms to add hydrogens: ${moleculeWithH.getAllAtoms()} > ${MAX_NB_ATOMS}`,
    );
  }
  ensureHeterotopicChiralBonds(moleculeWithH);
  return moleculeWithH;
}
