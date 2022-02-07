/**
 * Return number of NH2 groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @param {number} 'NH2 groups'
 */

export function nbNH2(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 7 && molecule.getAllHydrogens(i) > 1) {
      counter++;
    }
  }
  return counter;
}
