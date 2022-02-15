/**
 * Return the number of Primary amine groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @returns {number} 'Number of Primary amine groups'
 */

export function nbNH2(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 6) {
      let amine = false;
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
          molecule.getBondOrder(neighbourBond) === 1 &&
          molecule.getAllHydrogens(neighbourAtom) > 1
        ) {
          // If there is more than a Primary amine in the same carbon atom they are not couted as Primary amines groups
          if (amine) {
            amine = false;
            break;
          }
          amine = true;
        } else if (
          // If there is not at least one carbon or hydrogen as neighbour atom it is not counted as Primary amine group
          molecule.getAtomicNo(neighbourAtom) !== 6 &&
          molecule.getAtomicNo(neighbourAtom) !== 1
        ) {
          carbonOrHydrogen = false;
        }
      }
      if (amine && carbonOrHydrogen) counter++;
    }
  }

  return counter;
}
