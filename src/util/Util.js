import { getOCL } from '../OCL';

import { getAtomsInfo as getAtomsInfoFct } from './getAtomsInfo';
import { getConnectivityMatrix as getConnectivityMatrixFct } from './getConnectivityMatrix';
import { makeRacemic as makeRacemicFct } from './makeRacemic';
import { tagAtom as tagAtomFct } from './tagAtom';

export * from './isCsp3';

export function makeRacemic(molecule, options = {}) {
  makeRacemicFct(getOCL(options), molecule);
}

export function tagAtom(molecule, iAtom, options = {}) {
  tagAtomFct(getOCL(options), molecule, iAtom);
}

export function getConnectivityMatrix(molecule, options = {}) {
  getConnectivityMatrixFct(getOCL(options), molecule);
}

export function getAtomsInfo(molecule, options = {}) {
  getAtomsInfoFct(getOCL(options), molecule);
}
