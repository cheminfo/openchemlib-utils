/**
 * Return the number of Carbonyl groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @returns {number} 'Number of Carbonyl groups'
 */

export function nbCHO(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    // if there is not at least one hydrogen in the carbon atom there can not be a carbonyl group
    if (molecule.getAtomicNo(i) === 6 && molecule.getAllHydrogens(i) > 0) {
      let carbonyl = false;
      let carbonOrHydrogen = true;
      for (
        let neighbour = 0;
        neighbour < molecule.getConnAtoms(i);
        neighbour++
      ) {
        const neighbourAtom = molecule.getConnAtom(i, neighbour);

        const neighbourBond = molecule.getConnBond(i, neighbour);
        if (molecule.getAtomicNo(neighbourAtom) === 8) {
          if (molecule.getBondOrder(neighbourBond) === 2) {
            // If there is more than one carbonyl group on the same carbon atom they are not counted as carbonyl groups
            if (carbonyl) {
              carbonyl = false;
              break;
            }
            carbonyl = true;
          }
        } else if (
          // If there is not at least one carbon or hydrogen as neighbour atom it is not counted as Carbonyl group
          molecule.getAtomicNo(neighbourAtom) !== 6 &&
          molecule.getAtomicNo(neighbourAtom) !== 1
        ) {
          carbonOrHydrogen = false;
        }
      }
      if (carbonyl && carbonOrHydrogen) counter++;
    }
  }

  return counter;
}
