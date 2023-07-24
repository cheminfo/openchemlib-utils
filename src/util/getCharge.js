/**
 * Returns the charge of a molecule
 * @param {import('openchemlib').Molecule} molecule an instance of OCL.Molecule
 * @returns {number}
 */

export function getCharge(molecule) {
  let charge = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    charge += molecule.getAtomCharge(i);
  }
  return charge;
}
