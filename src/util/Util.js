import { getOCL } from '../getOCL';

import { getConnectivityMatrix as getConnectivityMatrixFct } from './getConnectivityMatrix';
import { makeRacemic as makeRacemicFct } from './makeRacemic';
import { tagAtom as tagAtomFct } from './tagAtom';

export * from './isCsp3';

export let OCL;

export function makeRacemic(molecule, options = {}) {
  makeRacemicFct(getOCL(OCL, options), molecule);
}

export function tagAtom(molecule, iAtom, options = {}) {
  tagAtomFct(getOCL(OCL, options), molecule, iAtom);
}

export function getConnectivityMatrix(molecule, options = {}) {
  getConnectivityMatrixFct(getOCL(OCL, options), molecule);
}

export function initOCL(externalOCL) {
  OCL = externalOCL;
}
