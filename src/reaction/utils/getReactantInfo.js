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
  let exactMass = molecule.getMolecularFormula().absoluteWeight;
  let charge = getCharge(molecule);
  const reactantInfo = {
    molfile: molecule.toMolfile(),
    idCode: molecule.getIDCode(),
    mf: getMF(molecule).mf,
    em: exactMass,
    mz: exactMass / (charge === 0 ? 1 : Math.abs(charge)),
    charge,
  };
  moleculesInfo.set(molecule, reactantInfo);
  return reactantInfo;
}
