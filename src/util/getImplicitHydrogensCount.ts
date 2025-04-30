import type { Molecule } from 'openchemlib';

export function getImplicitHydrogensCount(molecule: Molecule, atomID: number) {
  return molecule.getImplicitHydrogens(atomID);
}
