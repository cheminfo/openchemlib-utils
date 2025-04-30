import type { Molecule } from 'openchemlib';

/**
 * Toggle presence of implicity hydrogens on/off
 * @param molecule
 * @param atomID
 */
export function toggleHydrogens(molecule: Molecule, atomID: number) {
  if (molecule.getImplicitHydrogens(atomID) === 0) {
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
