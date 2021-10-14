import { getDiastereotopicAtomIDs } from '../diastereotopic/getDiastereotopicAtomIDs';

import { getHoseCodesFromDiastereotopicID } from './getHoseCodesFromDiastereotopicID';
/**
 * Returns an array containing one entry per atom containing
 * diaID and hose code
 * @param {OCL.Molecule} molecule
 * @param {object} options
 */

export function getHoseCodesAndDiastereotopicIDs(molecule, options) {
  const diaIDs = getDiastereotopicAtomIDs(molecule).map((oclID) => ({
    oclID,
  }));
  const OCL = molecule.getOCL();
  // TODO: seems like a very slow approach
  diaIDs.forEach((diaID) => {
    const hoses = getHoseCodesFromDiastereotopicID(
      OCL.Molecule.fromIDCode(diaID.oclID),
      options,
    );
    diaID.hoses = [];
    let sphere = 0;
    for (const hose of hoses) {
      diaID.hoses.push({
        sphere: sphere++,
        oclID: hose,
      });
    }
  });
  return diaIDs;
}
