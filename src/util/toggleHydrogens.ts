import type { Molecule } from 'openchemlib';

import { getImplicitHydrogensCount } from './getImplicitHydrogensCount';

/**
 * Toggle presence of implicity hydrogens on/off
 * @param molecule
 * @param atomID
 */
export function toggleHydrogens(molecule: Molecule, atomID: number) {
  if (getImplicitHydrogensCount(molecule, atomID) === 0) {
    const atomsToDelete = [];
    for (let i = 0; i < molecule.getAllConnAtoms(atomID); i++) {
      const connectedAtom = molecule.getConnAtom(atomID, i);
      if (molecule.getAtomicNo(connectedAtom) === 1) {
        atomsToDelete.push(connectedAtom);
      }
    }
    molecule.deleteAtoms(atomsToDelete);
  } else {
    molecule.addImplicitHydrogens(atomID);
  }
}
