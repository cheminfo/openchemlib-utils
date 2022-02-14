/**
 * Return the number of Hydroxyl groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @returns {number} 'Number of Hydroxyl groups'
 */

export function nbOH(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 6) {
      let carbonyl = false;
      let hydroxyl = false;
      let carbonOrHydrogen = true;
      for (
        let neighbour = 0;
        neighbour < molecule.getConnAtoms(i);
        neighbour++
      ) {
        const neighbourAtom = molecule.getConnAtom(i, neighbour);

        const neighbourBond = molecule.getConnBond(i, neighbour);
        if (molecule.getAtomicNo(neighbourAtom) === 8) {
          if (
            molecule.getBondOrder(neighbourBond) === 1 &&
            molecule.getAllHydrogens(neighbourAtom) > 0
          ) {
            // If there is more than a Hydroxyl in the same carbon atome they are not couted as Hydroxyl groups
            if (hydroxyl) {
              hydroxyl = false;
              break;
            }
            hydroxyl = true;
          } else if (molecule.getBondOrder(neighbourBond) === 2) {
            // If there is Carbonyl group on the same carbon atom it is not couted as Hydroxyl group
            carbonyl = true;
          }
        } else if (
          // If there is not at least one carbon or hydrogen as neighbour atom it is not counted as Hydroxyl group
          molecule.getAtomicNo(neighbourAtom) !== 6 &&
          molecule.getAtomicNo(neighbourAtom) !== 1
        ) {
          carbonOrHydrogen = false;
        }
      }
      if (carbonyl === false && hydroxyl && carbonOrHydrogen) counter++;
    }
  }

  return counter;
}
