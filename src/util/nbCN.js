/**
 * Return number of CN groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @param {number} 'CN groups'
 */

export function nbCN(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 6) {
      for (
        let neighbour = 0;
        neighbour < molecule.getConnAtoms(i);
        neighbour++
      ) {
        const neighbourAtom = molecule.getConnAtom(i, neighbour);

        const neighbourBond = molecule.getConnBond(i, neighbour);
        if (molecule.getAtomicNo(neighbourAtom) === 7) {
          if (molecule.getBondOrder(neighbourBond) === 3) {
            counter++;
          }
        }
      }
    }
  }

  return counter;
}
