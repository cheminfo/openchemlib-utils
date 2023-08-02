import { getSymmetryRanks } from '../util/getSymmetryRanks';
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

  const symmetryRanks = getSymmetryRanks(molecule);

  let numberAtoms = molecule.getAllAtoms();
  let ids = [];
  let cache = {};
  for (let iAtom = 0; iAtom < numberAtoms; iAtom++) {
    const rank = symmetryRanks[iAtom];
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
