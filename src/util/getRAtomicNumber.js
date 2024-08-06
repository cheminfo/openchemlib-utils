let rAtomicNumber = 0;

/**
 * Returns the atomic number of the X atom
 * @param {import('openchemlib').Molecule} molecule - An instance of a molecule
 * @returns
 */
export function getRAtomicNumber(molecule) {
  if (!rAtomicNumber) {
    const OCL = molecule.getOCL();
    rAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(
      'R',
      OCL.Molecule.cPseudoAtomR,
    );
  }
  return rAtomicNumber;
}
