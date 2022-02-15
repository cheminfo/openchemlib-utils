/**
 * Return the number of Nitrile groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @returns {number} 'Number of Nitrile groups'
 */

export function nbCN(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 6) {
      let cn = false;
      let carbonOrHydrogen = true;
      for (
        let neighbour = 0;
        neighbour < molecule.getConnAtoms(i);
        neighbour++
      ) {
        const neighbourAtom = molecule.getConnAtom(i, neighbour);

        const neighbourBond = molecule.getConnBond(i, neighbour);

        if (
          molecule.getAtomicNo(neighbourAtom) === 7 &&
          molecule.getBondOrder(neighbourBond) === 3
        ) {
          // If there is more than one Nitrile group in the same carbon atome they are not counted as Nitrile groups
          if (cn) {
            cn = false;
            break;
          }
          cn = true;
        } else if (
          // If there is not at least one carbon or hydrogen as neighbour atom it is not counted as Nitrile group
          molecule.getAtomicNo(neighbourAtom) !== 6 &&
          molecule.getAtomicNo(neighbourAtom) !== 1
        ) {
          carbonOrHydrogen = false;
        }
      }

      if (cn && carbonOrHydrogen) counter++;
    }
  }

  return counter;
}
