import { MF } from 'mf-parser';

import { getMF } from './getMF.js';

/**
 * @description Get the info of a molecule
 * @param {import('openchemlib').Molecule} molecule
 * @param {Map} moleculesInfo Map of molecules info
 * @returns {Object} object with molfile, idCode, mf, em, mz and charge
 */
export function getMoleculeInfo(molecule, moleculesInfo) {
  if (moleculesInfo.has(molecule)) {
    return moleculesInfo.get(molecule);
  }

  const mf = getMF(molecule).mf;
  const mfInfo = new MF(mf).getInfo();

  const moleculeInfo = {
    molfile: molecule.toMolfile(),
    idCode: molecule.getIDCode(),
    mf: getMF(molecule).mf,
    mw: mfInfo.mass,
    em: mfInfo.monoisotopicMass,
    mz: mfInfo.observedMonoisotopicMass,
    charge: mfInfo.charge,
  };
  moleculesInfo.set(molecule, moleculeInfo);
  return moleculeInfo;
}
