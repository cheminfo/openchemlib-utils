import { getHoseCodesForAtom } from './getHoseCodesForAtom';
/**
 * Returns the hose code for a specific marked atom
 * @param {OCL.Molecule} diastereotopicID
 * @param {object} options
 */

export function getHoseCodesFromDiastereotopicID(molecule, options = {}) {
  molecule.addImplicitHydrogens();
  molecule.addMissingChirality();

  // One of the atom has to be marked !
  let atomID = -1;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    // we need to find the marked atom
    const atomCustomLabel = molecule.getAtomCustomLabel(i);
    if (atomCustomLabel != null && atomCustomLabel.endsWith('*')) {
      atomID = i;
      break;
    }
  }
  if (atomID >= 0) {
    options.isTagged = true;
    return getHoseCodesForAtom(molecule, atomID, options);
  }
  return undefined;
}
