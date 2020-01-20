import { getDiastereotopicAtomIDs } from '../diastereotopic/getDiastereotopicAtomIDs';

import { getHoseCodesFromDiastereotopicID } from './getHoseCodesFromDiastereotopicID';

export function getHoseCodesAndDiastereotopicIDs(OCL, molecule, options) {
  const diaIDs = getDiastereotopicAtomIDs(OCL, molecule).map((oclID) => ({
    oclID,
  }));
  // seems like a very slow approach
  diaIDs.forEach(function(diaID) {
    const hoses = getHoseCodesFromDiastereotopicID(OCL, diaID.oclID, options);
    diaID.hoses = [];
    let level = 0;
    for (const hose of hoses) {
      diaID.hoses.push({
        level: level++,
        oclID: hose,
      });
    }
  });
  return diaIDs;
}
