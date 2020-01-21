import { getDiastereotopicAtomIDs } from '../diastereotopic/getDiastereotopicAtomIDs';

import { getHoseCodesFromDiastereotopicID } from './getHoseCodesFromDiastereotopicID';
/**
 * Returns an array containing one entry per atom containing
 * diaID and hose code
 * @param {OCL.Molecule} molecule
 * @param {object} options
 * @memberof Hose
 */

export function getHoseCodesAndDiastereotopicIDs(molecule, options) {
  const diaIDs = getDiastereotopicAtomIDs(molecule).map((oclID) => ({
    oclID,
  }));
  // seems like a very slow approach
  diaIDs.forEach(function(diaID) {
    const hoses = getHoseCodesFromDiastereotopicID(diaID.oclID, options);
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
