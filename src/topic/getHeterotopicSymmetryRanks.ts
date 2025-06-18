import type { Molecule } from 'openchemlib';

/**
 * Get a unique atomic number for a X
 * @param xMolecule
 * @returns
 */
export function getHeterotopicSymmetryRanks(xMolecule: Molecule): number[] {
  xMolecule.ensureHelperArrays(
    xMolecule.getOCL().Molecule.cHelperSymmetryStereoHeterotopicity,
  );
  const symmetryRanks = [];
  for (let i = 0; i < xMolecule.getAllAtoms(); i++) {
    symmetryRanks.push(xMolecule.getSymmetryRank(i));
  }
  return symmetryRanks;
}

export function getFinalRanks(xMolecule: Molecule): number[] {
  xMolecule.ensureHelperArrays(
    xMolecule.getOCL().Molecule.cHelperSymmetryStereoHeterotopicity,
  );
  return xMolecule.getFinalRanks(0).map((rank) => rank - 1);
}
