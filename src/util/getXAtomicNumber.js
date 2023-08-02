let xAtomicNumber = 0;

/**
 * Returns the atomic number of the X atom
 * @param {import('openchemlib').Molecule} molecule An instance of a molecule
 * @returns
 */
export function getXAtomicNumber(molecule) {
  if (!xAtomicNumber) {
    const OCL = molecule.getOCL();
    xAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(
      'X',
      OCL.Molecule.cPseudoAtomX,
    );
  }
  return xAtomicNumber;
}
