import type { Molecule } from 'openchemlib';

/**
 * Creates a compact copy of the molecule without custom labels.
 * We don't want that custom labels interfere with hose code and diaID generation.
 * @param molecule
 * @returns
 */
export function getCompactCopyWithoutCustomLabels(
  molecule: Molecule,
): Molecule {
  const tempMolecule = molecule.getCompactCopy();
  for (let i = 0; i < tempMolecule.getAllAtoms(); i++) {
    tempMolecule.setAtomCustomLabel(i, '');
  }
  return tempMolecule;
}
