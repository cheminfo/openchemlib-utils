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
  };
  moleculesInfo.set(molecule, reactantInfo);
  return reactantInfo;
}
