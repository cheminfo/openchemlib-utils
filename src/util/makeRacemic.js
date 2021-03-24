/**
 *
 * @param {OCL.Molecule} [molecule] An instance of a molecule
 * @param {object} [options={}]
 * @param {object} [options.OCL] openchemlib library
 */
export function makeRacemic(molecule) {
  const { Molecule } = molecule.getOCL();

  // if we don't calculate this we have 2 epimers
  molecule.ensureHelperArrays(Molecule.cHelperCIP);

  // we need to make one group "AND" for chiral (to force to racemic, this means diastereotopic and not enantiotopic)
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomParity(i) !== Molecule.cAtomParityNone) {
      molecule.setAtomESR(i, Molecule.cESRTypeAnd, 0); // changed to group 0; TLS 9.Nov.2015
    }
  }
}
