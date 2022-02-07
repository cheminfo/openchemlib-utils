/**
 * Check if a specific atom is a sp3 carbon
 * @param {OCL.Molecule} molecule
 * @param {number} atomID
 */

export function nbOH(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 8 && molecule.getAllHydrogens(i) > 0) {
      counter++;
    }
  }
  return counter;
}
