let xAtomicNumber = 0;

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
