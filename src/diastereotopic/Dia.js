import { getOCL } from '../getOCL';

import { addDiastereotopicMissingChirality as addDiastereotopicMissingChiralityFct } from './addDiastereotopicMissingChirality';
import { getDiastereotopicAtomIDs as getDiastereotopicAtomIDsFct } from './getDiastereotopicAtomIDs';
import { getDiastereotopicAtomIDsAndH as getDiastereotopicAtomIDsAndHFct } from './getDiastereotopicAtomIDsAndH';
import { toDiastereotopicSVG as toDiastereotopicSVGFct } from './toDiastereotopicSVG';

export let OCL;

export function initOCL(externalOCL) {
  OCL = externalOCL;
}

export function addDiastereotopicMissingChirality(molecule, options = {}) {
  addDiastereotopicMissingChiralityFct(getOCL(OCL, options), molecule, options);
}

export function getDiastereotopicAtomIDs(molecule, options = {}) {
  getDiastereotopicAtomIDsFct(getOCL(OCL, options), molecule);
}

export function getDiastereotopicAtomIDsAndH(molecule, options = {}) {
  getDiastereotopicAtomIDsAndHFct(getOCL(OCL, options), molecule);
}

export function toDiastereotopicSVG(molecule, options = {}) {
  toDiastereotopicSVGFct(getOCL(OCL, options), molecule, options);
}
