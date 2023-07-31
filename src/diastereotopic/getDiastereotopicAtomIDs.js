import { getXAtomicNumber } from '../util/getXAtomicNumber.js';
import { makeRacemic } from '../util/makeRacemic';
import { tagAtom } from '../util/tagAtom';

import { ensureHeterotopicChiralBonds } from './ensureHeterotopicChiralBonds';

/**
 * Returns an array of diastereotopic ID (as idCode)
 * @param {import('openchemlib').Molecule} molecule
 */
export function getDiastereotopicAtomIDs(molecule) {
  const { Molecule } = molecule.getOCL();
  ensureHeterotopicChiralBonds(molecule);

  const xAtomNumber = getXAtomicNumber(molecule);

  // most of the molecules have some symetry
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

  let numberAtoms = molecule.getAllAtoms();
  let ids = [];
  let cache = {};
  for (let iAtom = 0; iAtom < numberAtoms; iAtom++) {
    const rank = internalMolecule.getSymmetryRank(iAtom);
    if (rank && cache[rank]) {
      ids[iAtom] = cache[rank];
      continue;
    }
    let tempMolecule = molecule.getCompactCopy();
    tagAtom(tempMolecule, iAtom);
    makeRacemic(tempMolecule);
    // We need to ensure the helper array in order to get correctly the result of racemisation
    ids[iAtom] = tempMolecule.getCanonizedIDCode(
      Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
    );
    cache[rank] = ids[iAtom];
  }
  return ids;
}
