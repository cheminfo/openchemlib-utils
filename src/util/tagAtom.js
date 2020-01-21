import { getOCL } from '../OCL';

let xAtomicNumber = 0;

export function tagAtom(molecule, iAtom) {
  molecule.setAtomCustomLabel(iAtom, `${molecule.getAtomLabel(iAtom)}*`);
  if (molecule.getAtomicNo(iAtom) === 1) {
    molecule.setAtomicNo(iAtom, getXAtomicNumber());
  } else {
    // we can not use X because we would have problems with valencies if it is
    // expanded hydrogens or not
    // we can not only use a custom label because it does not count for the canonisation
    molecule.setAtomMass(iAtom, molecule.getAtomMass(iAtom) + 5);
  }
}

function getXAtomicNumber() {
  if (!xAtomicNumber) {
    const OCL = getOCL();
    xAtomicNumber = OCL.Molecule.getAtomicNoFromLabel('X');
  }
  return xAtomicNumber;
}
