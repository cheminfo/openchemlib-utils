import { getOCL } from '../OCL';

import { addDiastereotopicMissingChirality as addDiastereotopicMissingChiralityFct } from './addDiastereotopicMissingChirality';
import { getDiastereotopicAtomIDs as getDiastereotopicAtomIDsFct } from './getDiastereotopicAtomIDs';
import { getDiastereotopicAtomIDsAndH as getDiastereotopicAtomIDsAndHFct } from './getDiastereotopicAtomIDsAndH';
import { toDiastereotopicSVG as toDiastereotopicSVGFct } from './toDiastereotopicSVG';

export function addDiastereotopicMissingChirality(molecule, options = {}) {
  addDiastereotopicMissingChiralityFct(getOCL(options), molecule, options);
}

export function getDiastereotopicAtomIDs(molecule, options = {}) {
  getDiastereotopicAtomIDsFct(getOCL(options), molecule);
}

export function getDiastereotopicAtomIDsAndH(molecule, options = {}) {
  getDiastereotopicAtomIDsAndHFct(getOCL(options), molecule);
}

export function toDiastereotopicSVG(molecule, options = {}) {
  toDiastereotopicSVGFct(getOCL(options), molecule, options);
}
