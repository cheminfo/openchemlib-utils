import { getCharge } from '../../util/getCharge.js';
import { getMF } from '../../util/getMF.js';

/**
 *
 * @param {import('openchemlib').Molecule} molecule
 * @param {Map} moleculesInfo
 * @returns
 */
export function getInfo(molecule, moleculesInfo) {
  if (moleculesInfo.has(molecule)) {
    return moleculesInfo.get(molecule);
  }
  const reactantInfo = {
    molfile: molecule.toMolfile(),
    idCode: molecule.getIDCode(),
    mf: getMF(molecule).mf,
    em: Math.round(molecule.getMolecularFormula().absoluteWeight*1e6)/1e6,
    charge: getCharge(molecule),
  };
  moleculesInfo.set(molecule, reactantInfo);
  return reactantInfo;
}
