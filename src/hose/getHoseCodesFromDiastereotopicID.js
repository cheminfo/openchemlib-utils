import { getOCL } from '../OCL';

import { getHoseCodesForAtom } from './getHoseCodesForAtom';
/**
 * Returns the hose code for a specific marked atom
 * @param {string} diastereotopicID
 * @param {object} options
 */

export function getHoseCodesFromDiastereotopicID(
  diastereotopicID,
  options = {},
) {
  const OCL = getOCL();
  const molecule = OCL.Molecule.fromIDCode(diastereotopicID);
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
