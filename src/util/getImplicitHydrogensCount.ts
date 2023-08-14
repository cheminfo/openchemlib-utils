import type { Molecule } from 'openchemlib';

export function getImplicitHydrogensCount(molecule: Molecule, atomID: number) {
  molecule.ensureHelperArrays(molecule.getOCL().Molecule.cHelperNeighbours);
  return (
    molecule.getAllHydrogens(atomID) +
    molecule.getConnAtoms(atomID) -
    molecule.getAllConnAtoms(atomID)
  );
}
