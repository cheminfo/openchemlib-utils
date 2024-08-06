import { getXAtomicNumber } from './getXAtomicNumber.js';

/**
 * Returns an array of symmetry ranks.
 * @param {import('openchemlib').Molecule} molecule - An instance of a molecule
 * @returns
 */
export function getSymmetryRanks(molecule) {
  const { Molecule } = molecule.getOCL();
  const xAtomNumber = getXAtomicNumber(molecule);

  // most of the molecules have some symmetry
  const internalMolecule = molecule.getCompactCopy();
  for (let i = 0; i < internalMolecule.getAllAtoms(); i++) {
    // hydrogens are not taken into account during canonization, we need to change them with an atom with a valence of 1
    if (internalMolecule.getAtomicNo(i) === 1) {
      internalMolecule.setAtomicNo(i, xAtomNumber);
    }
  }
  internalMolecule.ensureHelperArrays(
    Molecule.cHelperSymmetryStereoHeterotopicity,
  );

  const symmetryRanks = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    symmetryRanks.push(internalMolecule.getSymmetryRank(i));
  }
  return symmetryRanks;
}
