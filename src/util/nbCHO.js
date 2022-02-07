/**
 * Return number of aldehyde groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @param {number} 'aldehyde groups'
 */

export function nbCHO(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 6) {
      let carbonyl = false;
      let carbonOrHydrogen = false;
      for (
        let neighbour = 0;
        neighbour < molecule.getConnAtoms(i);
        neighbour++
      ) {
        const neighbourAtom = molecule.getConnAtom(i, neighbour);

        const neighbourBond = molecule.getConnBond(i, neighbour);
        if (molecule.getAtomicNo(neighbourAtom) === 8) {
          if (molecule.getBondOrder(neighbourBond) === 2) {
            carbonyl = true;
          }
        }
        if (
          molecule.getAtomicNo(neighbourAtom) === 6 &&
          molecule.getAllHydrogens(i) > 0
        ) {
          carbonOrHydrogen = true;
        } else if (molecule.getAllHydrogens(i) > 1) {
          carbonOrHydrogen = true;
        }
      }
      if (carbonyl && carbonOrHydrogen) counter++;
    }
  }

  return counter;
}
