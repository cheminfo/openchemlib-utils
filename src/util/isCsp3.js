/**
 * Check if a specific atom is a sp3 carbon
 * @param {OCL.Molecule} molecule
 * @param {number} atomID
 */

export function isCsp3(molecule, atomID) {
  if (molecule.getAtomicNo(atomID) !== 6) return false;
  if (molecule.getAtomCharge(atomID) !== 0) return false;
  if (
    molecule.getImplicitHydrogens(atomID) + molecule.getConnAtoms(atomID) !==
    4
  ) {
    return false;
  }
  return true;
}
