import { getCharge } from '../../util/getCharge.js';
import { getMF } from '../../util/getMF.js';

/**
 * @description Get the info of a molecule
 * @param {import('openchemlib').Molecule} molecule
 * @param {Map} moleculesInfo Map of molecules info
 * @returns {Object} object with molfile, idCode, mf, em, mz and charge
 */
export function getInfo(molecule, moleculesInfo) {
  if (moleculesInfo.has(molecule)) {
    return moleculesInfo.get(molecule);
  }
  let em = molecule.getMolecularFormula().absoluteWeight;
  let charge = getCharge(molecule);
  let mz = em / (charge === 0 ? 1 : Math.abs(charge));
  const reactantInfo = {
    molfile: molecule.toMolfile(),
    idCode: molecule.getIDCode(),
    mf: getMF(molecule).mf,
    em,
    mz,
    charge,
  };
  moleculesInfo.set(molecule, reactantInfo);
  return reactantInfo;
}
