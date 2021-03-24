import { tagAtom } from '../util/tagAtom';

/**
 * Add either missing chirality of diastereotopic missing chirality
 * The problem is that sometimes we need to add chiral bond that was not planned because it is the same group
 * This is the case for example for the valine where the 2 C of the methyl groups are diastereotopic
 * @param {OCL.Molecule} molecule
 * @param {object} [options={}]
 * @param {number} [options.esrType=cESRTypeAnd]
 */
export function addDiastereotopicMissingChirality(molecule, options = {}) {
  const { Molecule } = molecule.getOCL();
  const { esrType = Molecule.cESRTypeAnd } = options;

  for (let iAtom = 0; iAtom < molecule.getAllAtoms(); iAtom++) {
    let tempMolecule = molecule.getCompactCopy();
    tagAtom(tempMolecule, iAtom);
    // After copy, helpers must be recalculated
    tempMolecule.ensureHelperArrays(Molecule.cHelperBitsStereo);
    // We need to have >0 and not >1 because there could be unspecified chirality in racemate

    for (let i = 0; i < tempMolecule.getAtoms(); i++) {
      // changed from from handling below; TLS 9.Nov.2015
      if (
        tempMolecule.isAtomStereoCenter(i) &&
        tempMolecule.getStereoBond(i) === -1
      ) {
        let stereoBond = tempMolecule.getAtomPreferredStereoBond(i);
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
}
