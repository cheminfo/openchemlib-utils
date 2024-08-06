import type { Molecule } from 'openchemlib';

import { getXAtomicNumber } from './getXAtomicNumber';

/**
 * Tag an atom to be able to visualize it
 * @param molecule
 * @param iAtom
 */
export function tagAtom(molecule: Molecule, iAtom: number) {
  const customLabel = `${molecule.getAtomLabel(iAtom)}*`;
  molecule.setAtomCustomLabel(iAtom, customLabel);
  if (molecule.getAtomicNo(iAtom) === 1) {
    molecule.setAtomicNo(iAtom, getXAtomicNumber(molecule));
  } else {
    // we can not use X because we would have problems with valencies if it is
    // expanded hydrogens or not
    // we can not only use a custom label because it does not count for the canonisation
    molecule.setAtomMass(iAtom, molecule.getAtomMass(iAtom) + 5);
  }
  return customLabel;
}
