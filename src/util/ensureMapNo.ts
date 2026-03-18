import type { Molecule } from 'openchemlib';

/**
 * Ensures that all atoms in the molecule have a unique mapNo.
 * Atoms that already have a mapNo keep it. Atoms without a mapNo
 * are assigned the next available number starting from 1.
 * Throws if the molecule contains duplicate mapNo values.
 * @param molecule - The molecule to process (modified in place)
 */
export function ensureMapNo(molecule: Molecule): void {
  const existingMapNo: Record<string, boolean> = {};
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const mapNo = molecule.getAtomMapNo(i);
    if (mapNo) {
      if (existingMapNo[mapNo]) {
        throw new Error(
          'The molecule contains several atoms with the same mapNo',
        );
      }
      existingMapNo[mapNo] = true;
    }
  }
  let nextMapNo = 1;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const mapNo = molecule.getAtomMapNo(i);
    if (!mapNo) {
      while (existingMapNo[nextMapNo]) {
        nextMapNo++;
      }
      existingMapNo[nextMapNo] = true;
      molecule.setAtomMapNo(i, nextMapNo, false);
    }
  }
}
