import { getOCL } from '../OCL';

import { getHoseCodesAndDiastereotopicIDs as getHoseCodesAndDiastereotopicIDsFct } from './getHoseCodesAndDiastereotopicIDs';
import { getHoseCodesForAtom as getHoseCodesForAtomFct } from './getHoseCodesForAtom';
import { getHoseCodesFromDiastereotopicID as getHoseCodesFromDiastereotopicIDFct } from './getHoseCodesFromDiastereotopicID';

export function getHoseCodesAndDiastereotopicIDs(molecule, options = {}) {
  getHoseCodesAndDiastereotopicIDsFct(getOCL(options), molecule, options);
}

export function getHoseCodesForAtom(molecule, atomID, options = {}) {
  getHoseCodesForAtomFct(getOCL(options), molecule, atomID, options);
}

export function getHoseCodesFromDiastereotopicID(
  diastereotopicID,
  options = {},
) {
  getHoseCodesFromDiastereotopicIDFct(
    getOCL(options),
    diastereotopicID,
    options,
  );
}
