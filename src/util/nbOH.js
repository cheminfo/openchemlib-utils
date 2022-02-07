/**
 * Return number of OH groups in a molecule or fragment
 * @param {OCL.Molecule} molecule
 * @param {number} 'OH groups'
 */

export function nbOH(molecule) {
  let counter = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) === 6) {
      let carbonyl = false;
      let hydroxyl = false;
      let carbonOrHydrogen = false;
      for (
        let neighbour = 0;
        neighbour < molecule.getConnAtoms(i);
        neighbour++
      ) {
        const neighbourAtom = molecule.getConnAtom(i, neighbour);

        const neighbourBond = molecule.getConnBond(i, neighbour);
        console.log(molecule.getAtomicNo(neighbourAtom));
        if (molecule.getAtomicNo(neighbourAtom) === 8) {
          if (
            molecule.getBondOrder(neighbourBond) === 1 &&
            molecule.getAllHydrogens(neighbourAtom) > 0
          ) {
            if (hydroxyl) {
              hydroxyl = false;
              break;
            }
            hydroxyl = true;
          } else if (molecule.getBondOrder(neighbourBond) === 2) {
            carbonyl = true;
          }
        }
        if (
          molecule.getAtomicNo(neighbourAtom) === 6 ||
          molecule.getAllHydrogens(i) > 0
        ) {
          carbonOrHydrogen = true;
        }
      }
      if (carbonyl === false && hydroxyl && carbonOrHydrogen) counter++;
    }
  }

  return counter;
}
