/**
 * Return number of CN groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @param {number} 'CN groups'
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
          if (cn) {
            cn = false;
            break;
          }
          cn = true;
        } else if (
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
