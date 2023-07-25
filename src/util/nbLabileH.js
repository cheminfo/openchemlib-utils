/**
 * Return the number of labile protons being either on O, N, Br, Cl, F, I or S
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} [options={}]
 * @param {Array<number>} [options.atomicNumbers=[7, 8, 9, 16, 17, 35, 53]] - atomic numbers of the labile protons
 * @returns {number} 'Number of labile protons'
 */

export function nbLabileH(molecule, options = {}) {
  const { atomicNumbers = [7, 8, 9, 16, 17, 35, 53] } = options;
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (atomicNumbers.includes(molecule.getAtomicNo(i))) {
      counter += molecule.getAllHydrogens(i);
    }
  }

  return counter;
}
