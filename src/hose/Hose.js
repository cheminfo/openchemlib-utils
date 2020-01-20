import { getOCL } from '../getOCL';

import { getHoseCodesAndDiastereotopicIDs as getHoseCodesAndDiastereotopicIDsFct } from './getHoseCodesAndDiastereotopicIDs';
import { getHoseCodesForAtom as getHoseCodesForAtomFct } from './getHoseCodesForAtom';
import { getHoseCodesFromDiastereotopicID as getHoseCodesFromDiastereotopicIDFct } from './getHoseCodesFromDiastereotopicID';

export let OCL;

export function initOCL(externalOCL) {
  OCL = externalOCL;
}

export function getHoseCodesAndDiastereotopicIDs(molecule, options = {}) {
  getHoseCodesAndDiastereotopicIDsFct(getOCL(OCL, options), molecule, options);
}

export function getHoseCodesForAtom(molecule, atomID, options = {}) {
  getHoseCodesForAtomFct(getOCL(OCL, options), molecule, atomID, options);
}

export function getHoseCodesFromDiastereotopicID(
  diastereotopicID,
  options = {},
) {
  getHoseCodesFromDiastereotopicIDFct(
    getOCL(OCL, options),
    diastereotopicID,
    options,
  );
}
