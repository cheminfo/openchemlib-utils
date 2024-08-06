import { LightLogger } from 'cheminfo-types';
import type { Molecule } from 'openchemlib';

import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';

export interface GetMoleculeWithHOptions {
  maxNbAtoms: number;
  logger: LightLogger;
}

/**
 * Expand all the implicit hydrogens and ensure chiral bonds on heterotopic bonds
 * @param molecule
 * @param options
 * @returns
 */
export function getMoleculeWithH(
  molecule: Molecule,
  options: GetMoleculeWithHOptions,
) {
  const { logger, maxNbAtoms } = options;
  const moleculeWithH = molecule.getCompactCopy();
  moleculeWithH.addImplicitHydrogens();
  if (moleculeWithH.getAllAtoms() > maxNbAtoms) {
    logger.warn(
      `too many atoms to evaluate heterotopic chiral bonds: ${moleculeWithH.getAllAtoms()} > ${maxNbAtoms}`,
    );
  } else {
    ensureHeterotopicChiralBonds(moleculeWithH);
  }
  return moleculeWithH;
}
