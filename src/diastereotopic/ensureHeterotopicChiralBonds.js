import { getChiralOrHeterotopicCarbons } from './getChiralOrHeterotopicCarbons.js';

/**
 * This function will add missing chiral bonds on carbons ensure that all enantiotopic
 * or diastereotopic atoms can be identified uniquely
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} [options={}]
 * @param {number} [options.esrType=Molecule.cESRTypeAnd]
 * @param {boolean} [options.atLeastThreeAtoms=true] - if true, only carbons with at least three atoms will be considered
 */
export function ensureHeterotopicChiralBonds(molecule, options = {}) {
  const { Molecule } = molecule.getOCL();
  const { esrType = Molecule.cESRTypeAnd, atLeastThreeAtoms = true } = options;

  const heterotopicCarbons = getChiralOrHeterotopicCarbons(molecule);

  for (let i of heterotopicCarbons) {
    if (atLeastThreeAtoms && molecule.getConnAtoms(i) < 3) continue;
    if (molecule.getStereoBond(i) === -1) {
      let stereoBond = molecule.getAtomPreferredStereoBond(i);
      if (stereoBond !== -1) {
        molecule.setBondType(stereoBond, Molecule.cBondTypeUp);
        if (molecule.getBondAtom(1, stereoBond) === i) {
          let connAtom = molecule.getBondAtom(0, stereoBond);
          molecule.setBondAtom(0, stereoBond, i);
          molecule.setBondAtom(1, stereoBond, connAtom);
        }
        // To me it seems that we have to add all stereo centers into AND group 0. TLS 9.Nov.2015
        molecule.setAtomESR(i, esrType, 0);
      }
    }
  }
}
