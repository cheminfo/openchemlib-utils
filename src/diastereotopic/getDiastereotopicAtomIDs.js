import { tagAtom } from '../util/tagAtom';
import { makeRacemic } from '../util/makeRacemic';

import { addDiastereotopicMissingChirality } from './addDiastereotopicMissingChirality';

export function getDiastereotopicAtomIDs(OCL, molecule) {
  addDiastereotopicMissingChirality(OCL, molecule);

  let numberAtoms = molecule.getAllAtoms();
  let ids = [];
  for (let iAtom = 0; iAtom < numberAtoms; iAtom++) {
    let tempMolecule = molecule.getCompactCopy();
    tagAtom(OCL, tempMolecule, iAtom);
    makeRacemic(OCL, tempMolecule);
    // We need to ensure the helper array in order to get correctly the result of racemisation
    ids[iAtom] = tempMolecule.getCanonizedIDCode(
      OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
    );
  }
  return ids;
}
