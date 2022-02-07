/**
 * Return number of NH2 groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @param {number} 'NH2 groups'
 */

export function nbNH2(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 6) {
      let amine = false;
      let carbonOrHydrogen = false;
      for (
        let neighbour = 0;
        neighbour < molecule.getConnAtoms(i);
        neighbour++
      ) {
        const neighbourAtom = molecule.getConnAtom(i, neighbour);

        const neighbourBond = molecule.getConnBond(i, neighbour);
        if (molecule.getAtomicNo(neighbourAtom) === 7) {
          if (
            molecule.getBondOrder(neighbourBond) === 1 &&
            molecule.getAllHydrogens(neighbourAtom) > 1
          ) {
            if (amine) {
              amine = false;
              break;
            }
            amine = true;
          }
        }
        if (
          molecule.getAtomicNo(neighbourAtom) === 6 ||
          molecule.getAllHydrogens(i) > 0
        ) {
          carbonOrHydrogen = true;
        }
      }
      if (amine && carbonOrHydrogen) counter++;
    }
  }

  return counter;
}
