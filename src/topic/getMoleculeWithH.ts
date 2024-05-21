import type { Molecule } from 'openchemlib';

import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';

export interface GetMoleculeWithHOptions {
  /**
   * @default 250
   * Maximum number of atoms with hydrogens
   */
  maxNbAtoms?: number;
}

/**
 * Expand all the implicit hydrogens and ensure chiral bonds on heterotopic bonds
 * @param molecule
 * @returns
 */
export function getMoleculeWithH(
  molecule: Molecule,
  options: GetMoleculeWithHOptions = {},
) {
  const { maxNbAtoms = 250 } = options;
  const moleculeWithH = molecule.getCompactCopy();
  moleculeWithH.addImplicitHydrogens();
  if (moleculeWithH.getAllAtoms() > maxNbAtoms) {
    throw new Error(
      `too many atoms to add hydrogens: ${moleculeWithH.getAllAtoms()} > ${maxNbAtoms}`,
    );
  }
  ensureHeterotopicChiralBonds(moleculeWithH);
  return moleculeWithH;
}
