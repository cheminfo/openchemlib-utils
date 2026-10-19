import type { Molecule } from 'openchemlib';

import { getXAtomicNumber } from '../../util/getXAtomicNumber.js';

/**
 * Symmetry ranks that ignore stereochemistry, so that constitutionally
 * equivalent atoms — the two `δ` carbons of a phenylalanine ring or the two
 * methyls of a valine — share a rank even when they are diastereotopic.
 * `getSymmetryRanks` cannot be used here because it distinguishes them.
 * @param molecule - the molecule to rank, hydrogens included.
 * @returns one rank per atom.
 */
export function getConstitutionalRanks(molecule: Molecule): number[] {
  const { Molecule: OCLMolecule } = molecule.getOCL();
  const xAtomicNumber = getXAtomicNumber(molecule);

  const copy = molecule.getCompactCopy();
  for (let atom = 0; atom < copy.getAllAtoms(); atom++) {
    // Hydrogens are ignored by the canonizer, replace them by a monovalent atom.
    if (copy.getAtomicNo(atom) === 1) copy.setAtomicNo(atom, xAtomicNumber);
  }
  copy.ensureHelperArrays(OCLMolecule.cHelperSymmetrySimple);

  const ranks = new Array<number>(molecule.getAllAtoms());
  for (let atom = 0; atom < ranks.length; atom++) {
    ranks[atom] = copy.getSymmetryRank(atom);
  }
  return ranks;
}
